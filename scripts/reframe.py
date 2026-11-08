import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

MODEL = str(Path(__file__).with_name("face_detection_yunet_2023mar.onnx"))
ANALYSIS_WIDTH = 640
DETECT_EVERY = 3
CUT_THRESHOLD = 20
MIN_SHOT_SECONDS = 0.4
STILL_RANGE = 0.2
SMOOTH_SECONDS = 0.5
KEEP_IN = 0.15


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate,start_time", "-of", "json", path],
        capture_output=True, text=True, check=True,
    ).stdout
    s = json.loads(out)["streams"][0]
    num, den = map(int, s["r_frame_rate"].split("/"))
    return s["width"], s["height"], num / den, float(s.get("start_time") or 0)


def frames(path, w, h):
    proc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
        stdout=subprocess.PIPE,
    )
    size = w * h * 3
    while len(buf := proc.stdout.read(size)) == size:
        yield np.frombuffer(buf, np.uint8).reshape(h, w, 3)
    proc.wait()


def pick(faces, prev):
    areas = faces[:, 2] * faces[:, 3]
    centers = faces[:, 0] + faces[:, 2] / 2
    best = int(np.argmax(areas))
    if prev is not None:
        near = int(np.argmin(np.abs(centers - prev)))
        if areas[near] >= areas[best] / 2:
            best = near
    return float(centers[best])


def smooth(values, sigma):
    r = max(1, int(sigma * 3))
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    return np.convolve(np.pad(values, r, mode="edge"), k / k.sum(), mode="valid")


def track(path, w, h, fps):
    aw = ANALYSIS_WIDTH
    ah = round(aw * h / w / 2) * 2
    detector = cv2.FaceDetectorYN.create(MODEL, "", (aw, ah), 0.6)
    targets, cuts, prev_small, prev_x = [], [0], None, None
    for i, frame in enumerate(frames(path, aw, ah)):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        small = cv2.resize(gray, (32, 18), interpolation=cv2.INTER_AREA).astype(np.float32)
        cut = (
            prev_small is not None
            and float(np.abs(small - prev_small).mean()) > CUT_THRESHOLD
            and i - cuts[-1] >= fps * MIN_SHOT_SECONDS
        )
        prev_small = small
        if cut:
            cuts.append(i)
            prev_x = None
        x = None
        if cut or i % DETECT_EVERY == 0:
            faces = detector.detect(frame)[1]
            if faces is not None:
                x = prev_x = pick(faces, prev_x)
        targets.append(None if x is None else x * w / aw)
    return targets, cuts


def plan(path, ratio):
    w, h, fps, start = probe(path)
    crop_w = min(w, round(h * ratio / 2) * 2)
    targets, cuts = track(path, w, h, fps)
    n = len(targets)
    centers = np.full(n, w / 2)
    for a, b in zip(cuts, cuts[1:] + [n]):
        seen = [(i, x) for i, x in enumerate(targets[a:b]) if x is not None]
        if not seen:
            continue
        idx, xs = (np.array(v) for v in zip(*seen))
        if np.percentile(xs, 90) - np.percentile(xs, 10) < crop_w * STILL_RANGE:
            centers[a:b] = np.median(xs)
        else:
            raw = np.interp(np.arange(b - a), idx, xs)
            margin = crop_w * KEEP_IN
            centers[a:b] = np.clip(smooth(raw, fps * SMOOTH_SECONDS), raw - margin, raw + margin)
    lefts = np.clip(np.round(centers - crop_w / 2), 0, w - crop_w).astype(int)
    commands, last = [], None
    for i, x in enumerate(lefts):
        if x != last:
            commands.append(f"{start + i / fps:.4f} crop x {x};")
            last = x
    return {
        "width": crop_w,
        "height": h,
        "x": int(lefts[0]) if n else (w - crop_w) // 2,
        "shots": len(cuts),
        "commands": "\n".join(commands),
    }


if __name__ == "__main__":
    print(json.dumps(plan(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 9 / 16)))

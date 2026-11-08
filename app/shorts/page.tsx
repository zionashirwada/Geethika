"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import { Crosshair, Download, Loader2, Play, Scissors, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Cue,
  HEADLINE_OVERLAYS,
  OVERLAY_STYLES,
  OverlayStyle,
  SUBTITLE_STYLES,
  SubtitleStyle,
  Word,
  fmt,
  parseTime,
  previewMoment,
} from "@/lib/shorts"

interface VideoInfo {
  id: string
  title: string
  channel: string
  duration: number
  transcriptLang: string | null
  transcript: Cue[]
}

const MAX_CLIP_SECONDS = 300
const YT_API = "https://www.youtube.com/iframe_api"

type Look = { subtitle: SubtitleStyle; overlay: OverlayStyle; headline: string }

const shortRequest = (info: VideoInfo, words: Word[], start: number, end: number, look: Look, extra = {}) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: info.id,
    start,
    end,
    ...look,
    channel: info.channel,
    words: words.filter((w) => w.end > start && w.start < end),
    ...extra,
  }),
})

export default function ShortCreator() {
  const [url, setUrl] = useState("")
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [busy, setBusy] = useState<"info" | "clip" | null>(null)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [anchor, setAnchor] = useState<number | null>(null)
  const [subtitle, setSubtitle] = useState<SubtitleStyle>("bold")
  const [overlay, setOverlay] = useState<OverlayStyle>("clean")
  const [headline, setHeadline] = useState("")
  const [now, setNow] = useState(0)
  const [clip, setClip] = useState<{ url: string; name: string } | null>(null)
  const [preview, setPreview] = useState<{ image: string; at: number } | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const stopAtRef = useRef<number | null>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!info || !box) return
    const w = window as any
    let timer: ReturnType<typeof setInterval> | undefined
    const mount = () => {
      playerRef.current = new w.YT.Player(box.appendChild(document.createElement("div")), {
        videoId: info.id,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0 },
      })
      timer = setInterval(() => {
        const player = playerRef.current
        const t = player?.getCurrentTime?.() ?? 0
        setNow(t)
        if (stopAtRef.current !== null && t >= stopAtRef.current) {
          player.pauseVideo()
          stopAtRef.current = null
        }
      }, 250)
    }
    if (w.YT?.Player) mount()
    else {
      w.onYouTubeIframeAPIReady = mount
      if (!document.querySelector(`script[src="${YT_API}"]`)) {
        document.body.appendChild(Object.assign(document.createElement("script"), { src: YT_API }))
      }
    }
    return () => {
      clearInterval(timer)
      playerRef.current?.destroy?.()
      playerRef.current = null
      box.replaceChildren()
      w.onYouTubeIframeAPIReady = undefined
    }
  }, [info])

  useEffect(() => () => {
    if (clip) URL.revokeObjectURL(clip.url)
  }, [clip])

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview.image)
  }, [preview])

  const cues = info?.transcript ?? []
  const words = useMemo(() => (info ? info.transcript.flatMap((c) => c.words) : []), [info])
  const s = parseTime(start)
  const e = parseTime(end)
  const rangeError =
    !(s >= 0) || !(e > s)
      ? "Set a start time before the end time"
      : info?.duration && e > info.duration
        ? "End time is past the end of the video"
        : e - s > MAX_CLIP_SECONDS
          ? `Clips are limited to ${MAX_CLIP_SECONDS / 60} minutes`
          : null
  const moment = rangeError ? null : previewMoment(words, s, e)
  const still = !info
    ? ""
    : preview
      ? `/api/shorts?url=${info.id}&frame=${preview.at}`
      : `https://i.ytimg.com/vi/${info.id}/mqdefault.jpg`

  useEffect(() => {
    if (!info || moment === null) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setPreviewing(true)
      try {
        const res = await fetch("/api/shorts", {
          ...shortRequest(info, words, s, e, { subtitle, overlay, headline }, { preview: true, at: moment }),
          signal: controller.signal,
        })
        if (!res.ok) throw new Error((await res.json()).message)
        setPreview({ image: URL.createObjectURL(await res.blob()), at: moment })
      } catch (err: any) {
        if (err.name !== "AbortError") toast.error(err.message || "Could not render the preview")
      } finally {
        if (!controller.signal.aborted) setPreviewing(false)
      }
    }, 400)
    return () => {
      clearTimeout(timer)
      controller.abort()
      setPreviewing(false)
    }
  }, [info, words, s, e, moment, subtitle, overlay, headline])

  const loadVideo = async () => {
    if (!url.trim() || busy) return
    setBusy("info")
    try {
      const res = await fetch(`/api/shorts?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setInfo(data)
      setHeadline(data.title)
      setStart("")
      setEnd("")
      setAnchor(null)
      setClip(null)
      setPreview(null)
    } catch (err: any) {
      toast.error(err.message || "Could not load that video")
    } finally {
      setBusy(null)
    }
  }

  const pickCue = (i: number) => {
    playerRef.current?.seekTo?.(cues[i].start, true)
    const [a, b] = anchor === null ? [i, i] : [Math.min(anchor, i), Math.max(anchor, i)]
    setStart(fmt(cues[a].start))
    setEnd(fmt(cues[b].end))
    setAnchor(anchor === null ? i : null)
  }

  const playSelection = () => {
    stopAtRef.current = e
    playerRef.current?.seekTo?.(s, true)
    playerRef.current?.playVideo?.()
  }

  const generate = async () => {
    if (!info) return
    setBusy("clip")
    try {
      const res = await fetch("/api/shorts", shortRequest(info, words, s, e, { subtitle, overlay, headline }))
      if (!res.ok) throw new Error((await res.json()).message)
      const name = `${info.title} ${fmt(s)} to ${fmt(e)}.mp4`.replace(/[\\/:*?"<>|]+/g, "-")
      setClip({ url: URL.createObjectURL(await res.blob()), name })
      toast.success("Clip ready")
    } catch (err: any) {
      toast.error(err.message || "Could not create the clip")
    } finally {
      setBusy(null)
    }
  }

  const timeFields = [
    ["Start", start, setStart],
    ["End", end, setEnd],
  ] as const

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Short Creator</h1>

      <div className="flex gap-2 mb-6">
        <Input
          value={url}
          onChange={(ev) => setUrl(ev.target.value)}
          onKeyDown={(ev) => ev.key === "Enter" && loadVideo()}
          placeholder="Paste a YouTube link"
          className="border-slate-600 rounded-xl"
        />
        <Button
          onClick={loadVideo}
          disabled={!url.trim() || busy !== null}
          className="flex items-center gap-2 rounded-xl bg-[#d63736] hover:bg-[#d63736]/90"
        >
          {busy === "info" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Fetch
        </Button>
      </div>

      {!info ? (
        <div className="bg-[#161616] rounded-lg p-8 text-center text-gray-500">
          Paste a YouTube link to load the video and its transcript, pick a time range, then generate an MP4 clip.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#161616] rounded-lg p-4">
              <div ref={boxRef} className="aspect-video w-full overflow-hidden rounded-lg bg-black" />
              <h2 className="mt-3 font-semibold text-primary">{info.title}</h2>
              <p className="text-sm text-gray-400">
                {info.channel} · {fmt(info.duration).slice(0, -2)}
              </p>
            </div>

            <div className="bg-[#161616] rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {timeFields.map(([label, value, set]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <div className="flex gap-2">
                      <Input
                        value={value}
                        onChange={(ev) => {
                          set(ev.target.value)
                          setAnchor(null)
                        }}
                        placeholder="0:00.0"
                        className="border-slate-600 rounded-xl font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title={`Set ${label.toLowerCase()} to the current player time`}
                        className="shrink-0 border-slate-600 rounded-xl hover:bg-[#d63736]/10"
                        onClick={() => {
                          set(fmt(playerRef.current?.getCurrentTime?.() ?? 0))
                          setAnchor(null)
                        }}
                      >
                        <Crosshair size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-400">
                {!rangeError
                  ? `Clip length: ${(e - s).toFixed(1)}s`
                  : start && end
                    ? rangeError
                    : "Pick a range from the transcript or the player"}
              </p>

              <div className="grid gap-4 md:grid-cols-[1fr_200px]">
                <div className="min-w-0 space-y-4">
                  <Picker
                    label="Overlay"
                    options={OVERLAY_STYLES}
                    value={overlay}
                    onChange={setOverlay}
                    render={(id) => <OverlayPreview id={id} still={still} />}
                  />
                  {HEADLINE_OVERLAYS.includes(overlay) && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Headline</label>
                      <Input
                        value={headline}
                        onChange={(ev) => setHeadline(ev.target.value)}
                        maxLength={150}
                        className="border-slate-600 rounded-xl"
                      />
                    </div>
                  )}
                  <Picker
                    label="Captions"
                    options={SUBTITLE_STYLES}
                    value={subtitle}
                    onChange={setSubtitle}
                    render={(id) => (
                      <div
                        className="flex h-24 items-end justify-center rounded-md bg-cover bg-center px-1 pb-2 text-center text-white"
                        style={{ backgroundImage: `linear-gradient(transparent 30%,#000 75%),url(${still})` }}
                      >
                        <CaptionPreview id={id} />
                      </div>
                    )}
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Preview</p>
                  <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg border border-slate-700 bg-black">
                    {preview ? (
                      <Image
                        src={preview.image}
                        alt="Frame from the selection with the chosen overlay and captions"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <p className="flex h-full items-center justify-center p-4 text-center text-xs text-gray-500">
                        {rangeError ? "Pick a range to preview a real frame" : "Rendering preview..."}
                      </p>
                    )}
                    {previewing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="animate-spin" />
                      </div>
                    )}
                  </div>
                  {preview && <p className="mt-1 text-xs text-gray-500">Frame at {fmt(preview.at)}</p>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={!!rangeError}
                  onClick={playSelection}
                  className="flex items-center gap-2 border-slate-600 rounded-xl hover:bg-[#d63736]/10"
                >
                  <Play size={16} />
                  Play selection
                </Button>
                <Button
                  disabled={!!rangeError || busy !== null}
                  onClick={generate}
                  className="flex items-center gap-2 rounded-xl bg-[#d63736] hover:bg-[#d63736]/90"
                >
                  {busy === "clip" ? <Loader2 size={16} className="animate-spin" /> : <Scissors size={16} />}
                  {busy === "clip" ? "Generating..." : "Generate 9:16 short"}
                </Button>
              </div>
              {busy === "clip" && (
                <p className="text-xs text-gray-500">
                  Downloading at the best available resolution, tracking the speaker, reframing to 9:16 and adding
                  captions. Long clips can take a few minutes.
                </p>
              )}
            </div>

            {clip && (
              <div className="bg-[#161616] rounded-lg p-4 space-y-3">
                <video src={clip.url} controls className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg bg-black" />
                <Button asChild className="flex w-fit items-center gap-2 rounded-xl bg-[#d63736] hover:bg-[#d63736]/90">
                  <a href={clip.url} download={clip.name}>
                    <Download size={16} />
                    Save MP4
                  </a>
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-[#161616] rounded-lg p-4">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-xl font-semibold text-primary">Transcript</h2>
              {info.transcriptLang && <span className="text-xs text-gray-500">{info.transcriptLang}</span>}
            </div>
            {cues.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                No captions for this video. Use the player and the crosshair buttons to pick times.
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-3">
                  Click a line to start a selection, then click another line to extend it.
                </p>
                <div className="max-h-[70vh] overflow-y-auto space-y-1 pr-1">
                  {cues.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => pickCue(i)}
                      className={`flex w-full gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/5 ${
                        c.start >= s - 0.05 && c.end <= e + 0.05 ? "bg-[#d63736]/20" : ""
                      } ${anchor === i ? "ring-1 ring-[#d63736]" : ""} ${
                        now >= c.start && now < c.end ? "text-white" : "text-gray-400"
                      }`}
                    >
                      <span className="shrink-0 font-mono text-xs leading-5 text-gray-500">{fmt(c.start).slice(0, -2)}</span>
                      <span>{c.text}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Picker<T extends string>({
  label,
  options,
  value,
  onChange,
  render,
}: {
  label: string
  options: readonly { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  render: (id: T) => React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
            className={`rounded-xl border p-1.5 text-xs transition-colors ${
              value === o.id ? "border-[#d63736] bg-[#d63736]/10" : "border-slate-700 hover:border-slate-500"
            }`}
          >
            {render(o.id)}
            <span className="mt-1.5 block truncate">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const stroke = (px: number): React.CSSProperties => ({ WebkitTextStroke: `${px}px #000`, paintOrder: "stroke fill" })

function CaptionPreview({ id }: { id: SubtitleStyle }) {
  if (id === "bold")
    return (
      <span className="text-[13px] uppercase leading-tight" style={{ fontFamily: "Avenir Next", fontWeight: 900, ...stroke(3) }}>
        Grace <span className="text-[#FFD400]">changes</span> everything
      </span>
    )
  if (id === "pop")
    return (
      <span className="text-2xl uppercase text-[#FFD400]" style={{ fontFamily: "Impact", ...stroke(4) }}>
        Changes
      </span>
    )
  if (id === "karaoke")
    return (
      <span className="text-[13px] leading-tight" style={{ fontFamily: "Avenir Next", fontWeight: 700, ...stroke(2) }}>
        <span className="text-[#FF4B3E]">Grace chan</span>ges everything
      </span>
    )
  if (id === "boxed")
    return (
      <span className="rounded bg-black/70 px-1.5 py-0.5 text-[12px] leading-snug" style={{ fontFamily: "Helvetica Neue", fontWeight: 700 }}>
        Grace changes everything
      </span>
    )
  if (id === "minimal")
    return (
      <span className="text-[12px]" style={{ fontFamily: "Avenir Next", fontWeight: 500, textShadow: "0 2px 4px rgba(0,0,0,.8)" }}>
        Grace changes everything
      </span>
    )
  return <span className="text-xs text-gray-300">Off</span>
}

const FULL_FRAME = { shade: "top-[50%] bg-[linear-gradient(transparent,#000_46%)]", caption: "bottom-[16%]" }

const LOWER_THIRDS: Record<OverlayStyle, { shade: string; caption: string }> = {
  clean: FULL_FRAME,
  headline: FULL_FRAME,
  progress: FULL_FRAME,
  cinematic: { shade: "top-[53%] bg-[linear-gradient(transparent,#000_30%)]", caption: "bottom-[18%]" },
  blur: { shade: "top-[47%] bg-[linear-gradient(transparent,#000_19%)]", caption: "bottom-[25%]" },
}

function OverlayPreview({ id, still }: { id: OverlayStyle; still: string }) {
  const image = { backgroundImage: `url(${still})` }
  return (
    <div className="relative mx-auto h-24 w-[54px] overflow-hidden rounded-md bg-black">
      {id === "blur" ? (
        <>
          <div className="absolute inset-0 scale-150 bg-cover bg-center blur-sm brightness-75" style={image} />
          <div className="absolute inset-x-0 top-1/2 aspect-video -translate-y-1/2 bg-cover bg-center" style={image} />
          <div className="absolute inset-x-1.5 top-[24%] h-1 rounded-sm bg-white/90" />
        </>
      ) : id === "cinematic" ? (
        <>
          <div className="absolute inset-x-0 bottom-[15%] top-[15%] bg-cover bg-center" style={image} />
          <div className="absolute inset-x-2 top-[6%] h-1 rounded-sm bg-white/90" />
          <div className="absolute inset-x-4 bottom-[6%] h-0.5 rounded-sm bg-gray-400" />
        </>
      ) : (
        <div className="absolute inset-0 bg-cover bg-center" style={image} />
      )}
      <div className={`absolute inset-x-0 bottom-0 ${LOWER_THIRDS[id].shade}`} />
      <div className={`absolute inset-x-2.5 h-1 rounded-sm bg-[#FFD400] ${LOWER_THIRDS[id].caption}`} />
      {id === "headline" && <div className="absolute inset-x-1.5 top-2 h-2.5 rounded-sm bg-white" />}
      {id === "progress" && (
        <>
          <div className="absolute left-1 top-1.5 h-1.5 w-5 rounded-sm bg-black/70" />
          <div className="absolute bottom-0 left-0 h-[3px] w-2/3 bg-[#d63736]" />
        </>
      )}
    </div>
  )
}

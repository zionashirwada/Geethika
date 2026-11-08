import { NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { createReadStream, existsSync } from 'fs'
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { Readable } from 'stream'
import { promisify } from 'util'
import {
  OVERLAY_STYLES,
  OverlayStyle,
  SUBTITLE_STYLES,
  Word,
  buildAss,
  clipWords,
  json3ToCues,
  videoId,
} from '@/lib/shorts'

export const dynamic = 'force-dynamic'

type Plan = { width: number; height: number; x: number; commands: string }

const MAX_CLIP_SECONDS = 300
const ENCODE = '-c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart'
const INTERMEDIATE = '-c:v libx264 -crf 14 -preset ultrafast -pix_fmt yuv420p -c:a aac -b:a 192k'
const PREVIEW_FORMAT = 'bv*[height<=720][vcodec^=avc1]/bv*[height<=720]/bv*'
const REFRAME = join(process.cwd(), 'scripts', 'reframe.py')
const FFMPEG_FULL = '/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg'
const FRAMES = join(tmpdir(), 'geethika-frames')
const BLUR_FILL =
  '[0:v]scale=1080:-2:flags=lanczos,split[fg][bg];' +
  '[bg]scale=-2:480,crop=270:480,gblur=sigma=12,eq=brightness=-0.12,scale=1080:1920[back];' +
  '[back][fg]overlay=0:(H-h)/2'

const streams = new Map<string, string>()
const frames = new Map<string, Promise<string>>()
const plans = new Map<string, Promise<Plan>>()

const run = (cmd: string, args: string[], cwd?: string) =>
  promisify(execFile)(cmd, args, { maxBuffer: 1 << 26, cwd })

const ytdlp = (args: string[]) => run('yt-dlp', ['-4', '--no-playlist', '--no-warnings', ...args])

const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

const fail = (e: any) =>
  NextResponse.json(
    {
      message:
        e.code === 'ENOENT'
          ? `${e.path} is not installed on the server. Install it with: brew install ${e.path}`
          : e.stderr?.trim().split('\n').pop() || e.message,
    },
    { status: 500 },
  )

function cached<T>(map: Map<string, Promise<T>>, key: string, make: () => Promise<T>) {
  if (!map.has(key)) {
    map.set(
      key,
      make().catch((e) => {
        map.delete(key)
        throw e
      }),
    )
  }
  return map.get(key)!
}

const ratioFor = (overlay: OverlayStyle) => (overlay === 'cinematic' ? 4 / 5 : 9 / 16)

async function cropPlan(input: string, ratio: number): Promise<Plan> {
  const args = ['run', '--quiet', '--no-project', '--with', 'opencv-python-headless<6', 'python', REFRAME, input, String(ratio)]
  return JSON.parse((await run('uv', args)).stdout)
}

function layout(overlay: OverlayStyle, plan?: Plan, track = false) {
  if (!plan) return BLUR_FILL
  const [w, h] = overlay === 'cinematic' ? [1080, 1350] : [1080, 1920]
  return (
    `[0:v]${track ? 'sendcmd=f=crop.txt,' : ''}crop=${plan.width}:${plan.height}:${plan.x}:0,` +
    `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}` +
    (overlay === 'cinematic' ? ',pad=1080:1920:0:285' : '')
  )
}

async function render(input: string, dir: string, overlay: OverlayStyle, ass: string) {
  const plan = overlay === 'blur' ? undefined : await cropPlan(input, ratioFor(overlay))
  if (plan) await writeFile(join(dir, 'crop.txt'), plan.commands)
  await writeFile(join(dir, 'captions.ass'), ass)
  await run(
    FFMPEG_FULL,
    [
      '-v', 'error',
      '-i', input,
      '-filter_complex', `${layout(overlay, plan, true)},setsar=1,ass=captions.ass[v]`,
      '-map', '[v]',
      '-map', '0:a?',
      ...ENCODE.split(' '),
      '-c:a', 'copy',
      'short.mp4',
    ],
    dir,
  )
  return join(dir, 'short.mp4')
}

const frameAt = (id: string, at: number) =>
  cached(frames, `${id}-${at.toFixed(1)}`, async () => {
    const base = join(FRAMES, `${id}-${at.toFixed(1)}`)
    if (existsSync(`${base}.jpg`)) return base
    const url = streams.get(id) ?? (await ytdlp(['-f', PREVIEW_FORMAT, '-g', watchUrl(id)])).stdout.trim().split('\n')[0]
    streams.set(id, url)
    await mkdir(FRAMES, { recursive: true })
    try {
      await run('ffmpeg', [
        '-v', 'error', '-y',
        '-ss', at.toFixed(1),
        '-i', url,
        '-frames:v', '1',
        '-vf', "scale=-2:'min(ih,1080)'",
        '-c:v', 'libx264', '-preset', 'ultrafast', '-qp', '0', '-pix_fmt', 'yuv420p',
        `${base}.mp4`,
      ])
    } catch (e) {
      streams.delete(id)
      throw e
    }
    await run('ffmpeg', ['-v', 'error', '-y', '-i', `${base}.mp4`, '-frames:v', '1', '-q:v', '2', `${base}.jpg`])
    return base
  })

async function preview(id: string, at: number, offset: number, overlay: OverlayStyle, ass: string) {
  const frame = `${await frameAt(id, at)}.mp4`
  const ratio = ratioFor(overlay)
  const plan = overlay === 'blur' ? undefined : await cached(plans, `${frame}:${ratio}`, () => cropPlan(frame, ratio))
  const dir = await mkdtemp(join(tmpdir(), 'preview-'))
  try {
    await writeFile(join(dir, 'captions.ass'), ass)
    await run(
      FFMPEG_FULL,
      [
        '-v', 'error',
        '-i', frame,
        '-filter_complex', `${layout(overlay, plan)},setsar=1,setpts=PTS+${offset.toFixed(3)}/TB,ass=captions.ass,scale=540:960[v]`,
        '-map', '[v]',
        '-frames:v', '1',
        '-q:v', '3',
        'preview.jpg',
      ],
      dir,
    )
    return await readFile(join(dir, 'preview.jpg'))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

const isWord = (w: any): w is Word => Number.isFinite(w?.start) && Number.isFinite(w?.end) && typeof w?.text === 'string'

const jpeg = (data: Buffer) => new Response(data, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, max-age=3600' } })

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const id = videoId(params.get('url') ?? '')
  if (!id) return NextResponse.json({ message: 'That does not look like a YouTube link' }, { status: 400 })

  if (params.has('frame')) {
    const at = Number(params.get('frame'))
    if (!(at >= 0)) return NextResponse.json({ message: 'Invalid frame time' }, { status: 400 })
    try {
      return jpeg(await readFile(`${await frameAt(id, at)}.jpg`))
    } catch (e) {
      return fail(e)
    }
  }

  try {
    const info = JSON.parse((await ytdlp(['-J', watchUrl(id)])).stdout)
    const manual = Object.keys(info.subtitles ?? {}).filter((k) => k !== 'live_chat')
    const auto = Object.keys(info.automatic_captions ?? {})
    const manualLang = manual.find((k) => k === info.language) ?? manual.find((k) => k.startsWith('en')) ?? manual[0]
    const autoLang = auto.find((k) => k.endsWith('-orig')) ?? auto.find((k) => k === 'en')
    const lang = manualLang ?? autoLang
    const tracks = manualLang ? info.subtitles[manualLang] : autoLang ? info.automatic_captions[autoLang] : []
    const trackUrl = tracks.find((t: any) => t.ext === 'json3')?.url
    const transcript = trackUrl
      ? await fetch(trackUrl)
          .then((r) => r.json())
          .then(json3ToCues)
          .catch(() => [])
      : []
    const stream = (info.formats ?? [])
      .filter((f: any) => f.protocol === 'https' && f.acodec === 'none' && f.vcodec?.startsWith('avc1') && f.height <= 720)
      .sort((a: any, b: any) => b.height - a.height)[0]
    if (stream?.url) streams.set(id, stream.url)

    return NextResponse.json({
      id,
      title: info.title,
      channel: info.channel ?? info.uploader,
      duration: info.duration,
      transcriptLang: lang ? `${lang}${manualLang ? '' : ' (auto)'}` : null,
      transcript,
    })
  } catch (e) {
    return fail(e)
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { url, start, end } = body
  const id = videoId(String(url ?? ''))
  if (!id || ![start, end].every(Number.isFinite) || start < 0 || end <= start || end - start > MAX_CLIP_SECONDS) {
    return NextResponse.json(
      { message: `Pick a start before the end, up to ${MAX_CLIP_SECONDS / 60} minutes long` },
      { status: 400 },
    )
  }
  if (!existsSync(FFMPEG_FULL)) {
    return NextResponse.json(
      { message: 'Styled captions need ffmpeg-full. Install it with: brew install ffmpeg-full' },
      { status: 500 },
    )
  }
  const overlay = OVERLAY_STYLES.find((o) => o.id === body.overlay)?.id ?? 'clean'
  const ass = buildAss({
    words: clipWords((Array.isArray(body.words) ? body.words : []).filter(isWord).slice(0, 5000), start, end),
    duration: end - start,
    subtitle: SUBTITLE_STYLES.find((s) => s.id === body.subtitle)?.id ?? 'bold',
    overlay,
    headline: String(body.headline ?? '').slice(0, 150),
    channel: String(body.channel ?? '').slice(0, 80),
  })

  if (body.preview) {
    const at = Number.isFinite(body.at) && body.at >= start && body.at <= end ? Math.round(body.at * 10) / 10 : Math.round((start + end) * 5) / 10
    try {
      return jpeg(await preview(id, at, at - start, overlay, ass))
    } catch (e) {
      return fail(e)
    }
  }

  const dir = await mkdtemp(join(tmpdir(), 'short-'))
  try {
    await ytdlp([
      '-f', 'bv*[dynamic_range=SDR]+ba/bv*+ba/b',
      '--download-sections', `*${start.toFixed(3)}-${end.toFixed(3)}`,
      '--force-keyframes-at-cuts',
      '--merge-output-format', 'mp4',
      '--downloader-args', `ffmpeg_o:${INTERMEDIATE}`,
      '-o', join(dir, 'source.%(ext)s'),
      watchUrl(id),
    ])
    const file = await render(join(dir, (await readdir(dir))[0]), dir, overlay, ass)
    const { size } = await stat(file)
    const stream = createReadStream(file).on('close', () => rm(dir, { recursive: true, force: true }))
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(size) },
    })
  } catch (e) {
    await rm(dir, { recursive: true, force: true })
    return fail(e)
  }
}

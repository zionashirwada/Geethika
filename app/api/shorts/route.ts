import { NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { createReadStream, existsSync } from 'fs'
import { mkdtemp, readdir, rm, stat, writeFile } from 'fs/promises'
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

const MAX_CLIP_SECONDS = 300
const ENCODE = '-c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart'
const INTERMEDIATE = '-c:v libx264 -crf 14 -preset ultrafast -pix_fmt yuv420p -c:a aac -b:a 192k'
const REFRAME = join(process.cwd(), 'scripts', 'reframe.py')
const FFMPEG_FULL = '/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg'
const BLUR_FILL =
  '[0:v]scale=1080:-2:flags=lanczos,split[fg][bg];' +
  '[bg]scale=-2:480,crop=270:480,gblur=sigma=12,eq=brightness=-0.12,scale=1080:1920[back];' +
  '[back][fg]overlay=0:(H-h)/2'

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

async function reframe(input: string, dir: string, width: number, height: number) {
  const plan = JSON.parse(
    (await run('uv', ['run', '--quiet', '--no-project', '--with', 'opencv-python-headless<6', 'python', REFRAME, input, String(width / height)]))
      .stdout,
  )
  await writeFile(join(dir, 'crop.txt'), plan.commands)
  return (
    `[0:v]sendcmd=f=crop.txt,crop=${plan.width}:${plan.height}:${plan.x}:0,` +
    `scale=${width}:${height}:force_original_aspect_ratio=increase:flags=lanczos,crop=${width}:${height}`
  )
}

async function render(input: string, dir: string, overlay: OverlayStyle, ass: string) {
  const video =
    overlay === 'blur'
      ? BLUR_FILL
      : overlay === 'cinematic'
        ? `${await reframe(input, dir, 1080, 1350)},pad=1080:1920:0:285`
        : await reframe(input, dir, 1080, 1920)
  await writeFile(join(dir, 'captions.ass'), ass)
  await run(
    FFMPEG_FULL,
    [
      '-v', 'error',
      '-i', input,
      '-filter_complex', `${video},setsar=1,ass=captions.ass[v]`,
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

const isWord = (w: any): w is Word => Number.isFinite(w?.start) && Number.isFinite(w?.end) && typeof w?.text === 'string'

export async function GET(request: Request) {
  const id = videoId(new URL(request.url).searchParams.get('url') ?? '')
  if (!id) return NextResponse.json({ message: 'That does not look like a YouTube link' }, { status: 400 })

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

export type Word = { start: number; end: number; text: string }
export type Cue = { start: number; end: number; text: string; words: Word[] }

type Json3 = { events?: { tStartMs: number; dDurationMs?: number; segs?: { utf8: string; tOffsetMs?: number }[] }[] }

export const SUBTITLE_STYLES = [
  { id: 'bold', label: 'Bold highlight' },
  { id: 'pop', label: 'Word pop' },
  { id: 'karaoke', label: 'Karaoke' },
  { id: 'boxed', label: 'Boxed' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'none', label: 'No captions' },
] as const

export const OVERLAY_STYLES = [
  { id: 'clean', label: 'Clean' },
  { id: 'headline', label: 'Headline' },
  { id: 'progress', label: 'Progress bar' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'blur', label: 'Blur fill' },
] as const

export type SubtitleStyle = (typeof SUBTITLE_STYLES)[number]['id']
export type OverlayStyle = (typeof OVERLAY_STYLES)[number]['id']

export const HEADLINE_OVERLAYS: OverlayStyle[] = ['headline', 'cinematic', 'blur']

export function videoId(input: string): string | null {
  const m = input
    .trim()
    .match(/^([\w-]{11})$|(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/))([\w-]{11})(?![\w-])/)
  return m ? m[1] ?? m[2] : null
}

const round = (n: number) => Math.round(n * 1000) / 1000

function spread(tokens: string[], start: number, end: number): Word[] {
  const total = tokens.reduce((n, t) => n + t.length + 1, 0)
  let t = start
  return tokens.map((text) => {
    const from = t
    t += ((end - start) * (text.length + 1)) / total
    return { start: round(from), end: round(t), text }
  })
}

const tokens = (text: string) => text.split(/\s+/).filter(Boolean)

export function json3ToCues(json: Json3): Cue[] {
  const events = (json.events ?? []).filter((e) => e.segs?.some((s) => s.utf8.trim()))
  return events.map((e, i) => {
    const segs = e.segs!
    const start = e.tStartMs / 1000
    const next = events[i + 1]
    const end = Math.min((e.tStartMs + (e.dDurationMs ?? 0)) / 1000, next ? next.tStartMs / 1000 : Infinity)
    const timed = segs.length > 1 && segs.slice(1).every((s) => s.tOffsetMs !== undefined)
    const at = (j: number) => Math.min(end, start + (segs[j]?.tOffsetMs ?? 0) / 1000)
    const words = timed
      ? segs.flatMap((s, j) => spread(tokens(s.utf8), at(j), j + 1 < segs.length ? Math.max(at(j), at(j + 1)) : end))
      : spread(tokens(segs.map((s) => s.utf8).join('')), start, end)
    return { start, end, text: words.map((w) => w.text).join(' '), words }
  })
}

export function clipWords(words: Word[], from: number, to: number): Word[] {
  return words
    .filter((w) => w.end > from && w.start < to)
    .map((w) => ({ start: round(Math.max(0, w.start - from)), end: round(Math.min(to, w.end) - from), text: w.text }))
}

export function previewMoment(words: Word[], start: number, end: number): number {
  const mid = (start + end) / 2
  const near = words
    .filter((w) => w.start >= start && w.start < end)
    .sort((a, b) => Math.abs(a.start - mid) - Math.abs(b.start - mid))[0]
  const t = near ? near.start + Math.min(0.2, (near.end - near.start) / 2) : mid
  return Math.min(end, Math.max(start, Math.round(t * 10) / 10))
}

export function fmt(seconds: number): string {
  const t = Math.round(seconds * 10) / 10
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = (t % 60).toFixed(1).padStart(4, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

export function parseTime(text: string): number {
  const t = text.trim()
  if (!/^\d+(?::\d+)*(?:\.\d+)?$/.test(t)) return NaN
  return t.split(':').reduce((acc, part) => acc * 60 + Number(part), 0)
}

const BRAND = '#D63736'

const CAPTIONS = {
  bold: { font: 'Avenir Next Heavy', weight: 0, size: 84, color: '#FFFFFF', accent: '#FFD400', outline: 7, shadow: 3, box: '', words: 3, upper: true },
  pop: { font: 'Impact', weight: 0, size: 132, color: '#FFFFFF', accent: '#FFD400', outline: 9, shadow: 4, box: '', words: 1, upper: true },
  karaoke: { font: 'Avenir Next Bold', weight: 0, size: 72, color: '#FFFFFF', accent: '#FF4B3E', outline: 5, shadow: 2, box: '', words: 5, upper: false },
  boxed: { font: 'Helvetica Neue', weight: 700, size: 62, color: '#FFFFFF', accent: '#FFFFFF', outline: 16, shadow: 0, box: '#000000', words: 6, upper: false },
  minimal: { font: 'Avenir Next Medium', weight: 0, size: 62, color: '#FFFFFF', accent: '#FFFFFF', outline: 0, shadow: 3, box: '', words: 7, upper: false },
}

const CAPTION_Y: Record<OverlayStyle, number> = { clean: 1640, headline: 1640, progress: 1620, cinematic: 1590, blur: 1460 }

const SHADE_BAND = 8

const SHADES: Record<OverlayStyle, { fade: number; solid: number }> = {
  clean: { fade: 960, solid: 1400 },
  headline: { fade: 960, solid: 1400 },
  progress: { fade: 960, solid: 1400 },
  cinematic: { fade: 1020, solid: 1290 },
  blur: { fade: 900, solid: 1090 },
}

const HEADS: Partial<Record<OverlayStyle, { an: number; y: number; size: number; color: string; box: string; shadow: number }>> = {
  headline: { an: 8, y: 190, size: 60, color: '#000000', box: '#FFFFFF', shadow: 0 },
  cinematic: { an: 5, y: 142, size: 54, color: '#FFFFFF', box: '', shadow: 0 },
  blur: { an: 2, y: 610, size: 64, color: '#FFFFFF', box: '', shadow: 4 },
}

const TAGS: Partial<Record<OverlayStyle, { an: number; x: number; y: number; color: string; box: string }>> = {
  progress: { an: 7, x: 56, y: 96, color: '#FFFFFF', box: '#000000' },
  cinematic: { an: 5, x: 540, y: 1778, color: '#B3B3B3', box: '' },
}

const assColor = (hex: string, alpha = 0) =>
  `&H${alpha.toString(16).padStart(2, '0')}${hex.slice(5, 7)}${hex.slice(3, 5)}${hex.slice(1, 3)}`.toUpperCase()

const tagColor = (hex: string) => `&H${hex.slice(5, 7)}${hex.slice(3, 5)}${hex.slice(1, 3)}&`.toUpperCase()

const assTime = (s: number) => {
  const cs = Math.max(0, Math.round(s * 100))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${Math.floor(cs / 360000)}:${pad(Math.floor(cs / 6000) % 60)}:${pad(Math.floor(cs / 100) % 60)}.${pad(cs % 100)}`
}

const plain = (text: string) =>
  text.replace(/\{[^}]*\}/g, '').replace(/[{}\\]/g, '').replace(/\s+/g, ' ').trim()

function style(name: string, font: string, size: number, weight: number, primary: string, secondary: string, outlineColor: string, back: string, boxed: boolean, outline: number, shadow: number) {
  return `Style: ${name},${font},${size},${primary},${secondary},${outlineColor},${back},${weight},0,0,0,100,100,0,0,${boxed ? 3 : 1},${outline},${shadow},2,80,80,0,1`
}

function chunks(words: Word[], max: number): Word[][] {
  const out: Word[][] = []
  for (const w of words) {
    const cur = out[out.length - 1]
    const last = cur?.[cur.length - 1]
    if (cur && cur.length < max && w.start - last.end < 0.6 && !/[.?!]$/.test(last.text)) cur.push(w)
    else out.push([w])
  }
  return out
}

export function buildAss(o: {
  words: Word[]
  duration: number
  subtitle: SubtitleStyle
  overlay: OverlayStyle
  headline: string
  channel: string
}): string {
  const cap = CAPTIONS[o.subtitle === 'none' ? 'bold' : o.subtitle]
  const head = HEADS[o.overlay]
  const tag = TAGS[o.overlay]
  const events: string[] = []
  const add = (layer: number, a: number, b: number, name: string, text: string) =>
    b > a && events.push(`Dialogue: ${layer},${assTime(a)},${assTime(b)},${name},,0,0,0,,${text}`)

  if (o.subtitle !== 'none') {
    const pos = `\\an2\\pos(540,${CAPTION_Y[o.overlay]})\\b${cap.weight}`
    const say = (w: Word) => plain(cap.upper ? w.text.toUpperCase() : w.text)
    for (const chunk of chunks(o.words.filter((w) => plain(w.text)), cap.words)) {
      const a = chunk[0].start
      const b = chunk[chunk.length - 1].end
      const nextStart = (i: number) => (i + 1 < chunk.length ? chunk[i + 1].start : b)
      if (o.subtitle === 'karaoke') {
        add(4, a, b, 'Cap', `{${pos}}` + chunk.map((w, i) => `{\\kf${Math.round((nextStart(i) - w.start) * 100)}}${say(w)}`).join(' '))
      } else if (o.subtitle === 'bold') {
        chunk.forEach((w, i) =>
          add(4, w.start, nextStart(i), 'Cap', `{${pos}}` + chunk
            .map((x, j) =>
              j === i
                ? `{\\c${tagColor(cap.accent)}\\fscx112\\fscy112}${say(x)}{\\c${tagColor(cap.color)}\\fscx100\\fscy100}`
                : say(x),
            )
            .join(' ')),
        )
      } else if (o.subtitle === 'pop') {
        const accent = say(chunk[0]).length >= 6 ? `\\c${tagColor(cap.accent)}` : ''
        add(4, a, b, 'Cap', `{${pos}${accent}\\fscx60\\fscy60\\t(0,80,\\fscx112\\fscy112)\\t(80,160,\\fscx100\\fscy100)}${chunk.map(say).join(' ')}`)
      } else {
        add(4, a, b, 'Cap', `{${pos}\\fad(60,60)}${chunk.map(say).join(' ')}`)
      }
    }
  }

  const shade = SHADES[o.overlay]
  const rect = (h: number) => `m 0 0 l 1080 0 l 1080 ${h} l 0 ${h}`
  for (let y = shade.fade; y < shade.solid; y += SHADE_BAND) {
    const p = (y + SHADE_BAND / 2 - shade.fade) / (shade.solid - shade.fade)
    const alpha = Math.round(255 * (1 - p * p * (3 - 2 * p)))
    add(0, 0, o.duration, 'Bar', `{\\an7\\pos(0,${y})\\p1\\1c&H000000&\\1a&H${alpha.toString(16).padStart(2, '0').toUpperCase()}&}${rect(SHADE_BAND)}{\\p0}`)
  }
  add(0, 0, o.duration, 'Bar', `{\\an7\\pos(0,${shade.solid})\\p1\\1c&H000000&}${rect(1920 - shade.solid)}{\\p0}`)

  if (head && plain(o.headline)) add(3, 0, o.duration, 'Head', `{\\an${head.an}\\pos(540,${head.y})}${plain(o.headline)}`)
  if (tag && plain(o.channel)) add(3, 0, o.duration, 'Tag', `{\\an${tag.an}\\pos(${tag.x},${tag.y})}${plain(o.channel)}`)
  if (o.overlay === 'progress') {
    add(1, 0, o.duration, 'Bar', `{\\an7\\pos(0,1904)\\p1\\1c&HFFFFFF&\\1a&HA0&}${rect(16)}{\\p0}`)
    add(2, 0, o.duration, 'Bar', `{\\an7\\pos(0,1904)\\p1\\1c${tagColor(BRAND)}\\clip(0,1900,0,1920)\\t(0,${Math.round(o.duration * 1000)},\\clip(0,1900,1080,1920))}${rect(16)}{\\p0}`)
  }

  const black = assColor('#000000')
  return [
    '[Script Info]',
    'ScriptType: v4.00+',
    'PlayResX: 1080',
    'PlayResY: 1920',
    'WrapStyle: 0',
    'ScaledBorderAndShadow: yes',
    '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    o.subtitle === 'karaoke'
      ? style('Cap', cap.font, cap.size, cap.weight, assColor(cap.accent), assColor(cap.color), black, assColor('#000000', 0x80), false, cap.outline, cap.shadow)
      : style('Cap', cap.font, cap.size, cap.weight, assColor(cap.color), assColor(cap.color), cap.box ? assColor(cap.box, 0x50) : black, assColor('#000000', 0x80), !!cap.box, cap.outline, cap.shadow),
    style('Head', 'Avenir Next Heavy', head?.size ?? 60, 0, assColor(head?.color ?? '#FFFFFF'), black, head?.box ? assColor(head.box) : black, assColor('#000000', 0x60), !!head?.box, head?.box ? 18 : 0, head?.shadow ?? 0),
    style('Tag', 'Avenir Next Demi Bold', 40, 0, assColor(tag?.color ?? '#FFFFFF'), black, tag?.box ? assColor(tag.box, 0x60) : black, black, !!tag?.box, tag?.box ? 12 : 0, 0),
    style('Bar', 'Avenir Next', 20, 400, assColor('#FFFFFF'), black, black, black, false, 0, 0),
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    ...events,
    '',
  ].join('\n')
}

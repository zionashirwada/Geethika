import assert from 'node:assert/strict'
import { buildAss, clipWords, fmt, json3ToCues, parseTime, previewMoment, videoId } from './shorts.ts'

for (const url of [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://m.youtube.com/watch?feature=share&v=dQw4w9WgXcQ&t=42',
  'https://youtu.be/dQw4w9WgXcQ?si=abc',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'https://www.youtube.com/live/dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
]) assert.equal(videoId(url), 'dQw4w9WgXcQ', url)
assert.equal(videoId('https://example.com/watch?v=dQw4w9WgXcQ'), null)
assert.equal(videoId('https://www.youtube.com/watch?v=dQw4w9WgXcQX'), null)
assert.equal(videoId('--exec rm'), null)

assert.deepEqual(
  json3ToCues({
    events: [
      { tStartMs: 0, dDurationMs: 211879 },
      { tStartMs: 1000, dDurationMs: 5000, segs: [{ utf8: 'Hello' }, { utf8: ' world' }] },
      { tStartMs: 3000, dDurationMs: 100, segs: [{ utf8: '\n' }] },
      { tStartMs: 4000, dDurationMs: 2000, segs: [{ utf8: 'line\ntwo' }] },
    ],
  }),
  [
    {
      start: 1,
      end: 4,
      text: 'Hello world',
      words: [
        { start: 1, end: 2.5, text: 'Hello' },
        { start: 2.5, end: 4, text: 'world' },
      ],
    },
    {
      start: 4,
      end: 6,
      text: 'line two',
      words: [
        { start: 4, end: 5.111, text: 'line' },
        { start: 5.111, end: 6, text: 'two' },
      ],
    },
  ],
)

assert.deepEqual(
  json3ToCues({
    events: [
      { tStartMs: 10000, dDurationMs: 3000, segs: [{ utf8: 'We' }, { utf8: ' are', tOffsetMs: 400 }, { utf8: ' here', tOffsetMs: 1000 }] },
    ],
  })[0].words,
  [
    { start: 10, end: 10.4, text: 'We' },
    { start: 10.4, end: 11, text: 'are' },
    { start: 11, end: 13, text: 'here' },
  ],
)

assert.deepEqual(
  clipWords(
    [
      { start: 9, end: 10.5, text: 'a' },
      { start: 10.5, end: 12, text: 'b' },
      { start: 14, end: 15, text: 'c' },
    ],
    10,
    11,
  ),
  [
    { start: 0, end: 0.5, text: 'a' },
    { start: 0.5, end: 1, text: 'b' },
  ],
)

const words = [
  { start: 0, end: 0.5, text: 'grace' },
  { start: 0.5, end: 1, text: '{\\b1}changes' },
  { start: 1, end: 1.6, text: 'everything.' },
  { start: 1.6, end: 2, text: 'amen' },
]
const ass = (subtitle, overlay = 'clean') =>
  buildAss({ words, duration: 2, subtitle, overlay, headline: 'Sunday {\\i1}word', channel: 'Church' })
const dialogue = (text, style = 'Cap') =>
  text.split('\n').filter((l) => l.startsWith('Dialogue:') && l.split(',')[3] === style)
assert.ok(!/\\b1|\\i1/.test(ass('bold', 'headline')))
assert.equal(dialogue(ass('bold')).length, 4)
assert.match(dialogue(ass('bold'))[1], /^Dialogue: 4,0:00:00\.50,0:00:01\.00,Cap,.*GRACE \{\\c&H00D4FF&\\fscx112\\fscy112\}CHANGES\{\\c&HFFFFFF&\\fscx100\\fscy100\} EVERYTHING\.$/)
assert.match(dialogue(ass('bold'))[1], /\{\\an2\\pos\(540,1640\)\\b0\}/)
assert.equal(dialogue(ass('pop')).length, 4)
assert.match(dialogue(ass('karaoke'))[0], /\{\\kf50\}grace \{\\kf50\}changes \{\\kf60\}everything\.$/)
assert.equal(dialogue(ass('minimal')).length, 2)
assert.equal(dialogue(ass('none')).length, 0)
assert.match(ass('none', 'headline'), /Dialogue: 3,0:00:00\.00,0:00:02\.00,Head,.*\}Sunday word$/m)
assert.equal(dialogue(ass('none', 'progress'), 'Tag').length, 1)
assert.match(ass('none', 'progress'), /\\t\(0,2000,\\clip\(0,1900,1080,1920\)\)/)

const shade = dialogue(ass('none'), 'Bar')
assert.equal(shade.length, 56)
assert.match(shade[0], /^Dialogue: 0,.*\\pos\(0,960\).*\\1a&HFF&/)
assert.match(shade[54], /\\pos\(0,1392\).*\\1a&H0[0-9A-F]&/)
assert.match(shade[55], /\\pos\(0,1400\)\\p1\\1c&H000000&\}m 0 0 l 1080 0 l 1080 520 l 0 520/)

assert.equal(fmt(0), '0:00.0')
assert.equal(fmt(65.34), '1:05.3')
assert.equal(fmt(59.96), '1:00.0')
assert.equal(fmt(3723.5), '1:02:03.5')
assert.equal(parseTime('83.5'), 83.5)
assert.equal(parseTime('1:23.5'), 83.5)
assert.equal(parseTime(' 1:02:03 '), 3723)
assert.ok(Number.isNaN(parseTime('')))
assert.ok(Number.isNaN(parseTime('1.5:30')))
for (const s of [0, 12.3, 65.3, 3723.5]) assert.equal(parseTime(fmt(s)), s)

const spoken = [
  { start: 10, end: 11, text: 'a' },
  { start: 14.2, end: 14.5, text: 'b' },
  { start: 19, end: 20, text: 'c' },
]
assert.equal(previewMoment(spoken, 10, 20), 14.4)
assert.equal(previewMoment([], 10, 20), 15)
assert.equal(previewMoment(spoken, 30, 40), 35)
console.log('shorts helpers ok')

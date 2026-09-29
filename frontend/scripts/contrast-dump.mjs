/**
 * WCAG AA contrast audit across every route.
 *
 * - Resolves the effective backdrop by walking ancestors, and understands
 *   `background-image` gradients (so text on a green gradient button is not
 *   misreported as white-on-white).
 * - Reports failures grouped by class name so they can be traced back to source.
 *
 * Usage: node scripts/contrast-dump.mjs [baseUrl]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.argv[2] || 'http://localhost:4174'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9334
const ROUTES = ['/', '/models', '/disease-detection', '/healthy-plants', '/disease-library', '/about']

const profile = mkdtempSync(join(tmpdir(), 'contrast-'))
const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' })
const cleanup = () => { try { edge.kill() } catch {} ; try { rmSync(profile, { recursive: true, force: true }) } catch {} }
process.on('exit', cleanup)

for (let i = 0; i < 60; i++) {
  try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) break } catch {}
  await new Promise(r => setTimeout(r, 250))
}
const targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then(r => r.json())
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(res => ws.addEventListener('open', res, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result) }
})
const send = (method, params = {}) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((res, rej) => pending.set(i, { res, rej })) }
const ev = async expr => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description)
  return r.result.value
}
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false })

const AUDIT = `(() => {
  const lin = c => { c /= 255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4) }
  const L = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)

  // Resolve ANY css colour (rgb, oklch, color-mix, named) to sRGB via canvas.
  const cv = document.createElement('canvas'); cv.width = cv.height = 1
  const cx = cv.getContext('2d', { willReadFrequently: true })
  const cache = new Map()
  const toRGBA = css => {
    if (cache.has(css)) return cache.get(css)
    cx.clearRect(0, 0, 1, 1)
    cx.fillStyle = '#000'
    cx.fillStyle = css
    cx.globalCompositeOperation = 'copy'
    cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data
    const out = [d[0], d[1], d[2], d[3] / 255]
    cache.set(css, out)
    return out
  }
  const alphaOf = css => {
    // Resolve alpha through the canvas too: Tailwind v4 emits oklab()/oklch()
    // for many colours, where a regex would wrongly assume alpha = 1.
    if (!css || css === 'transparent') return 0
    return toRGBA(css)[3]
  }
  const allStops = img => {
    const m = String(img).match(/(?:rgba?|oklch|oklab|hsla?|color)\([^)]*\)/g)
    return m ? m : []
  }

  // Effective backdrop candidates. A solid ancestor background wins; otherwise
  // every stop of the first gradient met is a candidate (text over a gradient
  // only has to contrast with the worst stop, not all of them).
  const backdrop = el => {
    let n = el
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n)
      const bc = cs.backgroundColor
      if (bc && bc !== 'transparent' && alphaOf(bc) > 0.85) {
        return { list: [toRGBA(bc).slice(0, 3)], from: n.tagName + '.' + String(n.className).slice(0, 44) }
      }
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        const stops = allStops(cs.backgroundImage)
          .filter(s => alphaOf(s) > 0.85)
          .map(s => toRGBA(s).slice(0, 3))
        if (stops.length) {
          return { list: stops, from: n.tagName + '.' + String(n.className).slice(0, 44) + ' [gradient]' }
        }
      }
      n = n.parentElement
    }
    const bgc = getComputedStyle(document.body).backgroundColor
    if (bgc && bgc !== 'transparent' && alphaOf(bgc) > 0.85) return { list: [toRGBA(bgc).slice(0, 3)], from: 'body' }
    return { list: [[255, 255, 255]], from: 'page (assumed white)' }
  }

  const res = []
  for (const el of document.querySelectorAll('p,span,h1,h2,h3,h4,h5,td,th,li,button,a,code,label,strong,em,small,dt,dd,figcaption')) {
    if (!el.textContent.trim()) continue
    if (el.children.length && !Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue
    if (parseFloat(cs.opacity) < 0.9) continue
    const rect = el.getBoundingClientRect()
    if (rect.width < 2 || rect.height < 2) continue
    const fa = alphaOf(cs.color)
    if (fa < 0.9) continue
    const fg = toRGBA(cs.color).slice(0, 3)
    const bd = backdrop(el)
    // Best (most favourable) ratio across all candidate backdrops.
    const ratios = bd.list.map(bg => (Math.max(L(fg), L(bg)) + 0.05) / (Math.min(L(fg), L(bg)) + 0.05))
    const ratio = Math.max(...ratios)
    const size = parseFloat(cs.fontSize)
    const bold = parseInt(cs.fontWeight, 10) >= 700
    const need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5
    if (ratio < need) res.push({
      text: el.textContent.trim().slice(0, 22), ratio: +ratio.toFixed(2), need, size: Math.round(size),
      color: cs.color, bg: 'rgb(' + bd.list.map(c => c.join(',')).join(') | rgb(') + ')', bgFrom: bd.from,
      cls: String(el.className).slice(0, 70),
    })
  }
  return res
})()`

const byClass = new Map()
for (const route of ROUTES) {
  await send('Page.navigate', { url: BASE + route })
  await new Promise(r => setTimeout(r, 1600))
  const out = await ev(AUDIT)
  console.log(`\n${route}  ->  ${out.length} failing`)
  for (const f of out) {
    const key = f.cls
    if (!byClass.has(key)) byClass.set(key, { count: 0, sample: f })
    const e = byClass.get(key)
    e.count++
    if (f.ratio < e.sample.ratio) e.sample = f
  }
}

console.log(`\n${'='.repeat(72)}\nGROUPED BY CLASS\n${'='.repeat(72)}`)
for (const [cls, { count, sample }] of [...byClass].sort((a, b) => b[1].count - a[1].count)) {
  console.log(`\n[${count} occurrence(s)]  worst ${sample.ratio}:1 (need ${sample.need}, ${sample.size}px)`)
  console.log(`  class : ${cls}`)
  console.log(`  text  : "${sample.text}"`)
  console.log(`  color : ${sample.color}   bg: ${sample.bg}  (${sample.bgFrom})`)
}
console.log(`\nTOTAL failing elements: ${[...byClass.values()].reduce((s, e) => s + e.count, 0)} across ${byClass.size} distinct classes`)
cleanup()

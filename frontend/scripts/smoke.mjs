/**
 * Zero-dependency smoke test driven over the Chrome DevTools Protocol.
 *
 * Uses Node's built-in WebSocket (Node >= 22) so no test framework or headless
 * browser package has to be added to the project.
 *
 * Checks, on the production build served by `vite preview`:
 *   1. every public route mounts and renders real content
 *   2. no console errors / page exceptions on any route
 *   3. the models radiogroup is keyboard operable (arrows + Home/End)
 *   4. the model card grid has no horizontal overflow at 3 widths
 *   5. computed text colours meet WCAG AA contrast against their background
 *   6. clicking an image opens a centred lightbox, Escape closes it
 *
 * Usage:  node scripts/smoke.mjs [baseUrl]
 */

import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.argv[2] || 'http://localhost:4174'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9222

const ROUTES = [
  ['/', 'Plant'],
  ['/models', 'Model'],
  ['/disease-detection', 'Detect'],
  ['/healthy-plants', 'Healthy'],
  ['/disease-library', 'Disease'],
  ['/about', 'About'],
  ['/login', 'Welcome back'],
  ['/signup', 'Create an account'],
]

const WIDTHS = [360, 768, 1280]

let failures = 0
let checks = 0
const ok = (name, pass, detail = '') => {
  checks++
  if (!pass) failures++
  console.log(`${pass ? '  PASS' : '  FAIL'}  ${name}${detail ? `  ${detail}` : ''}`)
}
const section = (t) => console.log(`\n${t}`)

/* ── CDP plumbing ─────────────────────────────────────────────────────────── */

class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    this.events = []
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
      } else if (msg.method) {
        this.events.push(msg)
      }
    })
  }

  static async attach(port) {
    const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json())
    const page = targets.find((t) => t.type === 'page')
    if (!page) throw new Error('no page target found')
    const ws = new WebSocket(page.webSocketDebuggerUrl)
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true })
      ws.addEventListener('error', rej, { once: true })
    })
    return new CDP(ws)
  }

  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id)
          reject(new Error(`${method} timed out`))
        }
      }, 30000)
    })
  }

  async eval(expression) {
    const r = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (r.exceptionDetails) {
      throw new Error(r.exceptionDetails.exception?.description || 'eval threw')
    }
    return r.result.value
  }

  /** Console errors + uncaught exceptions recorded since the last drain. */
  drainProblems() {
    const problems = []
    for (const e of this.events) {
      if (e.method === 'Runtime.exceptionThrown') {
        const d = e.params.exceptionDetails
        problems.push(`uncaught: ${d.exception?.description || d.text}`)
      }
      if (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') {
        problems.push(`console.error: ${e.params.args.map((a) => a.value ?? a.description).join(' ')}`)
      }
      if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') {
        problems.push(`log: ${e.params.entry.text} ${e.params.entry.url || ''}`)
      }
    }
    this.events = this.events.filter(
      (e) =>
        e.method === 'Runtime.exceptionThrown' ||
        (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') ||
        (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'),
    )
    this.events = []
    return problems
  }

  async goto(path) {
    this.drainProblems()
    await this.send('Page.navigate', { url: BASE + path })
    await new Promise((r) => setTimeout(r, 1400))
  }
}

/* ── launch ───────────────────────────────────────────────────────────────── */

const profile = mkdtempSync(join(tmpdir(), 'smoke-'))
const edge = spawn(
  EDGE,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + profile,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const cleanup = () => {
  try { edge.kill() } catch {}
  try { rmSync(profile, { recursive: true, force: true }) } catch {}
}
process.on('exit', cleanup)

async function waitForEdge() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('Edge did not expose the debugging port')
}

/* ── test run ─────────────────────────────────────────────────────────────── */

try {
  await waitForEdge()
  const cdp = await CDP.attach(PORT)
  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Log.enable')

  section('1. Routes mount and render content')
  for (const [route, needle] of ROUTES) {
    await cdp.goto(route)
    const info = await cdp.eval(`(() => {
      const root = document.getElementById('root')
      const text = (document.body.innerText || '').replace(/\\s+/g, ' ')
      return { nodes: root ? root.childElementCount : 0, len: text.length, hasNeedle: text.includes(${JSON.stringify(needle)}) }
    })()`)
    ok(
      `${route.padEnd(20)} mounted`,
      info.nodes > 0 && info.len > 40,
      `nodes=${info.nodes} textLen=${info.len}`,
    )
    ok(`${route.padEnd(20)} contains "${needle}"`, info.hasNeedle)
  }

  section('2. Console errors / exceptions')
  for (const [route] of ROUTES) {
    await cdp.goto(route)
    const problems = cdp.drainProblems()
    ok(`${route.padEnd(20)} clean console`, problems.length === 0, problems.slice(0, 2).join(' | '))
  }

  section('3. Models radiogroup keyboard operation')
  await cdp.goto('/models')
  const radio = await cdp.eval(`(() => {
    const g = document.querySelector('[role="radiogroup"]')
    if (!g) return { found: false }
    const items = [...g.querySelectorAll('[role="radio"]')]
    return { found: true, count: items.length, labels: items.map(i => i.textContent.trim().slice(0, 18)) }
  })()`)
  ok('radiogroup exists', radio.found, `count=${radio.count}`)
  ok('all 5 models present', radio.count === 5, radio.labels?.join(' / '))

  const focusFirst = await cdp.eval(`(() => {
    const g = document.querySelector('[role="radiogroup"]')
    const items = [...g.querySelectorAll('[role="radio"]')]
    items[0].focus()
    return document.activeElement === items[0]
  })()`)
  ok('first radio is focusable', focusFirst)

  // React re-renders asynchronously, so give it a tick before reading the
  // resulting aria-checked state.
  const afterArrow = await cdp.eval(`(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    const items = [...document.querySelectorAll('[role="radio"]')]
    const before = items.findIndex(i => i === document.activeElement)
    items[before].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await sleep(200)
    const after = items.findIndex(i => i === document.activeElement)
    return { before, after, checked: items[after].getAttribute('aria-checked') }
  })()`)
  ok('ArrowRight moves focus', afterArrow.after === afterArrow.before + 1, `${afterArrow.before} -> ${afterArrow.after}`)
  ok('newly focused radio is selected', afterArrow.checked === 'true')

  const afterEnd = await cdp.eval(`(() => {
    const items = [...document.querySelectorAll('[role="radio"]')]
    const before = items.findIndex(i => i === document.activeElement)
    items[before].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    const after = items.findIndex(i => i === document.activeElement)
    return { before, after, last: items.length - 1 }
  })()`)
  ok('End jumps to last model', afterEnd.after === afterEnd.last, `${afterEnd.before} -> ${afterEnd.after}`)

  section('4. No horizontal overflow')
  for (const w of WIDTHS) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768,
    })
    for (const route of ['/', '/models', '/disease-detection']) {
      await cdp.goto(route)
      const o = await cdp.eval(`(() => {
        const vw = document.documentElement.clientWidth
        // An element only causes a scrollbar if nothing between it and the root
        // clips it, so walk ancestors looking for overflow clipping.
        const clipped = el => {
          let n = el.parentElement
          while (n && n !== document.documentElement) {
            const cs = getComputedStyle(n)
            if (/hidden|clip|auto|scroll/.test(cs.overflowX)) return true
            n = n.parentElement
          }
          return false
        }
        return {
          scrollW: document.documentElement.scrollWidth,
          clientW: vw,
          offenders: [...document.querySelectorAll('body *')]
            .filter(el => el.getBoundingClientRect().right > vw + 2 && !clipped(el))
            .slice(0, 3)
            .map(el => el.tagName + '.' + String(el.className).slice(0, 40))
        }
      })()`)
      ok(
        `${route.padEnd(20)} @${w}px`,
        o.scrollW <= o.clientW + 2,
        `scrollW=${o.scrollW} clientW=${o.clientW}${o.offenders.length ? ' offenders: ' + o.offenders.join(', ') : ''}`,
      )
    }
  }
  await cdp.send('Emulation.clearDeviceMetricsOverride')

  section('5. WCAG AA text contrast')
  await cdp.goto('/models')
  const contrast = await cdp.eval(`(() => {
    const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
    const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
    const parse = s => (s.match(/[\\d.]+/g) || []).map(Number)
    // Walk up for the first non-transparent background.
    const bgOf = el => {
      let n = el
      while (n && n !== document.documentElement) {
        const bg = parse(getComputedStyle(n).backgroundColor)
        if (bg.length >= 3 && (bg[3] === undefined || bg[3] > 0.85)) return bg
        n = n.parentElement
      }
      return [255, 255, 255]
    }
    const out = []
    for (const el of document.querySelectorAll('p,span,h1,h2,h3,h4,td,th,li,button,a,code,label')) {
      if (!el.textContent.trim()) continue
      if (el.children.length && !Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.9) continue
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) continue
      const fg = parse(cs.color)
      if (fg.length < 3) continue
      const a = fg[3] === undefined ? 1 : fg[3]
      if (a < 0.9) continue
      const bgc = bgOf(el)
      const l1 = L(fg.slice(0, 3)), l2 = L(bgc.slice(0, 3))
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
      const size = parseFloat(cs.fontSize)
      const bold = parseInt(cs.fontWeight, 10) >= 700
      const large = size >= 24 || (size >= 18.66 && bold)
      const need = large ? 3 : 4.5
      if (ratio < need) {
        out.push({ text: el.textContent.trim().slice(0, 34), ratio: +ratio.toFixed(2), need, size: Math.round(size), cls: String(el.className).slice(0, 44) })
      }
    }
    return out
  })()`)
  ok(
    'all visible text meets AA on /models',
    contrast.length === 0,
    contrast.length ? `${contrast.length} failing: ` + contrast.slice(0, 5).map(c => `"${c.text}" ${c.ratio}:1 (need ${c.need}, ${c.size}px)`).join(' | ') : '',
  )

  section('6. Image click opens a centred lightbox')
  await cdp.goto('/healthy-plants')
  const lightbox = await cdp.eval(`(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    const cards = [...document.querySelectorAll('button, [role="button"]')].filter(b => b.querySelector('img'))
    if (!cards.length) return { trigger: false }
    const trigger = cards[0]
    trigger.scrollIntoView({ block: 'center' })
    await sleep(250)
    // A programmatic .click() does not move focus the way a real click does, so
    // focus the trigger explicitly before asserting focus restoration.
    trigger.focus()
    trigger.click()
    await sleep(500)
    const dlg = document.querySelector('[role="dialog"][aria-modal="true"]')
    if (!dlg) return { trigger: true, opened: false }
    const img = dlg.querySelector('img')
    const r = img.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    const offX = Math.abs(cx - window.innerWidth / 2)
    const offY = Math.abs(cy - window.innerHeight / 2)
    const scroller = getComputedStyle(document.body).overflow
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await sleep(400)
    const stillOpen = !!document.querySelector('[role="dialog"][aria-modal="true"]')
    return {
      trigger: true, opened: true,
      centredX: offX < 2, centredY: offY < 2,
      offX: +offX.toFixed(1), offY: +offY.toFixed(1),
      vw: window.innerWidth, vh: window.innerHeight,
      imgW: Math.round(r.width), imgH: Math.round(r.height),
      bodyLocked: scroller === 'hidden',
      closedOnEscape: !stillOpen,
      focusRestored: document.activeElement === trigger,
      hasClose: !!dlg.querySelector('button[aria-label]'),
    }
  })()`)
  ok('an image trigger exists', lightbox.trigger)
  if (lightbox.opened) {
    ok('dialog opens on click', true)
    ok('image centred horizontally', lightbox.centredX, `offset=${lightbox.offX}px vw=${lightbox.vw}`)
    ok('image centred vertically', lightbox.centredY, `offset=${lightbox.offY}px vh=${lightbox.vh}`)
    ok('body scroll locked while open', lightbox.bodyLocked)
    ok('close button present', lightbox.hasClose)
    ok('Escape closes the dialog', lightbox.closedOnEscape)
    ok('focus returns to the trigger', lightbox.focusRestored)
  } else {
    ok('dialog opens on click', false, 'no dialog appeared')
  }

  section('7. Upload preview is clickable + opens viewer')
  await cdp.goto('/disease-detection')
  const upload = await cdp.eval(`(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    // Build a small PNG in-page and hand it to the file input.
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#3f9142'; ctx.fillRect(0, 0, 64, 64)
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'))
    const file = new File([blob], 'leaf.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]')
    if (!input) return { input: false }
    const dt = new DataTransfer()
    dt.items.add(file)
    input.files = dt.files
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await sleep(900)
    const btn = [...document.querySelectorAll('button')].find(b => b.querySelector('img'))
    if (!btn) return { input: true, preview: false }
    btn.focus()
    btn.click()
    await sleep(500)
    const dlg = document.querySelector('[role="dialog"][aria-modal="true"]')
    const out = { input: true, preview: true, opened: !!dlg }
    if (dlg) {
      const r = dlg.querySelector('img').getBoundingClientRect()
      out.centredX = Math.abs(r.left + r.width / 2 - innerWidth / 2) < 2
      out.centredY = Math.abs(r.top + r.height / 2 - innerHeight / 2) < 2
    }
    return out
  })()`)
  ok('file input present', upload.input)
  ok('preview renders after selection', upload.preview)
  if (upload.opened) {
    ok('upload preview opens viewer', true)
    ok('viewer image centred', upload.centredX && upload.centredY)
  } else {
    ok('upload preview opens viewer', false, 'no dialog')
  }

  section('Summary')
  console.log(`  ${checks - failures}/${checks} checks passed`)
  if (failures) {
    console.log(`  ${failures} FAILED`)
    process.exitCode = 1
  } else {
    console.log('  ALL GREEN')
  }
} catch (err) {
  console.error('\nSmoke run crashed:', err.message)
  process.exitCode = 1
} finally {
  cleanup()
}

import { useEffect, useRef } from 'react'
import './ClothCanvas.css'

/**
 * Realistic interactive t-shirt cloth simulation.
 * A t-shirt hangs from a real clothes hanger. Drag any point to manipulate
 * it — verlet integration with multiple constraint iterations gives believable
 * fabric drape. Quad shading reacts to compression/stretch for fold realism.
 */
export default function ClothCanvas() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let W = 0
    let H = 0

    // ─── Cloth params ───
    const COLS = 90
    const ROWS = 100
    const GRAVITY = 0.28
    const FRICTION = 0.995
    const BOUNCE = 0.3
    const ITERATIONS = 3
    const MOUSE_RADIUS = 65
    const TEAR_DIST = 240
    const FILL_RATIO = 0.58
    const STIFFNESS = 0.45

    let points = []
    let sticks = []
    let quads = []
    let spacing = 16
    let hSpacing = 16
    let vSpacing = 16
    let originX = 0
    let originY = 0
    let hangerLeft = 0
    let hangerRight = 0
    let hangerY = 0

    const mouse = { x: -9999, y: -9999, prevX: 0, prevY: 0, down: false, mode: 'fabric' }
    let resetting = false

    // Auto-open animation — runs once on first load
    let autoOpenStartTime = 0
    const AUTO_OPEN_DURATION = 2200
    const AUTO_OPEN_DELAY = 3600

    // ─── Curtain (full rectangle) ───
    const inTshirt = () => true

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildCloth()
    }

    const buildCloth = () => {
      points = []
      sticks = []
      quads = []

      const usableW = W * FILL_RATIO
      const usableH = H * 0.17
      // Independent horizontal/vertical spacing — width fills canvas regardless of height
      hSpacing = usableW / (COLS - 1)
      vSpacing = usableH / (ROWS - 1)
      spacing = (hSpacing + vSpacing) / 2 // average for area-shading reference
      // Leave enough left padding so the rod's left finial (drawn at
       // hangerLeft - 24) stays inside the canvas pixel bounds.
      originX = Math.max(W * 0.06, 48)
      originY = H * 0.15

      // Build points (with void flag for non-shirt cells)
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const inside = inTshirt(x, y)
          const px = originX + x * hSpacing
          const py = originY + y * vSpacing
          points.push({
            x: px,
            y: py,
            oldX: px,
            oldY: py,
            originX: px,
            originY: py,
            pinned: false,
            void: !inside,
          })
        }
      }

      // Pin the shoulder line (top row of shirt) every other point
      // Find shirt points on row 0 / row 1 — pin them to the hanger
      let pinnedXs = []
      for (let x = 0; x < COLS; x++) {
        const i = x // y=0
        if (!points[i].void) {
          if (x % 2 === 0) {
            points[i].pinned = true
            pinnedXs.push(originX + x * hSpacing)
          }
        }
      }

      // Calculate hanger geometry
      if (pinnedXs.length > 0) {
        hangerLeft = Math.min(...pinnedXs) - 12
        hangerRight = Math.max(...pinnedXs) + 12
        hangerY = originY - 6
      }

      // Structural sticks only — horizontal + vertical (no diagonals)
      // Diagonals cause weird compression on stretch; pure HV gives elastic drape
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x
          if (points[i].void) continue

          if (x < COLS - 1 && !points[i + 1].void) {
            sticks.push({ p1: i, p2: i + 1, length: hSpacing, broken: false })
          }
          if (y < ROWS - 1 && !points[i + COLS].void) {
            sticks.push({ p1: i, p2: i + COLS, length: vSpacing, broken: false })
          }
        }
      }

      // Pre-compute quads (for filled rendering)
      for (let y = 0; y < ROWS - 1; y++) {
        for (let x = 0; x < COLS - 1; x++) {
          const i = y * COLS + x
          if (
            points[i].void ||
            points[i + 1].void ||
            points[i + COLS].void ||
            points[i + COLS + 1].void
          )
            continue
          quads.push({
            a: i,
            b: i + 1,
            c: i + COLS + 1,
            d: i + COLS,
          })
        }
      }
    }

    // ─── Simulation ───
    const updatePoints = () => {
      // Auto-open on first load — bunches rings to the LEFT edge so the
      // rack behind is revealed (right-to-left opening motion).
      if (autoOpenStartTime > 0) {
        const elapsed = performance.now() - autoOpenStartTime - AUTO_OPEN_DELAY
        if (elapsed >= 0) {
          const t = Math.min(1, elapsed / AUTO_OPEN_DURATION)
          const eased = 1 - Math.pow(1 - t, 3)
          // Lerp each pinned ring from origin → bunched-left target
          const ringGap = 1.5
          let k = 0
          for (let i = 0; i < points.length; i++) {
            const p = points[i]
            if (!p.pinned) continue
            const targetX = hangerLeft + k * ringGap
            p.x = p.originX + (targetX - p.originX) * eased
            p.oldX = p.x
            k++
          }
          if (t >= 1) autoOpenStartTime = 0
        }
      }

      // Smooth reset — lerp pinned rings back to their original X positions
      if (resetting) {
        let stillMoving = false
        for (const p of points) {
          if (!p.pinned) continue
          const diff = p.originX - p.x
          if (Math.abs(diff) > 0.3) {
            p.x += diff * 0.12
            p.oldX = p.x
            stillMoving = true
          } else {
            p.x = p.originX
            p.oldX = p.x
          }
        }
        if (!stillMoving) resetting = false
      }

      // Curtain slide — when user drags near the top rod, slide all pinned points
      if (mouse.down && mouse.mode === 'curtain') {
        const dx = mouse.x - mouse.prevX
        for (const p of points) {
          if (!p.pinned) continue
          let nx = p.x + dx
          // Clamp to rod bounds
          if (nx < hangerLeft) nx = hangerLeft
          if (nx > hangerRight) nx = hangerRight
          p.oldX = nx // no velocity carry-over
          p.x = nx
        }
      }

      for (const p of points) {
        if (p.void) continue
        if (p.pinned) continue
        const vx = (p.x - p.oldX) * FRICTION
        const vy = (p.y - p.oldY) * FRICTION
        p.oldX = p.x
        p.oldY = p.y
        p.x += vx
        p.y += vy + GRAVITY

        // Mouse drag (fabric mode only)
        if (mouse.down && mouse.mode === 'fabric') {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            const force = 1 - dist / MOUSE_RADIUS
            p.x += (mouse.x - mouse.prevX) * 1.6 * force
            p.y += (mouse.y - mouse.prevY) * 1.6 * force
          }
        }

        if (p.x > W) { p.x = W; p.oldX = p.x + vx * BOUNCE }
        if (p.x < 0) { p.x = 0; p.oldX = p.x + vx * BOUNCE }
        if (p.y > H) { p.y = H; p.oldY = p.y + vy * BOUNCE }
        if (p.y < 0) { p.y = 0; p.oldY = p.y + vy * BOUNCE }
      }
    }

    const updateSticks = () => {
      for (const s of sticks) {
        if (s.broken) continue
        const p1 = points[s.p1]
        const p2 = points[s.p2]
        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001
        if (dist > TEAR_DIST) {
          s.broken = true
          continue
        }
        const diff = ((s.length - dist) / dist) * STIFFNESS
        const offsetX = dx * diff
        const offsetY = dy * diff
        if (!p1.pinned) {
          p1.x -= offsetX
          p1.y -= offsetY
        }
        if (!p2.pinned) {
          p2.x += offsetX
          p2.y += offsetY
        }
      }
    }

    // ─── Render ───
    const drawHanger = () => {
      // Curtain rod — straight horizontal bar with end caps
      const rodY = hangerY - 4
      const rodLeft = hangerLeft - 24
      const rodRight = hangerRight + 24

      // Rod
      ctx.strokeStyle = 'rgba(220,220,225,0.95)'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(rodLeft, rodY)
      ctx.lineTo(rodRight, rodY)
      ctx.stroke()

      // End caps (decorative finials)
      ctx.fillStyle = 'rgba(220,220,225,0.95)'
      ctx.beginPath()
      ctx.arc(rodLeft, rodY, 6, 0, Math.PI * 2)
      ctx.arc(rodRight, rodY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Curtain rings around each pinned point
      ctx.strokeStyle = 'rgba(200,200,210,0.95)'
      ctx.lineWidth = 2
      for (const p of points) {
        if (!p.pinned) continue
        ctx.beginPath()
        ctx.arc(p.x, rodY, 7, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, W, H)

      drawHanger()

      // Draw t-shirt quads with realistic shading
      const idealArea = spacing * spacing
      for (const q of quads) {
        const a = points[q.a]
        const b = points[q.b]
        const c = points[q.c]
        const d = points[q.d]

        // Skip if any edge is way too long (broken/torn)
        const e1 = Math.hypot(b.x - a.x, b.y - a.y)
        const e3 = Math.hypot(d.x - c.x, d.y - c.y)
        if (e1 > TEAR_DIST || e3 > TEAR_DIST) continue

        // Quad area via shoelace — collapsed quads (folds) → small area → darker
        const area = Math.abs(
          (a.x * (b.y - d.y) +
            b.x * (c.y - a.y) +
            c.x * (d.y - b.y) +
            d.x * (a.y - c.y)) / 2
        )
        const ratio = area / idealArea // 1 = flat, < 1 = folded, > 1 = stretched
        // Smooth shade: peak brightness at ratio ≈ 1
        const compress = Math.max(0.45, Math.min(1.0, ratio + 0.05))
        const shade = compress

        // Soft white cotton with warm undertone
        const r = Math.round(248 * shade + 6)
        const g = Math.round(244 * shade + 4)
        const bC = Math.round(236 * shade + 2)

        ctx.fillStyle = `rgb(${r},${g},${bC})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.lineTo(c.x, c.y)
        ctx.lineTo(d.x, d.y)
        ctx.closePath()
        ctx.fill()
        // Anti-aliased seam between quads
        ctx.strokeStyle = ctx.fillStyle
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    }

    let raf
    const loop = () => {
      updatePoints()
      for (let i = 0; i < ITERATIONS; i++) updateSticks()
      render()
      mouse.prevX = mouse.x
      mouse.prevY = mouse.y
      raf = requestAnimationFrame(loop)
    }

    // ─── Input ───
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      const t = e.touches ? e.touches[0] : e
      return { x: t.clientX - rect.left, y: t.clientY - rect.top }
    }
    const onMove = (e) => {
      const { x, y } = getPos(e)
      mouse.x = x
      mouse.y = y
    }
    const onDown = (e) => {
      const { x, y } = getPos(e)
      mouse.x = x
      mouse.y = y
      mouse.prevX = x
      mouse.prevY = y
      mouse.down = true
      // If user grabs near the rod → curtain slide mode; else fabric drag
      mouse.mode = Math.abs(y - (hangerY - 4)) < 24 ? 'curtain' : 'fabric'
    }
    const onUp = () => { mouse.down = false }
    const onDouble = () => { resetting = true }

    resize()
    autoOpenStartTime = performance.now()
    loop()

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchmove', onMove, { passive: true })
    canvas.addEventListener('touchstart', onDown, { passive: true })
    canvas.addEventListener('touchend', onUp)
    canvas.addEventListener('dblclick', onDouble)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('touchend', onUp)
      canvas.removeEventListener('dblclick', onDouble)
    }
  }, [])

  return (
    <div ref={wrapRef} className="cloth-canvas-wrap">
      {/* Sketchfab clothing rack — sits behind the curtain */}
      <div className="cloth-sketchfab">
        <iframe
          title="Store double bar rack with clothes"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          loading="eager"
          src="https://sketchfab.com/models/0d818bbea6424343a260bd8bd6dcb17d/embed?autostart=1&preload=1&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_loading=0&ui_theme=dark&transparent=1"
          onLoad={(e) => e.currentTarget.classList.add('cloth-sketchfab__iframe--ready')}
          style={{ border: 0 }}
        />
      </div>

      <canvas ref={canvasRef} className="cloth-canvas" />
    </div>
  )
}

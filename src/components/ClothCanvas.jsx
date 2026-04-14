import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
  const modelContainerRef = useRef(null)
  // Delay 3D model until after page loader
  const [modelReady, setModelReady] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const onLoaderDone = () => {
      // Wait 800ms after loader exits for cloth to settle, then load 3D model
      setTimeout(() => setModelReady(true), 800)
    }
    document.addEventListener('closetx:loader-done', onLoaderDone)
    return () => document.removeEventListener('closetx:loader-done', onLoaderDone)
  }, [])

  // Three.js 3D Model Scene
  useEffect(() => {
    if (!modelReady || !modelContainerRef.current) return

    const container = modelContainerRef.current
    const W = () => container.clientWidth
    const H = () => container.clientHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W(), H())
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 100)
    camera.position.set(0, 1.6, 3.5)
    camera.lookAt(0, 1, 0)

    // OrbitControls for interactive movement
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enablePan = true
    controls.minDistance = 2
    controls.maxDistance = 8
    controls.maxPolarAngle = Math.PI / 1.5
    controls.autoRotate = true  // Enable auto-rotation
    controls.autoRotateSpeed = 1.0  // Rotation speed

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(3, 5, 4)
    key.castShadow = true
    key.shadow.mapSize.width = 1024
    key.shadow.mapSize.height = 1024
    scene.add(key)

    const rim = new THREE.DirectionalLight(0x6f80ff, 0.8)
    rim.position.set(-4, 3, -2)
    scene.add(rim)

    const fill = new THREE.PointLight(0xffffff, 0.4, 15)
    fill.position.set(-2, 1, 3)
    scene.add(fill)

    // Load GLB Model
    const loader = new GLTFLoader()
    let model = null
    let mixer = null

    loader.load(
      '/realistic_human_cloths.glb',
      (gltf) => {
        model = gltf.scene
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.8 / maxDim  // Reduced from 3.5 to 2.8
        model.scale.setScalar(scale)
        
        model.position.x = -center.x * scale
        model.position.y = -box.min.y * scale - 2.0  // Move down by 2.0 units
        model.position.z = -center.z * scale
        
        // Enable shadows
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        scene.add(model)
        
        // Setup animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model)
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play()
          })
        }
        
        // Fade in
        setLoadingProgress(100)
        container.classList.add('model-loaded')
      },
      (progress) => {
        // Update loading progress
        if (progress.lengthComputable) {
          const percent = (progress.loaded / progress.total) * 100
          setLoadingProgress(Math.round(percent))
        }
      },
      (error) => {
        console.error('Error loading 3D model:', error)
        setLoadingProgress(0)
      }
    )

    // Animation loop
    let raf
    const clock = new THREE.Clock()
    const animate = () => {
      const delta = clock.getDelta()
      
      if (mixer) mixer.update(delta)
      
      // Update controls
      controls.update()
      
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    // Resize handler
    const onResize = () => {
      const w = W()
      const h = H()
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      controls.dispose()
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })
    }
  }, [modelReady])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    // Cap at 1.5× — on Retina (dpr=2) this renders 44% fewer pixels
    // with virtually no visible difference on a cloth simulation.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    let W = 0
    let H = 0

    // ─── Cloth params ───
    const COLS = 60
    const ROWS = 70
    const GRAVITY = 0.28
    const FRICTION = 0.995
    const BOUNCE = 0.3
    const ITERATIONS = 2
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

    // Auto-open animation — runs once after loader exits
    let autoOpenStartTime = 0
    const AUTO_OPEN_DURATION = 1800  // Faster animation
    const AUTO_OPEN_DELAY = 200      // Start immediately after loader

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

    // Debounced resize to avoid rebuilding cloth on every resize event
    let resizeTimeout
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resize, 150)
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

    const SHADE_BUCKETS = 24 // quantise shade → 24 colour stops
    // Pre-allocate bucket arrays (reused every frame, no GC pressure)
    const buckets = Array.from({ length: SHADE_BUCKETS }, () => [])

    const render = () => {
      ctx.clearRect(0, 0, W, H)

      drawHanger()

      // ── Batched draw: group quads by shade bucket, one fill() per bucket ──
      // Reduces ~4 000 individual fill calls to just 24 — huge Canvas2D speedup.
      const idealArea = spacing * spacing

      // Clear buckets
      for (let b = 0; b < SHADE_BUCKETS; b++) buckets[b].length = 0

      for (const q of quads) {
        const a = points[q.a]
        const b = points[q.b]
        const c = points[q.c]
        const d = points[q.d]

        const e1 = Math.hypot(b.x - a.x, b.y - a.y)
        const e3 = Math.hypot(d.x - c.x, d.y - c.y)
        if (e1 > TEAR_DIST || e3 > TEAR_DIST) continue

        const area = Math.abs(
          (a.x * (b.y - d.y) +
            b.x * (c.y - a.y) +
            c.x * (d.y - b.y) +
            d.x * (a.y - c.y)) / 2
        )
        const ratio = area / idealArea
        const shade = Math.max(0.45, Math.min(1.0, ratio + 0.05))
        const bi = Math.min(SHADE_BUCKETS - 1, Math.floor(shade * SHADE_BUCKETS))
        buckets[bi].push(a, b, c, d) // push 4 points consecutively
      }

      ctx.lineWidth = 0.6
      for (let bi = 0; bi < SHADE_BUCKETS; bi++) {
        const bucket = buckets[bi]
        if (!bucket.length) continue

        const shade = (bi + 0.5) / SHADE_BUCKETS
        const r = Math.round(248 * shade + 6)
        const g = Math.round(244 * shade + 4)
        const bC = Math.round(236 * shade + 2)
        const col = `rgb(${r},${g},${bC})`

        ctx.beginPath()
        for (let j = 0; j < bucket.length; j += 4) {
          const a = bucket[j], b = bucket[j + 1], c = bucket[j + 2], d = bucket[j + 3]
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.lineTo(c.x, c.y)
          ctx.lineTo(d.x, d.y)
          ctx.closePath()
        }
        ctx.fillStyle = col
        ctx.fill()
        ctx.strokeStyle = col
        ctx.stroke()
      }
    }

    // ─── Visibility gate — pause physics+render when off-screen ───
    let visible = true
    const visObs = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0.01 }
    )
    visObs.observe(wrap)

    // ─── Loader gate — skip canvas RENDER during loader slide-up ───
    // Physics keeps running so the cloth stays settled, but no GPU draw calls
    // compete with the compositor while it animates the loader exit.
    let loaderExiting = true // start in "paused render" mode
    const onLoaderExiting = () => { loaderExiting = true }
    const onLoaderDone    = () => { loaderExiting = false }
    document.addEventListener('closetx:loader-exiting', onLoaderExiting)
    document.addEventListener('closetx:loader-done',    onLoaderDone)

    // ─── Performance throttling — reduce iterations when frame rate drops ───
    let lastFrameTime = performance.now()
    let adaptiveIterations = ITERATIONS

    let raf
    const loop = () => {
      if (visible) {
        const now = performance.now()
        const delta = now - lastFrameTime
        lastFrameTime = now
        
        // If frame took >25ms (below 40fps), reduce constraint iterations
        adaptiveIterations = delta > 25 ? 1 : ITERATIONS
        
        updatePoints()
        for (let i = 0; i < adaptiveIterations; i++) updateSticks()
        if (!loaderExiting) render() // skip GPU draw during loader exit
      }
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
    // Start auto-open only after loader exits
    const startAutoOpen = () => {
      autoOpenStartTime = performance.now()
    }
    document.addEventListener('closetx:loader-done', startAutoOpen)
    loop()

    // Cleanup auto-open listener
    const cleanupAutoOpen = () => {
      document.removeEventListener('closetx:loader-done', startAutoOpen)
    }

    window.addEventListener('resize', debouncedResize)
    canvas.addEventListener('mousemove', onMove, { passive: true })
    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchmove', onMove, { passive: true })
    canvas.addEventListener('touchstart', onDown, { passive: true })
    canvas.addEventListener('touchend', onUp)
    canvas.addEventListener('dblclick', onDouble)

    return () => {
      clearTimeout(resizeTimeout)
      cancelAnimationFrame(raf)
      visObs.disconnect()
      cleanupAutoOpen()
      document.removeEventListener('closetx:loader-exiting', onLoaderExiting)
      document.removeEventListener('closetx:loader-done',    onLoaderDone)
      window.removeEventListener('resize', debouncedResize)
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
      {/* 3D Human Model — sits behind the curtain */}
      <div ref={modelContainerRef} className="cloth-model-container">
        {/* Loading indicator */}
        {modelReady && loadingProgress < 100 && (
          <div className="model-loading">
            <div className="model-loading-bar">
              <div 
                className="model-loading-fill" 
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="model-loading-text">{loadingProgress}%</span>
          </div>
        )}
        {/* Three.js canvas will be injected here */}
      </div>

      <canvas ref={canvasRef} className="cloth-canvas" />
    </div>
  )
}

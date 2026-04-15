import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './ClothCanvas.css'

export default function ClothCanvas() {
  const wrapRef = useRef(null)
  const modelContainerRef = useRef(null)
  const frozenRef = useRef(false)

  // ── Canvas freeze / unfreeze on scroll ───────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const mobile = window.innerWidth < 900

        if (mobile) {
          const marqEl = document.getElementById('marquee-white')
          if (!marqEl) return
          const marqDocTop = marqEl.getBoundingClientRect().top + window.scrollY
          const stickyAt = marqDocTop - window.innerHeight

          if (window.scrollY >= stickyAt) {
            if (!frozenRef.current) {
              const rect = wrap.getBoundingClientRect()
              frozenRef.current = true
              wrap.style.position = 'absolute'
              wrap.style.top = `${window.scrollY + rect.top}px`
              wrap.style.height = `${rect.height}px`
            }
          } else {
            if (frozenRef.current) {
              frozenRef.current = false
              wrap.style.position = 'fixed'
              wrap.style.top = ''
              wrap.style.height = ''
            }
          }
          return
        }

        // Desktop
        const marqEl = document.getElementById('marquee-blue')
        if (!marqEl) return
        const stickyAt = marqEl.offsetTop - window.innerHeight
        if (window.scrollY >= stickyAt) {
          if (!frozenRef.current) {
            frozenRef.current = true
            wrap.style.position = 'absolute'
            wrap.style.top = `${stickyAt}px`
            wrap.style.height = `${window.innerHeight}px`
          }
        } else {
          if (frozenRef.current) {
            frozenRef.current = false
            wrap.style.position = 'fixed'
            wrap.style.top = '0'
            wrap.style.height = '100%'
          }
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Three.js Scene ───────────────────────────────────────────────
  useEffect(() => {
    const container = modelContainerRef.current
    if (!container) return

    // Cache device type once — never recalculate per frame
    const mobile = window.innerWidth < 900
    const W = () => container.clientWidth
    const H = () => container.clientHeight

    // ── Renderer: mobile = lightweight, desktop = quality ──
    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,          // antialias OFF on mobile
      alpha: true,
      powerPreference: 'high-performance',
      precision: mobile ? 'mediump' : 'highp',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 2))
    renderer.setSize(W(), H())
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = !mobile   // shadows OFF on mobile
    if (!mobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // ── Scene ──
    const scene = new THREE.Scene()

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(
      mobile ? 65 : 45,
      W() / H(),
      0.1,
      100
    )
    camera.position.set(0, mobile ? 1.2 : 1.6, mobile ? 5.5 : 3.8)
    camera.lookAt(0, 1, 0)

    // ── Controls ──
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = false
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableRotate = false
    controls.autoRotate = false
    controls.target.set(0, 1, 0)
    controls.update()

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, mobile ? 1.2 : 0.6))

    const key = new THREE.DirectionalLight(0xffffff, mobile ? 1.0 : 1.2)
    key.position.set(3, 5, 4)
    if (!mobile) {
      key.castShadow = true
      key.shadow.mapSize.width = 512
      key.shadow.mapSize.height = 512
    }
    scene.add(key)

    const rim = new THREE.DirectionalLight(0x6f80ff, mobile ? 0.5 : 0.8)
    rim.position.set(-4, 3, -2)
    scene.add(rim)

    if (!mobile) {
      const fill = new THREE.PointLight(0xffffff, 0.4, 15)
      fill.position.set(-2, 1, 3)
      scene.add(fill)
    }

    // ── Model ──
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/gltf/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    let model = null
    let mixer = null

    loader.load(
      '/realistic_human_cloths_opt.glb',
      (gltf) => {
        model = gltf.scene

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.8 / maxDim

        model.scale.setScalar(scale)
        model.position.x = -center.x * scale - 1.2
        model.position.y = -box.min.y * scale - 1.4
        model.position.z = -center.z * scale
        model._baseX = -center.x * scale

        model.traverse((child) => {
          if (child.isMesh) {
            if (!mobile) {
              child.castShadow = true
              child.receiveShadow = true
            }
            // Reduce texture quality on mobile
            if (mobile && child.material) {
              const mats = Array.isArray(child.material)
                ? child.material
                : [child.material]
              mats.forEach((m) => {
                if (m.map) m.map.anisotropy = 1
              })
            }
          }
        })

        scene.add(model)

        if (gltf.animations?.length > 0) {
          mixer = new THREE.AnimationMixer(model)
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play())
        }

        container.classList.add('model-loaded')
      },
      undefined,
      (err) => console.warn('GLB load error:', err)
    )

    // ── Scroll-driven animation state ──
    let scrollProgress = 0
    let targetXOffset = mobile ? 0 : -1.2
    let targetRotY = 0

    const onScroll = () => {
      if (frozenRef.current) return

      const heroEl = document.getElementById('hero')
      const aboutEl = document.getElementById('about')
      if (!heroEl || !aboutEl) return

      const heroH = heroEl.offsetHeight
      const scrollY = window.scrollY

      if (scrollY <= heroH) {
        scrollProgress = scrollY / heroH
        targetXOffset = mobile ? 0 : -1.2
        targetRotY = mobile
          ? -scrollProgress * Math.PI * 0.4
          : scrollProgress * Math.PI * 0.4
      } else if (!mobile) {
        const aboutTop = aboutEl.offsetTop
        const aboutH = aboutEl.offsetHeight
        if (scrollY <= aboutTop + aboutH * 0.6) {
          const t = Math.min(1, (scrollY - heroH) / (aboutTop + aboutH * 0.3 - heroH))
          scrollProgress = 1
          targetXOffset = -1.2 + t * 3.8
          targetRotY = Math.PI * 0.4 + t * Math.PI * 0.5
        } else {
          targetXOffset = -1.2
          targetRotY = 0
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Animation loop — pauses when hidden ──
    let raf = null
    let isRendering = true

    const tick = () => {
      if (!isRendering) return
      raf = requestAnimationFrame(tick)

      const delta = Math.min(clock.getDelta(), 0.05) // cap delta to avoid spiral
      if (mixer) mixer.update(delta)

      if (!mobile) {
        const targetZ = 3.8 - scrollProgress * 1.5
        camera.position.z += (targetZ - camera.position.z) * 0.12
      }

      if (model) {
        if (mobile) {
          const baseX = model._baseX ?? 0
          model.position.x += (baseX - model.position.x) * 0.08
          model.rotation.y += 0.008
        } else {
          const baseX = model._baseX ?? 0
          model.position.x += (baseX + targetXOffset - model.position.x) * 0.06
          model.rotation.y += (targetRotY - model.rotation.y) * 0.06
        }
      }

      renderer.render(scene, camera)
    }

    const clock = new THREE.Clock()
    tick()

    // ── Pause when tab hidden ──
    const onVisibility = () => {
      if (document.hidden) {
        isRendering = false
        cancelAnimationFrame(raf)
      } else {
        isRendering = true
        clock.getDelta() // flush stale delta
        tick()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ── Pause when scrolled far off-screen ──
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isRendering && !document.hidden) {
            isRendering = true
            clock.getDelta()
            tick()
          }
        } else {
          isRendering = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(container)

    // ── Loader events ──
    document.addEventListener('closetx:loader-exiting', () => {
      isRendering = false
      cancelAnimationFrame(raf)
    })
    document.addEventListener('closetx:loader-done', () => {
      if (!document.hidden) {
        isRendering = true
        clock.getDelta()
        tick()
      }
    })

    // ── Throttled resize ──
    let resizeTimer = null
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        renderer.setSize(W(), H())
        camera.aspect = W() / H()
        const isMob = window.innerWidth < 900
        camera.fov = isMob ? 65 : 45
        if (!isRendering) camera.position.set(0, isMob ? 1.2 : 1.6, isMob ? 5.5 : 3.8)
        camera.updateProjectionMatrix()
      }, 100)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ──
    return () => {
      isRendering = false
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      observer.disconnect()
      controls.dispose()
      dracoLoader.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            Object.values(m).forEach((v) => {
              if (v?.isTexture) v.dispose()
            })
            m.dispose()
          })
        }
      })
    }
  }, [])

  return (
    <div ref={wrapRef} className="cloth-canvas-wrap">
      <div ref={modelContainerRef} className="cloth-model-container" />
    </div>
  )
}

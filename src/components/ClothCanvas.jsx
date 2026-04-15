import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './ClothCanvas.css'

export default function ClothCanvas() {
  const wrapRef = useRef(null)
  const modelContainerRef = useRef(null)
  const frozenRef = useRef(false)

  // Stick canvas above the blue marquee — freeze everything past that point
  useEffect(() => {
    const wrap = wrapRef.current
    const onScroll = () => {
      if (!wrap) return
      const mobile = window.innerWidth < 900

      if (mobile) {
        // Use getBoundingClientRect for accurate document position
        const marqEl = document.getElementById('marquee-white')
        if (!marqEl) return
        // True document top of the white marquee
        const marqDocTop = marqEl.getBoundingClientRect().top + window.scrollY
        // Freeze when the white marquee enters the bottom of the viewport
        const stickyAt = marqDocTop - window.innerHeight

        if (window.scrollY >= stickyAt) {
          if (!frozenRef.current) {
            // Pin canvas exactly where it is visually — no drop
            const rect = wrap.getBoundingClientRect()
            frozenRef.current = true
            wrap.style.position = 'absolute'
            wrap.style.top = `${window.scrollY + rect.top}px`
            wrap.style.height = `${rect.height}px`
          }
        } else {
          frozenRef.current = false
          wrap.style.position = 'fixed'
          wrap.style.top = ''
          wrap.style.height = ''
        }
        return
      }

      // Desktop: freeze at blue marquee
      const marqEl = document.getElementById('marquee-blue')
      if (!marqEl) return
      const stickyAt = marqEl.offsetTop - window.innerHeight
      if (window.scrollY >= stickyAt) {
        frozenRef.current = true
        wrap.style.position = 'absolute'
        wrap.style.top = `${stickyAt}px`
        wrap.style.height = `${window.innerHeight}px`
      } else {
        frozenRef.current = false
        wrap.style.position = 'fixed'
        wrap.style.top = '0'
        wrap.style.height = '100%'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Three.js 3D Model Scene — starts loading immediately in background
  useEffect(() => {
    if (!modelContainerRef.current) return

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
    const isMobile = () => window.innerWidth < 900
    const camera = new THREE.PerspectiveCamera(isMobile() ? 65 : 45, W() / H(), 0.1, 100)
    if (isMobile()) {
      camera.position.set(0, 1.2, 5.5)
    } else {
      camera.position.set(0, 1.6, 3.8)
    }
    camera.lookAt(0, 1, 0)

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = false
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableRotate = false
    controls.autoRotate = false
    controls.autoRotateSpeed = 0
    controls.target.set(0, 1, 0)
    controls.update()

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
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        scene.add(model)

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model)
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play()
          })
        }

        container.classList.add('model-loaded')
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model:', error)
      }
    )

    // Scroll-driven: model travels left (hero) → right (about)
    let scrollProgress = 0
    let targetXOffset = isMobile() ? 0 : -1.2
    let targetRotY = 0

    const onScroll = () => {
      if (frozenRef.current) return   // frozen — don't touch model

      const heroEl = document.getElementById('hero')
      const aboutEl = document.getElementById('about')
      if (!heroEl || !aboutEl) return

      const heroH = heroEl.offsetHeight
      const aboutTop = aboutEl.offsetTop
      const aboutH = aboutEl.offsetHeight
      const scrollY = window.scrollY
      const mobile = isMobile()

      if (scrollY <= heroH) {
        // In hero: zoom on scroll
        scrollProgress = scrollY / heroH
        targetXOffset = mobile ? 0 : -1.2
        // Mobile rotates right (negative), desktop rotates left (positive)
        targetRotY = mobile
          ? -scrollProgress * Math.PI * 0.4
          : scrollProgress * Math.PI * 0.4
      } else if (!mobile && scrollY <= aboutTop + aboutH * 0.6) {
        // Desktop only: slide model right entering about section
        const t = Math.min(1, (scrollY - heroH) / (aboutTop + aboutH * 0.3 - heroH))
        scrollProgress = 1
        targetXOffset = -1.2 + t * 3.8
        targetRotY = Math.PI * 0.4 + t * Math.PI * 0.5
      } else {
        targetXOffset = mobile ? 0 : -1.2
        targetRotY = 0
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Animation loop
    let raf
    const clock = new THREE.Clock()
    const animate = () => {
      const delta = clock.getDelta()
      if (mixer) mixer.update(delta)

      const onMobile = window.innerWidth < 900

      if (!onMobile) {
        // Desktop only: scroll-driven zoom
        const targetZ = 3.8 - scrollProgress * 1.5
        camera.position.z += (targetZ - camera.position.z) * 0.15
      }

      if (model) {
        if (onMobile) {
          // Center model (remove desktop -1.2 x offset) and spin in place
          const baseX = model._baseX ?? 0
          model.position.x += (baseX - model.position.x) * 0.08
          model.rotation.y += 0.008
        } else {
          // Desktop: scroll-driven x slide + rotation
          const baseX = model._baseX ?? 0
          const desiredX = baseX + targetXOffset
          model.position.x += (desiredX - model.position.x) * 0.06
          model.rotation.y += (targetRotY - model.rotation.y) * 0.06
        }
      }

      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    // Resize handler
    const onResize = () => {
      renderer.setSize(W(), H())
      camera.aspect = W() / H()
      if (isMobile()) {
        camera.fov = 65
        camera.position.set(0, 1.2, 5.5)
      } else {
        camera.fov = 45
        camera.position.set(0, 1.6, 3.8)
      }
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
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
  }, [])

  return (
    <div ref={wrapRef} className="cloth-canvas-wrap">
      <div ref={modelContainerRef} className="cloth-model-container" />
    </div>
  )
}

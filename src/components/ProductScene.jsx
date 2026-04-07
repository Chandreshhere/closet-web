import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './ProductScene.css'

/**
 * WebGL 3D scene rendered behind the curtain.
 * Stylized low-poly products: t-shirt, sneaker, cap, bag.
 * Slowly rotates and floats so the scene feels alive.
 */
export default function ProductScene() {
  const wrapRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const W = () => wrap.clientWidth
    const H = () => wrap.clientHeight

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W(), H())
    renderer.setClearColor(0x000000, 0)
    wrap.appendChild(renderer.domElement)

    // ── Scene & camera ──
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.1, 100)
    camera.position.set(0, 0, 8)

    // ── Lights ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambient)

    const key = new THREE.DirectionalLight(0xffffff, 1.1)
    key.position.set(4, 6, 5)
    scene.add(key)

    const rim = new THREE.DirectionalLight(0x2400ff, 0.8)
    rim.position.set(-5, 2, -3)
    scene.add(rim)

    const fill = new THREE.PointLight(0xff4488, 0.6, 20)
    fill.position.set(-3, -2, 4)
    scene.add(fill)

    // ── Products group ──
    const productsGroup = new THREE.Group()
    scene.add(productsGroup)

    // ─── 1. T-SHIRT (extruded silhouette) ───
    const tshirtShape = new THREE.Shape()
    tshirtShape.moveTo(-0.6, 0.9)
    tshirtShape.lineTo(-1.2, 0.7)
    tshirtShape.lineTo(-1.4, 0.2)
    tshirtShape.lineTo(-0.9, 0.05)
    tshirtShape.lineTo(-0.7, 0.1)
    tshirtShape.lineTo(-0.7, -1.1)
    tshirtShape.lineTo(0.7, -1.1)
    tshirtShape.lineTo(0.7, 0.1)
    tshirtShape.lineTo(0.9, 0.05)
    tshirtShape.lineTo(1.4, 0.2)
    tshirtShape.lineTo(1.2, 0.7)
    tshirtShape.lineTo(0.6, 0.9)
    tshirtShape.quadraticCurveTo(0, 0.5, -0.6, 0.9)

    const tshirtGeo = new THREE.ExtrudeGeometry(tshirtShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 4,
    })
    const tshirtMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,
      roughness: 0.85,
      metalness: 0.05,
    })
    const tshirt = new THREE.Mesh(tshirtGeo, tshirtMat)
    tshirt.position.set(-2.4, 0.3, 0)
    tshirt.rotation.y = -0.2
    productsGroup.add(tshirt)

    // ─── 2. SNEAKER (stylized capsule + sole) ───
    const sneakerGroup = new THREE.Group()
    const upperGeo = new THREE.CapsuleGeometry(0.45, 1.2, 6, 16)
    const upperMat = new THREE.MeshStandardMaterial({
      color: 0xee2222,
      roughness: 0.4,
      metalness: 0.1,
    })
    const upper = new THREE.Mesh(upperGeo, upperMat)
    upper.rotation.z = Math.PI / 2
    upper.scale.set(1, 1, 0.7)
    sneakerGroup.add(upper)

    const soleGeo = new THREE.BoxGeometry(1.9, 0.18, 0.7)
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.3,
      metalness: 0.05,
    })
    const sole = new THREE.Mesh(soleGeo, soleMat)
    sole.position.y = -0.45
    sneakerGroup.add(sole)

    sneakerGroup.position.set(-0.7, -0.5, 0)
    sneakerGroup.rotation.y = 0.4
    productsGroup.add(sneakerGroup)

    // ─── 3. CAP (sphere half + visor) ───
    const capGroup = new THREE.Group()
    const crownGeo = new THREE.SphereGeometry(0.7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0x101218,
      roughness: 0.6,
      metalness: 0.15,
    })
    const crown = new THREE.Mesh(crownGeo, crownMat)
    capGroup.add(crown)

    const visorGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.06, 32, 1, false, 0, Math.PI)
    const visor = new THREE.Mesh(visorGeo, crownMat)
    visor.position.set(0, 0, 0.45)
    visor.rotation.x = Math.PI / 2
    capGroup.add(visor)

    capGroup.position.set(1.0, 0.6, 0)
    capGroup.rotation.y = -0.5
    productsGroup.add(capGroup)

    // ─── 4. BAG (rounded box + handle) ───
    const bagGroup = new THREE.Group()
    const bagBodyGeo = new THREE.BoxGeometry(1.1, 1.3, 0.55)
    const bagMat = new THREE.MeshStandardMaterial({
      color: 0x6b4a30,
      roughness: 0.55,
      metalness: 0.2,
    })
    const bagBody = new THREE.Mesh(bagBodyGeo, bagMat)
    bagGroup.add(bagBody)

    const handleGeo = new THREE.TorusGeometry(0.42, 0.06, 12, 32, Math.PI)
    const handle = new THREE.Mesh(handleGeo, bagMat)
    handle.position.y = 0.7
    bagGroup.add(handle)

    bagGroup.position.set(2.5, -0.2, 0)
    bagGroup.rotation.y = 0.3
    productsGroup.add(bagGroup)

    // ── Animation ──
    let raf
    const start = performance.now()
    const animate = () => {
      const t = (performance.now() - start) * 0.001

      tshirt.rotation.y = -0.2 + Math.sin(t * 0.6) * 0.15
      tshirt.position.y = 0.3 + Math.sin(t * 0.8) * 0.08

      sneakerGroup.rotation.y = 0.4 + Math.sin(t * 0.5 + 1) * 0.2
      sneakerGroup.position.y = -0.5 + Math.sin(t * 0.7 + 1) * 0.06

      capGroup.rotation.y = -0.5 + Math.sin(t * 0.55 + 2) * 0.18
      capGroup.position.y = 0.6 + Math.sin(t * 0.9 + 2) * 0.07

      bagGroup.rotation.y = 0.3 + Math.sin(t * 0.5 + 3) * 0.15
      bagGroup.position.y = -0.2 + Math.sin(t * 0.85 + 3) * 0.06

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    // ── Resize ──
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
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (renderer.domElement.parentNode === wrap) {
        wrap.removeChild(renderer.domElement)
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
    }
  }, [])

  return <div ref={wrapRef} className="product-scene" />
}

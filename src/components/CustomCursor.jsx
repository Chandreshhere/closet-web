import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Chrome / Metallic 3D Arrow SVG — Y2K aesthetic
const ChromeArrowSVG = () => (
  <svg
    width="36"
    height="42"
    viewBox="0 0 36 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))' }}
  >
    <defs>
      {/* Main chrome gradient — face of the arrow */}
      <linearGradient id="chrome-arrow-main" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f7f7f7" />
        <stop offset="18%" stopColor="#d4d4d4" />
        <stop offset="35%" stopColor="#ffffff" />
        <stop offset="52%" stopColor="#b8b8b8" />
        <stop offset="70%" stopColor="#e0e0e0" />
        <stop offset="85%" stopColor="#a8a8a8" />
        <stop offset="100%" stopColor="#cccccc" />
      </linearGradient>
      {/* Edge / bevel gradient — darker, gives 3D depth */}
      <linearGradient id="chrome-arrow-edge" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#aaaaaa" />
        <stop offset="30%" stopColor="#888888" />
        <stop offset="60%" stopColor="#666666" />
        <stop offset="100%" stopColor="#999999" />
      </linearGradient>
      {/* Highlight streak */}
      <linearGradient id="chrome-arrow-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Shadow / back edge — offset slightly for 3D depth */}
    <path
      d="M4 1L4 33L10 27L16 38L21 35.5L15 25L23 24L4 1Z"
      fill="url(#chrome-arrow-edge)"
      transform="translate(2, 2)"
    />

    {/* Main arrow body */}
    <path
      d="M4 1L4 33L10 27L16 38L21 35.5L15 25L23 24L4 1Z"
      fill="url(#chrome-arrow-main)"
      stroke="#8a8a8a"
      strokeWidth="0.5"
    />

    {/* Inner highlight streak for glossy metallic feel */}
    <path
      d="M5.5 5L5.5 28L9.5 24.5L6 6Z"
      fill="url(#chrome-arrow-highlight)"
    />

    {/* Tiny specular highlight at tip */}
    <circle cx="5.5" cy="4" r="1.5" fill="white" opacity="0.7" />
  </svg>
)

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const trailRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    gsap.set(cursor, { xPercent: 0, yPercent: 0 })
    gsap.set(trail, { xPercent: -50, yPercent: -50 })

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const mouse = { x: pos.x, y: pos.y }

    const moveCursor = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY

      // Arrow follows mouse directly — snappy
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    // Smooth trail ring with RAF
    const updateTrail = () => {
      pos.x += (mouse.x - pos.x) * 0.12
      pos.y += (mouse.y - pos.y) * 0.12
      gsap.set(trail, { x: pos.x, y: pos.y })
      requestAnimationFrame(updateTrail)
    }
    const rafId = requestAnimationFrame(updateTrail)

    // Hover effects
    const handleEnter = () => {
      gsap.to(trail, { width: 70, height: 70, opacity: 1, duration: 0.35, ease: 'power3.out' })
      gsap.to(cursor, { scale: 0.8, duration: 0.25 })
    }

    const handleLeave = () => {
      gsap.to(trail, { width: 44, height: 44, opacity: 0.5, duration: 0.35, ease: 'power3.out' })
      gsap.to(cursor, { scale: 1, duration: 0.25 })
    }

    window.addEventListener('mousemove', moveCursor)

    const timer = setTimeout(() => {
      document.querySelectorAll('a, button, .pill-btn, .interactive').forEach((el) => {
        el.addEventListener('mouseenter', handleEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
    }, 1500)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      cancelAnimationFrame(rafId)
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* Chrome 3D Arrow Cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 100000,
          willChange: 'transform',
        }}
      >
        <ChromeArrowSVG />
      </div>

      {/* Trailing ring — subtle chrome outline */}
      <div
        ref={trailRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1.5px solid rgba(180,180,180,0.35)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0.5,
          willChange: 'transform, width, height',
        }}
      />
    </>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Brands.css'

gsap.registerPlugin(ScrollTrigger)

const brands = [
  'NIKE', 'ADIDAS', 'ZARA', 'H&M', 'PUMA', "LEVI'S",
  'GUCCI', 'TOMMY HILFIGER', 'CALVIN KLEIN', 'CONVERSE',
  'VANS', 'NEW BALANCE',
]

const CategoryIcon = ({ type }) => {
  const icons = {
    'T-SHIRTS': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7L17 4H7L4 7L2 11L5 12V20H19V12L22 11L20 7Z" />
      </svg>
    ),
    'DRESSES': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2H16L18 8L14 10V22H10V10L6 8L8 2Z" />
      </svg>
    ),
    'SNEAKERS': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18H22V20H2V18ZM4 16L6 8H10L12 12H20L22 16H4Z" />
      </svg>
    ),
    'JEANS': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2H18V6L15 12V22H9V12L6 6V2ZM12 6V12" />
      </svg>
    ),
    'WATCHES': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" /><path d="M12 9V12L14 14" /><path d="M9 2H15M9 22H15" />
      </svg>
    ),
    'BAGS': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6ZM3 6H21M16 10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10" />
      </svg>
    ),
    'SUNGLASSES': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="14" r="4" /><circle cx="18" cy="14" r="4" /><path d="M10 14H14M2 10L6 10M18 10L22 10" />
      </svg>
    ),
    'JACKETS': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3H8L5 7L3 11V20H8V12H16V20H21V11L19 7L16 3ZM12 3V12" />
      </svg>
    ),
  }
  return icons[type] || null
}

const categories = [
  'T-SHIRTS', 'DRESSES', 'SNEAKERS', 'JEANS',
  'WATCHES', 'BAGS', 'SUNGLASSES', 'JACKETS',
]

const stats = [
  { num: '24+', label: 'Premium Brands' },
  { num: '8', label: 'Categories' },
  { num: '30m', label: 'Express Delivery' },
  { num: '100%', label: 'Authentic Only' },
]

export default function Brands() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Outline + solid title staggered reveal
      gsap.fromTo(
        ['.brands__outline-title', '.brands__solid-title'],
        { y: 100, opacity: 0, skewY: 4 },
        {
          y: 0, opacity: 1, skewY: 0, duration: 1, ease: 'power4.out', stagger: 0.12,
          scrollTrigger: { trigger: '.brands__hero', start: 'top 78%' },
        }
      )

      // Right side fade in
      gsap.fromTo(
        '.brands__hero-right',
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.brands__hero', start: 'top 78%' },
        }
      )

      // Brand tiles stagger cascade
      gsap.fromTo(
        '.brands__tile',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: { amount: 0.5, grid: [3, 4], from: 'start' },
          scrollTrigger: { trigger: '.brands__grid', start: 'top 82%' },
        }
      )

      // Stats count-up reveal
      gsap.fromTo(
        '.brands__stat',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.brands__stats', start: 'top 87%' },
        }
      )

      // Scan line animation on stats
      gsap.fromTo(
        '.brands__stats-scan',
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.brands__stats', start: 'top 85%' },
        }
      )

      // Category rows reveal
      gsap.fromTo(
        '.brands__cat',
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: '.brands__categories', start: 'top 88%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="brands" id="brands">
      {/* Dot grid texture */}
      <div className="brands__bg-grid" aria-hidden="true" />

      {/* ── Hero Header ── */}
      <div className="brands__hero">
        <div className="brands__hero-left">
          <div className="brands__hero-eyebrow">
            <span className="section-label brands__eyebrow-label">Brands</span>
            <span className="brands__eyebrow-tag">EST. 2025</span>
          </div>
          <div className="brands__headline">
            <div className="brands__outline-title">24+</div>
            <div className="brands__solid-title">BRANDS.</div>
          </div>
        </div>

        <div className="brands__hero-right">
          {/* Rotating ring badge */}
          <div className="brands__badge" aria-hidden="true">
            <svg className="brands__badge-ring" viewBox="0 0 120 120">
              <defs>
                <path id="badgeCircle" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
              </defs>
              <text fontSize="9.5" fontWeight="700" letterSpacing="4.5" fill="rgba(255,255,255,0.45)">
                <textPath href="#badgeCircle">CLOSETX · 24+ BRANDS · FREE DELIVERY · </textPath>
              </text>
            </svg>
            <span className="brands__badge-star">✦</span>
          </div>

          <p className="brands__sub">
            From streetwear to luxury.<br />
            Every brand you love,<br />
            delivered in minutes.
          </p>

          <span className="brands__hero-note">Free express delivery · 100% authentic</span>
        </div>
      </div>

      {/* ── Brand Grid ── */}
      <div className="brands__grid">
        {brands.map((brand, i) => (
          <div key={i} className="brands__tile interactive">
            <span className="brands__tile-idx">{String(i + 1).padStart(2, '0')}</span>
            <span className="brands__tile-name">{brand}</span>
            <span className="brands__tile-arrow">↗</span>
            <div className="brands__tile-fill" />
          </div>
        ))}
      </div>

      {/* ── Stats Bar ── */}
      <div className="brands__stats">
        <div className="brands__stats-scan" aria-hidden="true" />
        {stats.map((s, i) => (
          <div key={i} className="brands__stat">
            <span className="brands__stat-num">{s.num}</span>
            <span className="brands__stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Categories ── */}
      <div className="brands__cats-wrap">
        <div className="brands__cats-header">
          <span className="section-label brands__cats-section-label">Shop by Category</span>
          <div className="brands__cats-rule" />
          <span className="brands__cats-count">{categories.length} categories</span>
        </div>
        <div className="brands__categories">
          {categories.map((cat, i) => (
            <div key={i} className="brands__cat interactive">
              <div className="brands__cat-fill" />
              <span className="brands__cat-icon">
                <CategoryIcon type={cat} />
              </span>
              <span className="brands__cat-name">{cat}</span>
              <span className="brands__cat-arrow">↗</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

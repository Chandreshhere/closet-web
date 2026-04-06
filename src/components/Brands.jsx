import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Brands.css'

gsap.registerPlugin(ScrollTrigger)

const brands = [
  'NIKE', 'ADIDAS', 'ZARA', 'H&M', 'PUMA', 'LEVI\'S',
  'GUCCI', 'TOMMY HILFIGER', 'CALVIN KLEIN', 'CONVERSE',
  'VANS', 'NEW BALANCE',
]

const CategoryIcon = ({ type }) => {
  const icons = {
    'T-SHIRTS': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7L17 4H7L4 7L2 11L5 12V20H19V12L22 11L20 7Z" />
      </svg>
    ),
    'DRESSES': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2H16L18 8L14 10V22H10V10L6 8L8 2Z" />
      </svg>
    ),
    'SNEAKERS': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18H22V20H2V18ZM4 16L6 8H10L12 12H20L22 16H4Z" />
      </svg>
    ),
    'JEANS': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2H18V6L15 12V22H9V12L6 6V2ZM12 6V12" />
      </svg>
    ),
    'WATCHES': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" /><path d="M12 9V12L14 14" /><path d="M9 2H15M9 22H15" />
      </svg>
    ),
    'BAGS': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6ZM3 6H21M16 10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10" />
      </svg>
    ),
    'SUNGLASSES': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="14" r="4" /><circle cx="18" cy="14" r="4" /><path d="M10 14H14M2 10L6 10M18 10L22 10" />
      </svg>
    ),
    'JACKETS': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

export default function Brands() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.brands__title',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.brands__title', start: 'top 80%' },
        }
      )

      gsap.fromTo(
        '.brands__logo',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05,
          scrollTrigger: { trigger: '.brands__logos', start: 'top 80%' },
        }
      )

      gsap.fromTo(
        '.brands__cat',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)', stagger: 0.06,
          scrollTrigger: { trigger: '.brands__categories', start: 'top 85%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="brands" id="brands">
      <div className="brands__inner">
        <div className="brands__left">
          <span className="section-label">Brands</span>
          <h2 className="brands__title giant-heading">
            24+
            <br />
            Brands.
          </h2>
          <p className="brands__sub">
            From streetwear to luxury. Every brand you love, delivered in
            minutes.
          </p>
        </div>

        <div className="brands__right">
          <div className="brands__logos">
            {brands.map((brand, i) => (
              <div key={i} className="brands__logo interactive">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="brands__categories">
        {categories.map((cat, i) => (
          <div key={i} className="brands__cat interactive">
            <span className="brands__cat-icon">
              <CategoryIcon type={cat} />
            </span>
            <span className="brands__cat-name">{cat}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

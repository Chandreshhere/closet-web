import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { BoltIcon } from './Icons'
import './Navbar.css'

// Sun icon
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

// Moon icon
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export default function Navbar({ theme, toggleTheme }) {
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: 0, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <nav ref={navRef} className="navbar">
      <div className="navbar__logo">
        <span className="navbar__logo-text">CLOSET</span>
        <span className="navbar__logo-x">X</span>
      </div>

      <div className="navbar__center">
        <button className="pill-btn" onClick={() => scrollTo('features')}>
          FEATURES
        </button>
        <button className="pill-btn" onClick={() => scrollTo('about')}>
          ABOUT
        </button>
        <button className="pill-btn" onClick={() => scrollTo('how-it-works')}>
          HOW IT WORKS
        </button>
        <button className="pill-btn" onClick={() => scrollTo('contact')}>
          CONTACT
        </button>
      </div>

      <div className="navbar__right">
        <button className="pill-btn navbar__get-app" onClick={() => scrollTo('contact')}>
          GET APP
        </button>
        <button
          className="navbar__theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`navbar__hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`navbar__hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`navbar__hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <button className="pill-btn" onClick={() => scrollTo('hero')}>
          HOME
        </button>
        <button className="pill-btn" onClick={() => scrollTo('features')}>
          FEATURES
        </button>
        <button className="pill-btn" onClick={() => scrollTo('about')}>
          ABOUT
        </button>
        <button className="pill-btn" onClick={() => scrollTo('how-it-works')}>
          HOW IT WORKS
        </button>
        <button className="pill-btn" onClick={() => scrollTo('brands')}>
          BRANDS
        </button>
        <button className="pill-btn" onClick={() => scrollTo('contact')}>
          CONTACT
        </button>
        <button className="pill-btn navbar__get-app" onClick={() => scrollTo('contact')}>
          GET APP
        </button>
      </div>
    </nav>
  )
}

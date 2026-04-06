import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Showcase from './components/Showcase'
import Brands from './components/Brands'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import JoinCTA from './components/JoinCTA'
import Footer from './components/Footer'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const appRef = useRef(null)
  const loaderRef = useRef(null)

  // ═══ Dark Mode State ═══
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('closetx-theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('closetx-theme', theme)
  }, [theme])

  useEffect(() => {
    // ═══ Lenis Smooth Scroll ═══
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // ═══ Preloader Animation ═══
    const tl = gsap.timeline()

    tl.to('.loader__text', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
    })
      .to('.loader__counter', {
        innerText: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        snap: { innerText: 1 },
        onUpdate: function () {
          const el = document.querySelector('.loader__counter')
          if (el) el.textContent = Math.round(this.targets()[0].innerText)
        },
      })
      .to(
        '.loader__bar',
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '<'
      )
      .to('.loader', {
        y: '-100%',
        duration: 0.8,
        ease: 'power3.inOut',
        delay: 0.3,
      })
      .set('.loader', { display: 'none' })

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <div ref={appRef} className="app">
      {/* ═══ Preloader ═══ */}
      <div ref={loaderRef} className="loader">
        <div className="loader__content">
          <div className="loader__logo">
            <div className="loader__text">CLOSET</div>
            <div className="loader__text loader__text--blue">X</div>
          </div>
          <div className="loader__progress">
            <div className="loader__bar" />
          </div>
          <div className="loader__counter">0</div>
        </div>
      </div>

      {/* ═══ Custom Cursor ═══ */}
      <CustomCursor />

      {/* ═══ Navigation ═══ */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* ═══ Hero ═══ */}
      <Hero />

      {/* ═══ Marquee 1 ═══ */}
      <Marquee
        texts={[
          'NIKE',
          'ADIDAS',
          'ZARA',
          'H&M',
          'PUMA',
          "LEVI'S",
          'GUCCI',
          'TOMMY HILFIGER',
          'CALVIN KLEIN',
          'CONVERSE',
          'VANS',
          'NEW BALANCE',
        ]}
        variant="dark"
        speed={25}
      />

      {/* ═══ About / Manifesto ═══ */}
      <About />

      {/* ═══ Marquee 2 ═══ */}
      <Marquee
        texts={[
          'CLOSETX IS NONTRADITIONAL',
          '30-60 MIN DELIVERY',
          'AR VIRTUAL TRY-ON',
          '24+ BRANDS',
          'FLASH DROPS',
          'FREE RETURNS',
        ]}
        variant="blue"
        speed={35}
      />

      {/* ═══ Features ═══ */}
      <Features />

      {/* ═══ How It Works ═══ */}
      <HowItWorks />

      {/* ═══ Showcase / Collections ═══ */}
      <Showcase />

      {/* ═══ Marquee 3 — Large ═══ */}
      <Marquee
        texts={[
          'NEWS',
          'DIARIES',
          'EVENTS',
          'THINKING',
        ]}
        variant="blue large"
        speed={20}
      />

      {/* ═══ Brands ═══ */}
      <Brands />

      {/* ═══ Gallery ═══ */}
      <Gallery />

      {/* ═══ Contact ═══ */}
      <Contact />

      {/* ═══ Join CTA ═══ */}
      <JoinCTA />

      {/* ═══ Footer ═══ */}
      <Footer />
    </div>
  )
}

export default App

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import CustomCursor from './components/CustomCursor'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Showcase from './components/Showcase'
import ScrollGrid from './components/ScrollGrid'
import Brands from './components/Brands'
import Gallery from './components/Gallery'
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
    // Buttery scroll: lerp-based Lenis (more responsive, less easing lag)
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      syncTouch: false,
    })

    // Bridge Lenis ↔ ScrollTrigger so all scroll-bound animations stay in sync
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Tell ScrollTrigger to use Lenis for proxying scroll position
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) lenis.scrollTo(value, { immediate: true })
        return window.scrollY
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
    })

    ScrollTrigger.defaults({ ignoreMobileResize: true })
    ScrollTrigger.refresh()

    // ═══ Preloader Animation ═══
    const suffixEl = document.querySelector('.loader__x-suffix')
    const setSuffix = (txt) => {
      if (!suffixEl) return
      suffixEl.textContent = txt
    }
    setSuffix('')
    const tl = gsap.timeline()

    tl.to('.loader__text', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
    })
    // Step through each suffix — show one at a time
    const WORDS = ['PRESS', 'CLUSIVE', 'TRA', 'PERIENCE']
    const HOLD = 0.55

    WORDS.forEach((w, i) => {
      tl.call(
        () => {
          setSuffix('')
          gsap.fromTo(
            suffixEl,
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.28,
              ease: 'power3.out',
              onStart: () => setSuffix(w),
            }
          )
        },
        null,
        i === 0 ? '+=0.3' : `+=${HOLD}`
      )
    })

    const totalLoaderDur = WORDS.length * HOLD + 0.3
    tl.to(
      '.loader__bar',
      {
        scaleX: 1,
        duration: totalLoaderDur,
        ease: 'none',
      },
      `-=${totalLoaderDur}`
    )
      .to('.loader', {
        y: '-100%',
        duration: 0.9,
        ease: 'power4.inOut',
        delay: 0.25,
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
            <div className="loader__x-group">
              <span className="loader__text loader__text--blue">X</span>
              <span className="loader__x-suffix" />
            </div>
          </div>
          <div className="loader__progress">
            <div className="loader__bar" />
          </div>
        </div>
      </div>

      {/* ═══ Custom Cursor ═══ */}
      <CustomCursor />

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

      {/* ═══ Scroll-Expand Grid (codegrid-inspired) ═══ */}
      <ScrollGrid />

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

      {/* ═══ Footer ═══ */}
      <Footer />
    </div>
  )
}

export default App

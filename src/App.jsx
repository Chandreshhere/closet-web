import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import CustomCursor from './components/CustomCursor'
import ClothCanvas from './components/ClothCanvas'
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
  const [pageReady, setPageReady] = useState(false)

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
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      syncTouch: false,
    })
    window.__lenis = lenis

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
    const wordEl = document.querySelector('.loader__cycle-word')
    const counterEl = document.querySelector('.loader__foot-current')
    const setWord = (txt) => {
      if (wordEl) wordEl.textContent = txt
    }
    setWord('X')

    const WORDS = ['XPRESS', 'XCLUSIVE', 'XTRA', 'XPERIENCE', 'X']
    const HOLD = 0.45  // Slightly faster word transitions
    const totalLoaderDur = WORDS.length * HOLD + 0.3
    // Make sure nothing is left invisible by a prior dev-mode mount
    gsap.set(
      '.loader__ascii, .loader__cycle, .loader__meta--top .loader__meta-cell, .loader__foot > *',
      { opacity: 1, y: 0, clearProps: 'transform' }
    )

    const tl = gsap.timeline()

    // Cycle whole word — X → XPRESS → XCLUSIVE → XTRA → XPERIENCE → X
    WORDS.forEach((w, i) => {
      tl.call(
        () => {
          gsap.fromTo(
            wordEl,
            { yPercent: 60, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.28,
              ease: 'power3.out',
              onStart: () => setWord(w),
            }
          )
        },
        null,
        i === 0 ? '+=0.2' : `+=${HOLD}`
      )
    })

    // Bar fill + counter — shared duration
    tl.to(
      '.loader__bar',
      { scaleX: 1, duration: totalLoaderDur, ease: 'none' },
      `-=${totalLoaderDur}`
    )
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: totalLoaderDur,
        ease: 'none',
        onUpdate: function () {
          if (counterEl) {
            counterEl.textContent = String(Math.round(this.targets()[0].val)).padStart(3, '0')
          }
        },
      },
      `-=${totalLoaderDur}`
    )

    // Loader exit — CSS compositor slide (no JS work during the animation).
    // We pause the GSAP ticker AND tell the cloth canvas to stop rendering
    // so NOTHING competes with the compositor during the 800ms slide-up.
    tl.call(() => {
      const loaderEl = document.querySelector('.loader')
      if (!loaderEl) return

      gsap.killTweensOf('.loader__cycle-word')
      gsap.killTweensOf('.loader__bar')

      // Signal cloth canvas to skip render calls (physics keeps running)
      document.dispatchEvent(new Event('closetx:loader-exiting'))

      // Pause GSAP ticker → Lenis + ScrollTrigger go idle during the slide
      gsap.ticker.sleep()

      loaderEl.classList.add('is-leaving')

      setTimeout(() => {
        loaderEl.style.display = 'none'
        gsap.ticker.wake()
        // Dispatch event BEFORE ScrollTrigger refresh to allow cloth to start rendering
        document.dispatchEvent(new Event('closetx:loader-done'))
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
          setPageReady(true)
        })
      }, 750)  // Slightly faster exit
    }, null, '+=0.15')  // Start exit sooner

    return () => {
      window.__lenis = null
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <div ref={appRef} className="app">
      {/* ═══ Preloader ═══ */}
      <div ref={loaderRef} className="loader">
        {/* Top meta bar */}
        <div className="loader__meta loader__meta--top">
          <span className="loader__meta-cell">CLOSETX / 2025</span>
          <span className="loader__meta-cell">FASHION · DELIVERED</span>
          <span className="loader__meta-cell loader__meta-cell--right">
            INDEX 01 — INITIATING
          </span>
        </div>

        {/* Center stack */}
        <div className="loader__center">
          <pre className="loader__ascii" aria-hidden="true">
{`██████ ██     ████  ██████ ██████ ██████ ██   ██
██     ██    ██  ██ ██     ██       ██     ██ ██
██     ██    ██  ██ ██████ ██████   ██      ███
██     ██    ██  ██     ██ ██       ██     ██ ██
██████ █████  ████  ██████ ██████   ██    ██   ██`}
          </pre>

          <div className="loader__cycle">
            <span className="loader__cycle-bracket">[</span>
            <span className="loader__cycle-word">X</span>
            <span className="loader__cycle-cursor" />
            <span className="loader__cycle-bracket">]</span>
          </div>
        </div>

        {/* Bottom progress + meta */}
        <div className="loader__foot">
          <div className="loader__foot-row">
            <span className="loader__foot-label">LOADING ASSETS</span>
            <span className="loader__foot-counter">
              <span className="loader__foot-current">000</span>
              <span className="loader__foot-sep">/</span>
              <span>100</span>
            </span>
          </div>
          <div className="loader__progress">
            <div className="loader__bar" />
          </div>
          <div className="loader__foot-row loader__foot-row--mute">
            <span>INDORE · WORLDWIDE</span>
            <span>v0.1.0</span>
          </div>
        </div>
      </div>

      {/* ═══ 3D Canvas — raw, fixed, hero-only ═══ */}
      <ClothCanvas />

      {/* ═══ Custom Cursor ═══ */}
      <CustomCursor />

      {/* ═══ Hero ═══ */}
      <Hero />

      {/* ═══ Marquee 1 ═══ */}
      <Marquee
        id="marquee-white"
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
        id="marquee-blue"
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

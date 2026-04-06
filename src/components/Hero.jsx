import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BoltIcon } from './Icons'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const taglineRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      const tl = gsap.timeline({ delay: 0.8 })

      tl.fromTo(
        headingRef.current.children,
        { y: 120, opacity: 0, rotateX: 40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.12,
        }
      )
        .fromTo(
          taglineRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          rightRef.current,
          { x: 100, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
          '-=1'
        )

      // Pin right side on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: rightRef.current,
        pinSpacing: false,
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="hero" id="hero">
      <div className="hero__inner">
        <div ref={leftRef} className="hero__left">
          <div className="hero__label section-label">ClosetX 2025</div>

          <div ref={headingRef} className="hero__heading">
            <div className="hero__heading-line overflow-hidden">
              <span>Fashion,</span>
            </div>
            <div className="hero__heading-line overflow-hidden">
              <span>Delivered</span>
            </div>
            <div className="hero__heading-line overflow-hidden">
              <span>in Minutes.</span>
            </div>
          </div>

          <p ref={taglineRef} className="hero__tagline">
            Get clothes, shoes & accessories delivered to your door in under 60
            minutes. No waiting days. No planning ahead.
          </p>

          <p ref={subRef} className="hero__sub">
            Browse. Pick. Delivered — in 30 to 60 minutes. Open the app and get
            what you want, when you want it.
          </p>

          <div ref={ctaRef} className="hero__cta">
            <button
              className="pill-btn hero__cta-btn"
              onClick={() =>
                document
                  .getElementById('download')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <BoltIcon size={14} color="#fff" />
              GET THE APP
            </button>
            <button
              className="pill-btn"
              onClick={() =>
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              HOW IT WORKS
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
              </svg>
            </button>
          </div>

          <div className="hero__ticker">
            <span className="bracket-text">
              30-60 min delivery across metro cities
            </span>
          </div>
        </div>

        <div ref={rightRef} className="hero__right">
          <div className="hero__image-stack">
            {/* Chrome 3D phone mockup */}
            <div className="hero__phone-frame">
              {/* Mobile: full screenshot */}
              <img
                src="/IMG_1910.PNG"
                alt="ClosetX App"
                className="hero__phone-screenshot"
              />
              <div className="hero__phone-shine"></div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hero__bottom-bar">
        <span className="bracket-text">
          I want it now —— I got it now
        </span>
        <span className="hero__bottom-toggle">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3" fill="currentColor" />
          </svg>
          CLOSETX MODE
        </span>
      </div>
    </section>
  )
}

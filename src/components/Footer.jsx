import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { InstagramIcon, TwitterIcon, TiktokIcon } from './Icons'
import ContactForm from './ContactForm'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef(null)
  const videoRef = useRef(null)
  const contentRef = useRef(null)
  const headlineRef = useRef(null)
  const [formOpen, setFormOpen] = useState(false)
  const openForm = useCallback(() => setFormOpen(true), [])
  const closeForm = useCallback(() => setFormOpen(false), [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const setup = () => {
      const duration = video.duration
      if (!duration || isNaN(duration)) return

      // ── 120fps smooth video scrubbing ──
      const FRAME = 1 / 120
      let targetTime = 0
      let lastWrite = -1
      let footerVisible = false
      let rafId = null

      // Hint the decoder to keep frames hot
      try { video.playbackRate = 0 } catch (_) {}

      const tick = () => {
        if (
          footerVisible &&
          video.readyState >= 2 &&
          Math.abs(targetTime - lastWrite) >= FRAME
        ) {
          const snapped = Math.round(targetTime / FRAME) * FRAME
          if (typeof video.fastSeek === 'function') {
            video.fastSeek(snapped)
          } else {
            video.currentTime = snapped
          }
          lastWrite = snapped
        }
        rafId = requestAnimationFrame(tick)
      }

      // Only run the rAF loop while footer is visible
      const visObs = new IntersectionObserver(
        ([entry]) => {
          footerVisible = entry.isIntersecting
          if (footerVisible && !rafId) tick()
        },
        { threshold: 0.01 }
      )
      visObs.observe(footerRef.current)
      tick() // start immediately; visObs will gate actual seeks

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate: (self) => {
            targetTime = duration * self.progress
          },
        })

        // Headline reveal
        gsap.fromTo(
          headlineRef.current.querySelectorAll('.footer__headline-line'),
          { y: 120, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
            },
          }
        )

        // Content fade in
        gsap.fromTo(
          contentRef.current.querySelectorAll('.footer__col'),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 90%',
            },
          }
        )
      }, footerRef)

      return () => {
        ctx.revert()
        visObs.disconnect()
        if (rafId) cancelAnimationFrame(rafId)
      }
    }

    let cleanup

    // Wait until video is fully buffered for smooth scrubbing
    const onCanPlayThrough = () => {
      if (!cleanup) cleanup = setup()
    }

    if (video.readyState >= 4) {
      cleanup = setup()
    } else {
      video.addEventListener('canplaythrough', onCanPlayThrough)
      // Also start as soon as we have enough data
      video.addEventListener('loadeddata', onCanPlayThrough)
    }

    // Force aggressive preload
    video.load()

    return () => {
      video.removeEventListener('canplaythrough', onCanPlayThrough)
      video.removeEventListener('loadeddata', onCanPlayThrough)
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <>
    <footer ref={footerRef} className="footer" id="contact">
      {/* Scroll-scrubbed background video */}
      <div className="footer__video-wrap">
        <video
          ref={videoRef}
          className="footer__video"
          src="/Cinematic_Fashion_Shoot_200fps.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        />
        <div className="footer__video-overlay" />
      </div>

      {/* Top: Editorial headline */}
      <div ref={headlineRef} className="footer__headline">
        <div className="overflow-hidden">
          <div className="footer__headline-line">Let's talk:</div>
        </div>
        <div className="overflow-hidden">
          <div className="footer__headline-line">press, brands</div>
        </div>
        <div className="overflow-hidden">
          <div className="footer__headline-line footer__headline-line--italic">& partnerships</div>
        </div>
      </div>

      {/* Bottom content grid */}
      <div ref={contentRef} className="footer__content">
        <div className="footer__col">
          <span className="footer__col-label">(SOCIAL)</span>
          <div className="footer__social">
            <a href="#" className="footer__social-link">
              <InstagramIcon size={14} />
              INSTAGRAM
            </a>
            <a href="#" className="footer__social-link">
              <TwitterIcon size={14} />
              TWITTER
            </a>
            <a href="#" className="footer__social-link">
              <TiktokIcon size={14} />
              TIKTOK
            </a>
          </div>
        </div>

        <div className="footer__col">
          <span className="footer__col-label">(NAV)</span>
          <div className="footer__nav-cols">
            <div className="footer__nav-col">
              <a href="#hero">HOME</a>
              <a href="#features">FEATURES</a>
              <a href="#about">ABOUT</a>
            </div>
            <div className="footer__nav-col">
              <a href="#how-it-works">HOW IT WORKS</a>
              <a href="#contact">CONTACT</a>
              <a href="#brands">BRANDS</a>
            </div>
          </div>
        </div>

        <div className="footer__col footer__col--right">
          <div className="footer__contact-block">
            <span className="footer__email">Akshat Jain</span>
          </div>

          <div className="footer__contact-block">
            <span className="footer__contact-label">PHONE:</span>
            <a href="tel:+919926446622" className="footer__email">
              +91 99264 46622
            </a>
          </div>

          <button className="footer__form-btn" onClick={openForm}>
            GET IN TOUCH
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" />
            </svg>
          </button>

          <span className="footer__city">INDORE · WORLDWIDE</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom-bar">
        <span>© {new Date().getFullYear()} CLOSETX</span>
        <span className="footer__bottom-mid">FASHION DELIVERY · 60 MIN</span>
        <span>ALL RIGHTS RESERVED</span>
      </div>
    </footer>

    <ContactForm isOpen={formOpen} onClose={closeForm} />
    </>
  )
}

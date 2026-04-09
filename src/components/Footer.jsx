import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { InstagramIcon, TwitterIcon, TiktokIcon } from './Icons'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef(null)
  const videoRef = useRef(null)
  const contentRef = useRef(null)
  const headlineRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const setup = () => {
      const duration = video.duration
      if (!duration || isNaN(duration)) return

      // ── 200fps smooth video scrubbing ──
      // Lenis already smooths scrollY, so we read it each rAF and write
      // currentTime directly — no double-lerp lag. Snap to a 200fps grid
      // and skip redundant seeks within < 1 frame.
      const FRAME = 1 / 200
      let targetTime = 0
      let lastWrite = -1

      // Hint the decoder to keep frames hot
      try { video.playbackRate = 0 } catch (_) {}

      const tick = () => {
        if (
          video.readyState >= 2 &&
          Math.abs(targetTime - lastWrite) >= FRAME
        ) {
          const snapped = Math.round(targetTime / FRAME) * FRAME
          // requestVideoFrameCallback path is smoother where supported
          if (typeof video.fastSeek === 'function') {
            video.fastSeek(snapped)
          } else {
            video.currentTime = snapped
          }
          lastWrite = snapped
        }
        requestAnimationFrame(tick)
      }
      tick()

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

      return () => ctx.revert()
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
    <footer ref={footerRef} className="footer">
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
          <span className="footer__col-label">(CONTACT)</span>

          <div className="footer__contact-block">
            <span className="footer__contact-label">FOR PRESS &amp; PARTNERSHIPS:</span>
            <a href="mailto:hello@closetx.in" className="footer__email">
              hello@closetx.in
            </a>
          </div>

          <div className="footer__contact-block">
            <span className="footer__contact-label">FOR ORDER SUPPORT (PLEASE INCLUDE ORDER #):</span>
            <a href="mailto:support@closetx.in" className="footer__email">
              support@closetx.in
            </a>
          </div>

          <a href="#contact-form" className="footer__form-btn">
            OR USE FORM HERE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" />
            </svg>
          </a>

          <span className="footer__city">INDORE · WORLDWIDE</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom-bar">
        <span>© {new Date().getFullYear()} CLOSETX</span>
        <span className="footer__bottom-mid">FASHION DELIVERY · 30—60 MIN</span>
        <span>ALL RIGHTS RESERVED</span>
      </div>
    </footer>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { InstagramIcon, TwitterIcon, TiktokIcon } from './Icons'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer__inner">
        <div ref={logoRef} className="footer__logo">
          <span className="footer__logo-text">CLOSET</span>
          <span className="footer__logo-x">X</span>
        </div>

        <div className="footer__social">
          <a href="#" className="pill-btn footer__social-btn">
            <InstagramIcon size={15} />
            INSTAGRAM
          </a>
          <a href="#" className="pill-btn footer__social-btn">
            <TwitterIcon size={15} />
            TWITTER
          </a>
          <a href="#" className="pill-btn footer__social-btn">
            <TiktokIcon size={15} />
            TIKTOK
          </a>
        </div>


        <div className="footer__nav">
          <div className="footer__nav-label">(NAV)</div>
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
      </div>
    </footer>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BoltIcon } from './Icons'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const bodyRef = useRef(null)
  const iconsRef = useRef(null)
  const studioRef = useRef(null)
  const badgeRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      gsap.fromTo(
        iconsRef.current.children,
        { scale: 0, rotation: -90 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: iconsRef.current,
            start: 'top 80%',
          },
        }
      )

      gsap.fromTo(
        bodyRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 80%',
          },
        }
      )

      gsap.fromTo(
        studioRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: studioRef.current,
            start: 'top 85%',
          },
        }
      )

      gsap.fromTo(
        badgeRef.current,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: badgeRef.current,
            start: 'top 90%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="about" id="about">
      <div className="about__content">
        <h2 ref={headingRef} className="about__heading">
          CLOSETX IS A REVOLUTION IN
          <br />
          FASHION, SPEED & STYLE.
        </h2>

        {/* Chrome icons instead of emojis */}
        <div ref={iconsRef} className="about__icons">
          <div className="about__icon-item">
            <BoltIcon size={28} color="#fff" />
          </div>
          <div className="about__icon-item about__icon-item--lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="about__icon-item">
            <BoltIcon size={28} color="#fff" />
          </div>
        </div>

        <div ref={bodyRef} className="about__body">
          <p>
            EVERY ORDER IS AN EXPERIENCE. BROWSE THROUGH 24+ PREMIUM BRANDS,
            TRY ON WITH AR, AND GET IT DELIVERED IN UNDER 60 MINUTES. FROM NIKE
            TO ZARA, FROM SNEAKERS TO BLAZERS — YOUR ENTIRE WARDROBE, ON DEMAND.
          </p>
          <p>
            (YOU MAY OR MAY NOT ALREADY BE ADDICTED TO THIS.)
          </p>
        </div>

        <div ref={studioRef} className="about__studio">
          <strong>
            CLOSETX [EST. 2025] IS THE FUTURE OF FASHION DELIVERY
          </strong>
          <br />
          — PART WARDROBE, PART MAGIC. AVAILABLE ACROSS INDIA'S METRO CITIES.
        </div>

        <div ref={badgeRef} className="about__badge-text">
          <span className="bracket-text">CLOSETX IS NONTRADITIONAL</span>
        </div>
      </div>
    </section>
  )
}

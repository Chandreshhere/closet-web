import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './JoinCTA.css'

gsap.registerPlugin(ScrollTrigger)

export default function JoinCTA() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current.children,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      )

      gsap.fromTo(
        imageRef.current,
        { scale: 0.7, opacity: 0, rotation: -8 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="join-cta" id="download">
      <div className="join-cta__inner">
        <div ref={headingRef} className="join-cta__heading">
          <div className="overflow-hidden">
            <span>JOIN</span>
          </div>
          <div className="overflow-hidden">
            <span>CLOSETX</span>
          </div>
          <div className="overflow-hidden">
            <span>WORLD</span>
          </div>
        </div>

        <div ref={imageRef} className="join-cta__image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop"
            alt="Shopping experience"
          />
        </div>

        <p className="join-cta__desc">
          THE CLOSETX COMMUNITY IS A SPACE TO EXPLORE NEW
          <br />
          DROPS, <em>EXCLUSIVE</em> DEALS, <strong>FLASH SALES</strong>,
          <br />
          & MORE.
        </p>
      </div>

      {/* Newsletter */}
      <div className="join-cta__newsletter interactive">
        <h3 className="join-cta__newsletter-title">Newsletter</h3>
        <div className="join-cta__newsletter-arrow">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" />
          </svg>
        </div>
      </div>

      {/* Bottom credits */}
      <div className="join-cta__credits">
        <span>CLOSETX . 2025</span>
        <span>MADE IN INDIA</span>
      </div>
    </section>
  )
}

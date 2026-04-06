import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Showcase.css'

gsap.registerPlugin(ScrollTrigger)

export default function Showcase() {
  const sectionRef = useRef(null)
  const leftTextRef = useRef(null)
  const rightTextRef = useRef(null)
  const imageRef = useRef(null)
  const vinylRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftTextRef.current.children,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      )

      gsap.fromTo(
        rightTextRef.current.children,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      )

      gsap.to(vinylRef.current, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, rotation: -5 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="showcase" id="showcase">
      <div className="showcase__label">
        <span className="bracket-text">Collections</span>
      </div>

      <div className="showcase__inner">
        <div ref={leftTextRef} className="showcase__left">
          <h2 className="showcase__heading">
            The
            <br />
            Collections:
          </h2>
          <span className="bracket-text">Curated Drops</span>
          <div className="showcase__left-meta">
            <span>VOL 1: PARTY TONIGHT</span>
            <span>VOL 2: INTERVIEW READY</span>
            <span>VOL 3: FESTIVAL MODE</span>
          </div>
        </div>

        <div className="showcase__center">
          <div ref={vinylRef} className="showcase__vinyl">
            <div className="showcase__vinyl-inner">
              <div ref={imageRef} className="showcase__vinyl-img">
                <img
                  src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=300&fit=crop"
                  alt="Fashion collection"
                />
              </div>
            </div>
          </div>
        </div>

        <div ref={rightTextRef} className="showcase__right">
          <p className="showcase__quote">
            My favorite part is
            <br />
            building the perfect
            <br />
            outfit & completely
            <br />
            living in it.
          </p>
          <p className="showcase__quote-sub">
            — I make a collection
            <br />
            for every mood.
          </p>
        </div>
      </div>

      <div className="showcase__cta">
        <button className="pill-btn">EXPLORE COLLECTIONS</button>
      </div>
    </section>
  )
}

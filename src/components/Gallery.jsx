import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Gallery.css'

gsap.registerPlugin(ScrollTrigger)

const images = [
  {
    src: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=750&fit=crop',
    alt: 'Studio fashion shoot',
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop',
    alt: 'Model in streetwear',
  },
  {
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=750&fit=crop',
    alt: 'Fashion editorial',
  },
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=750&fit=crop',
    alt: 'Style lookbook',
  },
  {
    src: 'https://images.unsplash.com/photo-1544957992-20514f595d6f?w=600&h=750&fit=crop',
    alt: 'Sneakers collection',
  },
  {
    src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=750&fit=crop',
    alt: 'Shopping lifestyle',
  },
]

export default function Gallery() {
  const sectionRef = useRef(null)
  const marqueeRef = useRef(null)
  const stackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Marquee scroll-driven movement
      gsap.to(marqueeRef.current, {
        x: '-50%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleClick = () => {
    const next = (activeIndex + 1) % images.length
    setActiveIndex(next)
  }

  return (
    <section ref={sectionRef} className="gallery" id="gallery">
      {/* Background marquee text */}
      <div className="gallery__marquee-wrap">
        <div ref={marqueeRef} className="gallery__marquee">
          <span>CLOSETX</span>
          <span>STYLE</span>
          <span>CLOSETX</span>
          <span>STYLE</span>
          <span>CLOSETX</span>
          <span>STYLE</span>
        </div>
      </div>

      {/* Stacked images */}
      <div
        ref={stackRef}
        className="gallery__stack"
        onClick={handleClick}
      >
        {/* Background cards — static, don't change */}
        <div className="gallery__card gallery__card--bg" style={{ zIndex: 1, transform: 'rotate(-6deg)' }}>
          <img src={images[1].src} alt="" />
        </div>
        <div className="gallery__card gallery__card--bg" style={{ zIndex: 2, transform: 'rotate(4deg)' }}>
          <img src={images[2].src} alt="" />
        </div>
        <div className="gallery__card gallery__card--bg" style={{ zIndex: 3, transform: 'rotate(-2deg)' }}>
          <img src={images[3].src} alt="" />
        </div>

        {/* Top card — changes on click, no animation */}
        <div className="gallery__card gallery__card--top" style={{ zIndex: 10 }}>
          <img src={images[activeIndex].src} alt={images[activeIndex].alt} />
        </div>
      </div>

      {/* Bottom label */}
      <div className="gallery__footer">
        <span className="bracket-text">Click for Photos</span>
      </div>
    </section>
  )
}

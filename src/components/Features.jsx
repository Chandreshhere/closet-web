import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CameraIcon, SearchIcon, SwipeIcon, SparkleIcon, BoltIcon, FlameIcon } from './Icons'
import './Features.css'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    title: 'Virtual Try-On',
    desc: 'AR camera shows you how clothes look on your body before you buy. No more guessing.',
    Icon: CameraIcon,
    tag: 'AR POWERED',
  },
  {
    title: 'Image Search',
    desc: 'Snap a photo of any outfit you see anywhere — find matching clothes instantly.',
    Icon: SearchIcon,
    tag: 'AI MATCHING',
  },
  {
    title: 'Swipe Discovery',
    desc: 'Swipe right to save, left to skip. Find your style fast, like dating but for fashion.',
    Icon: SwipeIcon,
    tag: 'TINDER FOR STYLE',
  },
  {
    title: 'Complete the Look',
    desc: 'Buy a shirt, get matching pants, shoes & watch suggested. Head-to-toe in one tap.',
    Icon: SparkleIcon,
    tag: 'SMART STYLING',
  },
  {
    title: '30-Min Delivery',
    desc: 'From tap to doorstep in under 60 minutes. Express delivery on every single order.',
    Icon: BoltIcon,
    tag: 'LIGHTNING FAST',
  },
  {
    title: 'Flash Drops',
    desc: 'Limited time, steep discounts. Exclusive pieces available for a short window only.',
    Icon: FlameIcon,
    tag: 'LIMITED EDITION',
  },
]

export default function Features() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 75%',
          },
        }
      )

      const cards = cardsRef.current.querySelectorAll('.feature-card')
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="features" id="features">
      <div ref={headerRef} className="features__header">
        <div className="section-label">Features</div>
        <h2 className="features__title giant-heading">
          Shop
          <br />
          Smart.
        </h2>
        <p className="features__subtitle">
          Every feature designed to make fashion instant, personal & effortless.
        </p>
      </div>

      <div ref={cardsRef} className="features__grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card interactive">
            <div className="feature-card__tag">{f.tag}</div>
            <div className="feature-card__icon">
              <f.Icon size={36} />
            </div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
            <div className="feature-card__number">
              {String(i + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

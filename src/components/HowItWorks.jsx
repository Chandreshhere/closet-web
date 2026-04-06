import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PhoneIcon, MirrorIcon, CartIcon, DeliveryIcon, ReturnIcon } from './Icons'
import './HowItWorks.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Open & Pick Your Vibe',
    desc: "Browse by category, occasion, brand — or just scroll through reels and swipe through looks. Men's or Women's — curated for you.",
    Icon: PhoneIcon,
  },
  {
    num: '02',
    title: 'Try It On — Virtually',
    desc: 'Use the AR Virtual Try-On to see how it looks on you, right from your phone camera. No fitting rooms needed.',
    Icon: MirrorIcon,
  },
  {
    num: '03',
    title: 'Order in Seconds',
    desc: 'Pick your size, color, checkout. All your favorite payment options. One-tap reorder for regulars.',
    Icon: CartIcon,
  },
  {
    num: '04',
    title: 'Delivered. 30-60 Min.',
    desc: "Your order arrives at your door before you've finished deciding what to watch on Netflix.",
    Icon: DeliveryIcon,
  },
  {
    num: '05',
    title: "Not Right? We've Got You.",
    desc: 'Free returns within 15 days. Free size exchange. Refund in 5-7 days. Zero stress.',
    Icon: ReturnIcon,
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const stepsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = stepsRef.current.querySelectorAll('.hiw__step')

      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { x: i % 2 === 0 ? -80 : 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
            },
          }
        )
      })

      items.forEach((item) => {
        const icon = item.querySelector('.hiw__step-visual')
        gsap.fromTo(
          icon,
          { scale: 0.5, opacity: 0, rotation: -20 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="hiw" id="how-it-works">
      <div className="hiw__header">
        <span className="section-label">How It Works</span>
        <h2 className="giant-heading">
          5 Steps.
          <br />
          That's It.
        </h2>
      </div>

      <div ref={stepsRef} className="hiw__steps">
        {steps.map((step, i) => (
          <div key={i} className="hiw__step interactive">
            <div className="hiw__step-num">{step.num}</div>
            <div className="hiw__step-content">
              <h3 className="hiw__step-title">{step.title}</h3>
              <p className="hiw__step-desc">{step.desc}</p>
            </div>
            <div className="hiw__step-visual">
              <step.Icon size={40} />
            </div>
            <div className="hiw__step-line" />
          </div>
        ))}
      </div>
    </section>
  )
}

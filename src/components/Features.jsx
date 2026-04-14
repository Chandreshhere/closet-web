import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Features.css'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    img: '/1.jpg',
    tag: 'AR POWERED',
    title: 'Virtual Try-On',
    desc: 'AR camera shows how clothes look on you before you buy. No more guessing.',
    num: '01',
    location: 'India',
    role: 'Live Camera, AR Engine',
  },
  {
    img: '/2.jpg',
    tag: 'AI MATCHING',
    title: 'Image Search',
    desc: 'Snap a photo of any outfit you see — find matching clothes instantly.',
    num: '02',
    location: 'Worldwide',
    role: 'Vision AI, Catalog',
  },
  {
    img: '/3.jpg',
    tag: 'TINDER FOR STYLE',
    title: 'Swipe Discovery',
    desc: 'Swipe right to save, left to skip. Find your style fast — like dating but for fashion.',
    num: '03',
    location: 'Indore',
    role: 'Personalization',
  },
  {
    img: '/4.jpg',
    tag: 'LIGHTNING FAST',
    title: '30-Min Delivery',
    desc: 'From tap to doorstep in under 60 minutes. Express delivery on every order.',
    num: '04',
    location: 'Metro Cities',
    role: 'Logistics, Hyperlocal',
  },
]

export default function Features() {
  const wrapperRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const headerSection = headerRef.current
    const cards = cardsRef.current
    if (!wrapper || !headerSection || !cards) return

    const triggers = []

    // Pin the editorial heading background — stays fixed while cards scroll over
    const headerPin = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      pin: headerSection,
      pinSpacing: false,
      anticipatePin: 1,
    })
    triggers.push(headerPin)

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [])

  return (
    <section ref={wrapperRef} className="features" id="features">
      {/* ─── Pinned editorial background ─── */}
      <div ref={headerRef} className="features__bg">
        {/* Top headline */}
        <h2 className="features__top">
          Shop made
          <br />
          visible
        </h2>

        {/* Side captions like the reference */}
        <div className="features__captions">
          <div className="features__caption">
            <p className="features__caption-bold">Smart fashion. Instant intent.</p>
          </div>
          <div className="features__caption">
            <p>An open view into</p>
            <p>a smarter way to shop.</p>
            <p className="features__caption-mute">
              Speed, style, and personalisation —
              <br />
              expressed through one app.
            </p>
          </div>
        </div>

        {/* Left bottom small captions */}
        <div className="features__bottom-notes">
          <p>
            <strong>Tap</strong> what you crave.
          </p>
          <p>
            <strong>See</strong> it on you instantly.
          </p>
          <p>
            <strong>Wear</strong> it in <strong>minutes</strong>.
          </p>
        </div>

        {/* Bottom giant headline */}
        <h2 className="features__bottom">
          Fashion shaped
          <br />
          by you
        </h2>
      </div>

      {/* ─── Floating cards over the pinned background ─── */}
      <div ref={cardsRef} className="features__cards">
        {features.map((f, i) => (
          <div key={i} className={`feature-card feature-card--${i + 1}`}>
            <div className="feature-card__img-wrap">
              <img src={f.img} alt={f.title} className="feature-card__img" loading="lazy" decoding="async" />
              {/* Rotating circular badge */}
              <div className="feature-card__badge">
                <svg viewBox="0 0 200 200">
                  <defs>
                    <path
                      id={`circle-${i}`}
                      d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                    />
                  </defs>
                  <text>
                    <textPath href={`#circle-${i}`}>
                      CLOSETX • {f.tag} • CLOSETX • {f.tag} •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
            <div className="feature-card__info">
              <p className="feature-card__title">{f.title}</p>
              <div className="feature-card__meta">
                <span>{f.location}</span>
                <span className="feature-card__role">{f.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

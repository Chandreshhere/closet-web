import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './ContactForm.css'

export default function ContactForm({ isOpen, onClose }) {
  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const fieldsRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  // Open / close animation
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      gsap.set(overlayRef.current, { display: 'flex' })
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(panelRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.6, ease: 'power4.out' }
      )
      gsap.fromTo(
        fieldsRef.current?.querySelectorAll('.cf__field, .cf__heading, .cf__subhead, .cf__submit-row'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.25 }
      )
    } else {
      gsap.to(panelRef.current, { y: '100%', duration: 0.45, ease: 'power3.in' })
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.45, ease: 'power2.in',
        onComplete: () => {
          if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' })
          document.body.style.overflow = ''
          setSubmitted(false)
          setError('')
          setForm({ name: '', email: '', subject: '', message: '' })
        }
      })
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleChange = (e) => {
    setError('')
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      className="cf__overlay"
      style={{ display: 'none' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div ref={panelRef} className="cf__panel">

        {/* Close */}
        <button className="cf__close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div ref={fieldsRef} className="cf__inner">
          {!submitted ? (
            <>
              <div className="cf__heading">GET IN<br /><span className="cf__heading--blue">TOUCH.</span></div>
              <p className="cf__subhead">Drop us a message — we'll get back to you within 24h.</p>

              <form className="cf__form" onSubmit={handleSubmit} noValidate>
                <div className="cf__row">
                  <div className="cf__field">
                    <label className="cf__label">YOUR NAME</label>
                    <input
                      className="cf__input"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Akshat Jain"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="cf__field">
                    <label className="cf__label">EMAIL</label>
                    <input
                      className="cf__input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="cf__field">
                  <label className="cf__label">SUBJECT</label>
                  <input
                    className="cf__input"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Press / Partnership / Order Support"
                  />
                </div>

                <div className="cf__field">
                  <label className="cf__label">MESSAGE</label>
                  <textarea
                    className="cf__input cf__textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    required
                    rows={5}
                  />
                </div>

                {error && <p className="cf__error">{error}</p>}

                <div className="cf__submit-row">
                  <button type="submit" className="cf__submit" disabled={loading}>
                    {loading ? (
                      <>SENDING<span className="cf__dots" /></>
                    ) : (
                      <>
                        SEND MESSAGE
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                  <span className="cf__or">OR CALL&nbsp;
                    <a href="tel:+919926446622" className="cf__inline-link">+91 99264 46622</a>
                  </span>
                </div>
              </form>
            </>
          ) : (
            <div className="cf__success">
              <div className="cf__success-icon">✓</div>
              <div className="cf__heading">MESSAGE<br /><span className="cf__heading--blue">SENT.</span></div>
              <p className="cf__subhead">We'll be in touch within 24 hours.<br />— ClosetX Team</p>
              <button className="cf__submit" onClick={onClose} style={{ marginTop: '40px' }}>
                CLOSE
              </button>
            </div>
          )}
        </div>

        {/* Decorative index tag */}
        <span className="cf__tag">FORM / 01</span>
      </div>
    </div>
  )
}

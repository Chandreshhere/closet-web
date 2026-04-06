import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FolderIcon } from './Icons'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const [noteOpen, setNoteOpen] = useState(false)
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)
  const noteRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current.children,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 75%',
          },
        }
      )

      gsap.fromTo(
        contentRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
          },
        }
      )

      gsap.fromTo(
        imageRef.current,
        { x: 80, opacity: 0, rotation: 3 },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      )

      // Note starts hidden — will animate out from folder
      gsap.set(noteRef.current, { scale: 0, rotation: -10, opacity: 0, y: 40 })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const openNote = () => {
    if (noteOpen) return
    gsap.to(noteRef.current, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
    setNoteOpen(true)
  }

  const closeNote = (e) => {
    e.stopPropagation()
    gsap.to(noteRef.current, {
      scale: 0,
      rotation: -10,
      opacity: 0,
      y: 40,
      duration: 0.4,
      ease: 'power2.in',
    })
    setNoteOpen(false)
  }

  return (
    <section ref={sectionRef} className="contact" id="contact">
      <div className="contact__inner">
        <div className="contact__left">
          <div ref={headingRef} className="contact__heading">
            <div className="overflow-hidden">
              <span className="contact__heading-line">Let's talk:</span>
            </div>
            <div className="overflow-hidden">
              <span className="contact__heading-line">press, brands</span>
            </div>
            <div className="overflow-hidden">
              <span className="contact__heading-line">& partnerships</span>
            </div>
          </div>

          <div ref={contentRef} className="contact__info">
            <div className="contact__label section-label">Contact</div>

            <div className="contact__block">
              <span className="contact__block-label">
                FOR PRESS & PARTNERSHIPS:
              </span>
              <a href="mailto:hello@closetx.in" className="contact__email">
                hello@closetx.in
              </a>
            </div>

            <div className="contact__block">
              <span className="contact__block-label">
                FOR ORDER SUPPORT (PLEASE INCLUDE ORDER #):
              </span>
              <a href="mailto:support@closetx.in" className="contact__email">
                support@closetx.in
              </a>
            </div>

            <button className="pill-btn contact__form-btn">
              OR USE FORM HERE
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={imageRef} className="contact__right">
          <img
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop"
            alt="Fashion model"
            className="contact__image"
          />

          {/* Floating macOS-style note */}
          <div ref={noteRef} className="contact__note">
            <div className="contact__note-dots">
              <span className="contact__note-close" style={{ background: '#ff5f57' }} onClick={closeNote} />
              <span style={{ background: '#febc2e' }} />
              <span style={{ background: '#28c840' }} />
            </div>
            <div className="contact__note-date">6 April 2025 at 2:23 PM</div>
            <div className="contact__note-body">
              <p className="contact__note-kaomoji">(*-_-)/*.</p>
              <p>talk to us. what's your style?</p>
              <p>
                XO,
                <br />
                CLOSETX
              </p>
            </div>
          </div>

          {/* Folder icon — click to toggle note */}
          <div className="contact__folder" onClick={openNote} style={{ cursor: 'pointer' }}>
            <FolderIcon size={52} />
            <span className="contact__folder-label">CLOSETX</span>
          </div>

        </div>
      </div>
    </section>
  )
}

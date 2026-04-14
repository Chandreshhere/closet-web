import { useState } from 'react'
import ClothCanvas from './ClothCanvas'
import './Hero.css'

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <section className="hero" id="hero">
      {/* <ClothCanvas /> */}
      {/* ─── Top row: ASCII brand · nav · contact ─── */}
      <header className={`hero__top ${menuOpen ? 'is-open' : ''}`}>
        <button
          className="hero__burger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <a href="#" className="hero__brand" aria-label="ClosetX home">
          <span className="hero__brand-block">
            <span className="hero__brand-name">
              CLOSET<em>X</em>
            </span>
            <span className="hero__brand-tag">FASHION · DELIVERED</span>
          </span>
        </a>

        <nav className="hero__nav" aria-label="Primary">
          <ul>
            <li><a href="#shop"><span className="hero__nav-bracket">[</span><span className="hero__nav-label">Shop</span><span className="hero__nav-bracket">]</span></a></li>
            <li><a href="#brands"><span className="hero__nav-bracket">[</span><span className="hero__nav-label">Brands</span><span className="hero__nav-bracket">]</span></a></li>
            <li><a href="#drops"><span className="hero__nav-bracket">[</span><span className="hero__nav-label">Drops</span><span className="hero__nav-bracket">]</span></a></li>
            <li><a href="#app"><span className="hero__nav-bracket">[</span><span className="hero__nav-label">App</span><span className="hero__nav-bracket">]</span></a></li>
            <li><a href="#try-on"><span className="hero__nav-bracket">[</span><span className="hero__nav-label">AR Try-On</span><span className="hero__nav-bracket">]</span></a></li>
          </ul>
        </nav>

        <a href="#contact" className="hero__contact">
          <span className="hero__contact-dot" />
          <span className="hero__contact-label">Get the App</span>
          <span className="hero__contact-arrow" aria-hidden="true">→</span>
        </a>
      </header>

      {/* ─── Meta row: philosophy / location / status ─── */}
      <div className="hero__meta">
        {/* Promise — editorial column */}
        <div className="hero__meta-col hero__meta-col--1">
          <div className="hero__meta-head">
            <span className="hero__meta-num">01 ——</span>
            <span className="hero__meta-label">The Promise</span>
          </div>
          <p className="hero__meta-body">
            We move fashion like food — <em>fast, fresh, at your door.</em>
            <br />
            Twenty-four premium brands, AR try-on, and 30-minute delivery.
            That’s how ClosetX rewires the way you dress.
          </p>
          <ul className="hero__meta-stats">
            <li>
              <span className="hero__meta-stat-num">24+</span>
              <span className="hero__meta-stat-cap">Brands</span>
            </li>
            <li>
              <span className="hero__meta-stat-num">30 min</span>
              <span className="hero__meta-stat-cap">Avg delivery</span>
            </li>
            <li>
              <span className="hero__meta-stat-num">AR</span>
              <span className="hero__meta-stat-cap">Try-on</span>
            </li>
          </ul>
        </div>

        {/* Location */}
        <div className="hero__meta-col hero__meta-col--2">
          <div className="hero__meta-head">
            <span className="hero__meta-num">02 ——</span>
            <span className="hero__meta-label">Where</span>
          </div>
          <p className="hero__meta-line">
            <span className="hero__meta-city">Indore</span>
            <span className="hero__meta-sep">·</span>
            <span className="hero__meta-mute">Worldwide</span>
          </p>
          <p className="hero__meta-line hero__meta-line--mute">
            18.9388° N, 72.8354° E
          </p>
          <p className="hero__meta-line hero__meta-line--mute">
            Founded in India <span className="hero__heart">♡</span>
          </p>
        </div>

        {/* Status */}
        <div className="hero__meta-col hero__meta-col--3">
          <div className="hero__meta-head hero__meta-head--right">
            <span className="hero__meta-num">03 ——</span>
            <span className="hero__meta-label">Status</span>
          </div>
          <p className="hero__meta-status">
            <span className="hero__dot" />
            Available
          </p>
          <p className="hero__meta-line hero__meta-line--right hero__meta-line--mute">
            <em>for new drops</em>
          </p>
          <p className="hero__meta-line hero__meta-line--right hero__meta-line--time">
            <span className="hero__meta-mute">IST</span> 14:32
          </p>
        </div>
      </div>

      <div className="hero__rule" />

      {/* ─── Giant editorial headline ─── */}
      <div className="hero__headline">
        <h1>
          Fashion as a moment
          <br />
          between craving
          <br />
          and closet
        </h1>
      </div>

    </section>
  )
}

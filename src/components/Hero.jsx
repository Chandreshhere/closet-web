import ClothCanvas from './ClothCanvas'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <ClothCanvas />
      {/* ─── Top row: logo + nav columns + contact ─── */}
      <header className="hero__top">
        <a href="#" className="hero__brand">
          <span className="hero__brand-mark">✕</span>
          <span className="hero__brand-name">ClosetX</span>
        </a>

        <nav className="hero__nav">
          <ul>
            <li><a href="#shop">Shop</a></li>
            <li><a href="#brands">Brands</a></li>
            <li><a href="#drops">Drops</a></li>
          </ul>
          <ul>
            <li><a href="#app">App <span className="hero__nav-mute">(iOS · Android)</span></a></li>
            <li><a href="#try-on">AR Try-On</a></li>
          </ul>
        </nav>

        <a href="#contact" className="hero__contact">Get App</a>
      </header>

      {/* ─── Meta row: philosophy / location / status ─── */}
      <div className="hero__meta">
        <div className="hero__meta-col hero__meta-col--1">
          <p className="hero__meta-label">Our delivery promise</p>
          <p className="hero__meta-body">
            We move fashion like food — fast, fresh, and at your door.
          </p>
          <p className="hero__meta-body">
            Twenty-four premium brands, AR try-on, and 30-minute delivery.
            That’s how ClosetX rewires the way you dress.
          </p>
        </div>

        <div className="hero__meta-col hero__meta-col--2">
          <p>
            Based in Mumbai · Worldwide{' '}
            <span className="hero__time">(LIVE)</span>
          </p>
          <p>Founded in India <span className="hero__heart">♡</span></p>
        </div>

        <div className="hero__meta-col hero__meta-col--3">
          <p>
            <span className="hero__dot" />
            Available <span className="hero__mute">for </span>
            <span className="hero__em">new drops</span>
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

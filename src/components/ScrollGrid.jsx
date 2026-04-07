import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollGrid.css'

const ITEMS = [
  { name: 'Oversized Tee', year: 'SS25', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=70' },
  { name: 'Denim Jacket', year: 'FW24', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=70' },
  { name: 'Cargo Pant', year: 'SS25', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=70' },
  { name: 'Knit Sweater', year: 'FW24', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=70' },
  { name: 'Leather Boot', year: 'AW24', img: 'https://images.unsplash.com/photo-1542219550-37153d387c27?w=600&q=70' },
  { name: 'Bomber Jacket', year: 'SS25', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=70' },
  { name: 'Linen Shirt', year: 'SS25', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=70' },
  { name: 'Wool Coat', year: 'FW24', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=70' },
  { name: 'Slim Chino', year: 'SS25', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=70' },
  { name: 'Hoodie', year: 'FW24', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=70' },
  { name: 'Sneaker', year: 'SS25', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=70' },
  { name: 'Tote Bag', year: 'SS25', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=70' },
  { name: 'Silk Scarf', year: 'AW24', img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=70' },
  { name: 'Crop Top', year: 'SS25', img: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=70' },
  { name: 'Trench', year: 'FW24', img: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=600&q=70' },
  { name: 'Polo', year: 'SS25', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=70' },
]

const PER_ROW = 9
const ROWS = 8

export default function ScrollGrid() {
  const sectionRef = useRef(null)
  const rowsRef = useRef([])
  const startW = useRef(125)
  const endW = useRef(500)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const rows = rowsRef.current
    const isMobile = window.innerWidth < 1000
    startW.current = isMobile ? 250 : 125
    endW.current = isMobile ? 750 : 500

    const firstRow = rows[0]
    firstRow.style.width = `${endW.current}%`
    const expandedRowH = firstRow.offsetHeight
    firstRow.style.width = ''

    const gap = parseFloat(getComputedStyle(section).gap) || 0
    const pad = parseFloat(getComputedStyle(section).paddingTop) || 0
    section.style.height = `${expandedRowH * rows.length + gap * (rows.length - 1) + pad * 2}px`

    function update() {
      const sy = window.scrollY
      const vh = window.innerHeight
      rows.forEach((row) => {
        const rect = row.getBoundingClientRect()
        const top = rect.top + sy
        const bot = top + rect.height
        const s = top - vh
        const e = bot
        let p = (sy - s) / (e - s)
        p = Math.max(0, Math.min(1, p))
        row.style.width = `${
          startW.current + (endW.current - startW.current) * p
        }%`
      })
    }
    gsap.ticker.add(update)
    update()

    const onResize = () => {
      const m = window.innerWidth < 1000
      startW.current = m ? 250 : 125
      endW.current = m ? 750 : 500
      firstRow.style.width = `${endW.current}%`
      const h = firstRow.offsetHeight
      firstRow.style.width = ''
      section.style.height = `${h * rows.length + gap * (rows.length - 1) + pad * 2}px`
    }
    window.addEventListener('resize', onResize)
    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const rowsData = []
  let i = 0
  for (let r = 0; r < ROWS; r++) {
    const row = []
    for (let c = 0; c < PER_ROW; c++) {
      row.push(ITEMS[i++ % ITEMS.length])
    }
    rowsData.push(row)
  }

  return (
    <section className="scroll-grid-wrap">
      <div className="scroll-grid-heading">
        <p>The Drop / Scroll to expand</p>
        <h2>Closet, in motion.</h2>
      </div>
      <section ref={sectionRef} className="scroll-grid">
        {rowsData.map((row, ri) => (
          <div
            key={ri}
            className="scroll-grid-row"
            ref={(el) => { if (el) rowsRef.current[ri] = el }}
          >
            {row.map((it, ci) => (
              <div key={ci} className="scroll-grid-item">
                <div className="scroll-grid-img">
                  <img src={it.img} alt={it.name} />
                </div>
                <div className="scroll-grid-info">
                  <p>{it.name}</p>
                  <p>{it.year}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </section>
  )
}

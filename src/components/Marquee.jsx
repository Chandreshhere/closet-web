import './Marquee.css'

export default function Marquee({ texts, variant = 'default', speed = 30 }) {
  const items = [...texts, ...texts, ...texts, ...texts]

  const classes = variant.split(' ').map(v => `marquee--${v}`).join(' ')

  return (
    <div className={`marquee ${classes}`}>
      <div
        className="marquee__track"
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((text, i) => (
          <span key={i} className="marquee__item">
            {text}
            <span className="marquee__separator">—</span>
          </span>
        ))}
      </div>
    </div>
  )
}

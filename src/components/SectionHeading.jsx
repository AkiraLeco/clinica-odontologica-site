export default function SectionHeading({ eyebrow, title, text, id, center = false }) {
  return (
    <div className={`section-heading ${center ? 'section-heading--center' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {text && <p className="section-heading__text">{text}</p>}
    </div>
  )
}

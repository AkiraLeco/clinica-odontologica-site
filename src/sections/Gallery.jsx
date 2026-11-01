import { useState } from 'react'
import { Expand } from 'lucide-react'
import Modal from '../components/Modal'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { gallery } from '../data/gallery'

export default function Gallery() {
  const [active, setActive] = useState(null)
  return (
    <section id="galeria" className="section section--soft" aria-labelledby="gal-title">
      <div className="container">
        <SectionHeading center eyebrow="Galeria" id="gal-title" title="Conheça nosso espaço" />
        <div className="gallery">
          {gallery.map((g, i) => (
            <Reveal key={g.id} delay={(i % 3) * 70} className="gallery__item">
              <button type="button" onClick={() => setActive(g)} aria-label={`Ampliar: ${g.label}`}>
                <Photo src={g.src} alt={g.alt} label={g.label} />
                <span className="gallery__caption"><Expand size={16} aria-hidden="true" /> {g.label}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {active && (
        <Modal title={active.label} onClose={() => setActive(null)} wide>
          <Photo src={active.src} alt={active.alt} label={active.label} className="lightbox__img" ratio="16 / 10" />
          <p className="lightbox__label">{active.label}</p>
        </Modal>
      )}
    </section>
  )
}

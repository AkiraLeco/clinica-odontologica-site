import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { Icon } from '../utils/icons'
import { clinic } from '../data/clinic'

export default function About() {
  const a = clinic.about
  return (
    <section id="sobre" className="section section--soft" aria-labelledby="sobre-title">
      <div className="container about">
        <Reveal className="about__media">
          <Photo {...a.image} ratio="4 / 5" />
        </Reveal>
        <Reveal delay={100}>
          <SectionHeading eyebrow="Sobre a clínica" title={a.title} id="sobre-title" />
          {a.paragraphs.map((p, i) => <p key={i} className="about__text">{p}</p>)}
          <ul className="about__list">
            {a.highlights.map((h) => (
              <li key={h.title}>
                <span className="icon-chip"><Icon name={h.icon} size={20} /></span>
                <div>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

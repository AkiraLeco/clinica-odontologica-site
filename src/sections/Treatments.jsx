import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { Icon } from '../utils/icons'
import { treatments } from '../data/treatments'
import { bookingLink } from '../utils/contact'

export default function Treatments() {
  return (
    <section id="tratamentos" className="section" aria-labelledby="trat-title">
      <div className="container">
        <SectionHeading
          center
          eyebrow="Tratamentos"
          id="trat-title"
          title="Cuidado completo para cada fase do sorriso"
          text="Cada indicação depende de avaliação profissional. Agende uma avaliação para conversar sobre o que é adequado para você."
        />
        <div className="cards">
          {treatments.map((t, i) => (
            <Reveal as="article" key={t.id} className="card treatment" delay={(i % 3) * 80}>
              <span className="icon-chip icon-chip--lg"><Icon name={t.icon} size={26} /></span>
              <h3>{t.name}</h3>
              <p>{t.description}</p>
              <ul className="treatment__meta">
                <li>{t.duration}</li>
                <li>{t.info}</li>
              </ul>
              <Link className="btn btn--outline" to={bookingLink({ treatment: t.id })}>
                Agendar avaliação <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { CalendarDays, ArrowRight } from 'lucide-react'
import Photo from '../components/Photo'
import { Icon } from '../utils/icons'
import { clinic } from '../data/clinic'
import { bookingLink } from '../utils/contact'

export default function Hero() {
  const h = clinic.hero
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow hero__eyebrow">{h.eyebrow}</p>
          <h1 id="hero-title">{h.title}</h1>
          <p className="hero__lead">{h.description}</p>
          <div className="hero__actions">
            <Link to={bookingLink()} className="btn btn--primary btn--lg">
              <CalendarDays size={20} aria-hidden="true" /> Agendar consulta
            </Link>
            <Link to="/#tratamentos" className="btn btn--ghost btn--lg">
              Conhecer tratamentos <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <ul className="trust" aria-label="Diferenciais">
            {clinic.trustItems.map((t) => (
              <li key={t.title}>
                <Icon name={t.icon} size={20} />
                <span>{t.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hero__media">
          <Photo {...h.image} className="hero__photo" />
          <div className="hero__badge">
            <CalendarDays size={22} aria-hidden="true" />
            <div>
              <strong>Agendamento online</strong>
              <span>Solicite em poucos passos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

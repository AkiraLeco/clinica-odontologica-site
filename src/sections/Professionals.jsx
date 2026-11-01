import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { professionals } from '../data/professionals'
import { bookingLink } from '../utils/contact'
import { WEEKDAY_NAMES } from '../utils/date'

export default function Professionals() {
  return (
    <section id="profissionais" className="section section--soft" aria-labelledby="prof-title">
      <div className="container">
        <SectionHeading
          center
          eyebrow="Profissionais"
          id="prof-title"
          title="Quem cuida de você"
          text="Conheça a equipe. Os dados abaixo são espaços reservados e devem ser substituídos pelas informações reais."
        />
        <div className="cards cards--2">
          {professionals.map((p, i) => (
            <Reveal as="article" key={p.id} className="card pro" delay={i * 100}>
              <Photo src={p.photo} alt={p.name} label="Foto do profissional" ratio="1 / 1" className="pro__photo" />
              <div className="pro__body">
                <h3>{p.name}</h3>
                <p className="pro__spec">{p.specialty}{p.cro && <> · CRO {p.cro}</>}</p>
                <p>{p.bio}</p>
                <p className="pro__days">
                  <strong>Atende:</strong> {p.days.map((d) => WEEKDAY_NAMES[d]).join(', ')}
                </p>
                <Link className="btn btn--primary" to={bookingLink({ professional: p.id })}>
                  <CalendarDays size={18} aria-hidden="true" /> Agendar com este profissional
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

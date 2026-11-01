import { Link } from 'react-router-dom'
import { CalendarDays, Clock, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { clinic } from '../data/clinic'
import { bookingLink, whatsappLink } from '../utils/contact'

const socialLabels = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn' }

function Row({ icon: I, title, children }) {
  return (
    <li>
      <span className="icon-chip"><I size={20} aria-hidden="true" /></span>
      <div><h3>{title}</h3>{children}</div>
    </li>
  )
}

export default function Contact() {
  const c = clinic.contact
  const wa = whatsappLink()
  const socials = Object.entries(clinic.social).filter(([, url]) => url)
  return (
    <section id="contato" className="section section--soft" aria-labelledby="contato-title">
      <div className="container contact">
        <Reveal>
          <SectionHeading eyebrow="Contato" id="contato-title" title="Estamos prontos para receber você" />
          <ul className="contact__list">
            <Row icon={MapPin} title="Endereço">
              <p>{c.address || 'Endereço a ser informado pela clínica.'}</p>
              {c.mapUrl && <a href={c.mapUrl} target="_blank" rel="noopener noreferrer">Ver no mapa</a>}
            </Row>
            <Row icon={Phone} title="Telefone">
              {c.phone ? <a href={`tel:${c.phone.replace(/\D/g, '')}`}>{c.phone}</a> : <p>Telefone a ser informado.</p>}
            </Row>
            <Row icon={Mail} title="E-mail">
              {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : <p>E-mail a ser informado.</p>}
            </Row>
            <Row icon={Clock} title="Horários de funcionamento">
              {clinic.hours.map((h) => <p key={h.label}>{h.label}: {h.value}</p>)}
            </Row>
            {socials.length > 0 && (
              <Row icon={Share2} title="Redes sociais">
                <p>{socials.map(([k, url], i) => (
                  <span key={k}>{i > 0 && ' · '}<a href={url} target="_blank" rel="noopener noreferrer">{socialLabels[k]}</a></span>
                ))}</p>
              </Row>
            )}
          </ul>
        </Reveal>
        <Reveal delay={120} className="contact__panel">
          <h3>Prefere agendar online?</h3>
          <p>Escolha tratamento, profissional, data e horário em poucos passos. A solicitação é demonstrativa e fica salva somente neste navegador.</p>
          <Link className="btn btn--light btn--lg" to={bookingLink()}>
            <CalendarDays size={20} aria-hidden="true" /> Agendar consulta
          </Link>
          {wa ? (
            <a className="btn btn--whatsapp btn--lg" href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={20} aria-hidden="true" /> Falar pelo WhatsApp
            </a>
          ) : (
            <p className="contact__hint">WhatsApp: defina o número em src/data/clinic.js para ativar o botão.</p>
          )}
          <div className="map-slot">
            {c.mapUrl
              ? <a href={c.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={18} aria-hidden="true" /> Abrir localização</a>
              : <span><MapPin size={18} aria-hidden="true" /> Espaço reservado para mapa ou link de localização</span>}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

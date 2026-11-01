import { Link } from 'react-router-dom'
import Logo from './Logo'
import { clinic } from '../data/clinic'
import { treatments } from '../data/treatments'
import { NAV_LINKS, bookingLink } from '../utils/contact'

const socialLabels = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn' }

export default function Footer() {
  const c = clinic.contact
  const socials = Object.entries(clinic.social).filter(([, url]) => url)
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>{clinic.shortDescription}</p>
        </div>
        <nav aria-label="Navegação do rodapé">
          <h2>Navegação</h2>
          <ul>
            {NAV_LINKS.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
            <li><Link to="/admin">Painel demonstrativo</Link></li>
          </ul>
        </nav>
        <div>
          <h2>Tratamentos</h2>
          <ul>
            {treatments.slice(0, 6).map((t) => (
              <li key={t.id}><Link to={bookingLink({ treatment: t.id })}>{t.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Contato</h2>
          <ul>
            <li>{c.address || 'Endereço a ser informado'}</li>
            <li>{c.phone || 'Telefone a ser informado'}</li>
            {c.email && <li>{c.email}</li>}
            {socials.map(([k, url]) => (
              <li key={k}><a href={url} target="_blank" rel="noopener noreferrer">{socialLabels[k]}</a></li>
            ))}
          </ul>
          <h2 className="footer__sub">Horários</h2>
          <ul>
            {clinic.hours.map((h) => <li key={h.label}>{h.label}: {h.value}</li>)}
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {clinic.name} {clinic.tagline}. Todos os direitos reservados.</p>
        <p>Site de demonstração — agendamentos salvos apenas neste navegador.</p>
      </div>
    </footer>
  )
}

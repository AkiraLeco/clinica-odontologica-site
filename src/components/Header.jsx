import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, CalendarDays } from 'lucide-react'
import Logo from './Logo'
import { NAV_LINKS, bookingLink } from '../utils/contact'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className={`header ${scrolled || open ? 'header--solid' : ''}`}>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <div className="container header__inner">
        <Logo />
        <nav id="menu-principal" className={`nav ${open ? 'nav--open' : ''}`} aria-label="Principal">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
          <Link className="btn btn--primary nav__cta" to={bookingLink()}>
            <CalendarDays size={18} aria-hidden="true" /> Agendar consulta
          </Link>
        </nav>
        <button
          className="header__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}

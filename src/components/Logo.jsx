import { Link } from 'react-router-dom'
import { clinic } from '../data/clinic'

export default function Logo({ light = false }) {
  return (
    <Link to="/#inicio" className={`logo ${light ? 'logo--light' : ''}`} aria-label={`${clinic.name} — página inicial`}>
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M16 6c-3-2-8-.5-8 4 0 4 2 5 2.500 8.500.3 2.500 1.300 4 2.300 4 1.500 0 1.500-3.500 3.200-3.500s1.700 3.500 3.200 3.500c1 0 2-1.500 2.300-4C22 15 24 14 24 10c0-4.500-5-6-8-4z" />
        </svg>
      </span>
      <span className="logo__text">
        <strong>{clinic.name}</strong>
        <small>{clinic.tagline}</small>
      </span>
    </Link>
  )
}

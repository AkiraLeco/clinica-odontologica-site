import { clinic } from '../data/clinic'

export const whatsappLink = () => {
  const n = clinic.contact.whatsapp.replace(/\D/g, '')
  if (!n) return ''
  return `https://wa.me/${n}?text=${encodeURIComponent(clinic.contact.whatsappMessage)}`
}

export const bookingLink = ({ treatment, professional } = {}) => {
  const p = new URLSearchParams()
  if (treatment) p.set('tratamento', treatment)
  if (professional) p.set('profissional', professional)
  const q = p.toString()
  return q ? `/agendar?${q}` : '/agendar'
}

export const NAV_LINKS = [
  { label: 'Início', to: '/#inicio' },
  { label: 'Sobre a clínica', to: '/#sobre' },
  { label: 'Tratamentos', to: '/#tratamentos' },
  { label: 'Profissionais', to: '/#profissionais' },
  { label: 'Depoimentos', to: '/#depoimentos' },
  { label: 'Contato', to: '/#contato' },
]

import { weeklySlots } from '../data/schedule'
import { professionals } from '../data/professionals'
import { parseISODate, startOfToday, toISODate } from './date'

const active = (appointments) => appointments.filter((a) => a.status === 'pendente')

export const professionalsForDate = (iso, professionalId) => {
  const wd = parseISODate(iso).getDay()
  return professionals.filter(
    (p) => p.days.includes(wd) && (!professionalId || professionalId === 'any' || p.id === professionalId),
  )
}

// Profissionais livres em determinado dia/horário (considera apenas agendamentos pendentes locais).
export const freeProfessionals = (iso, time, professionalId, appointments) => {
  const taken = new Set(
    active(appointments).filter((a) => a.date === iso && a.time === time).map((a) => a.professionalId),
  )
  return professionalsForDate(iso, professionalId).filter((p) => !taken.has(p.id))
}

// Horários do dia com flag de disponibilidade local (demonstrativa).
export const slotsForDate = (iso, professionalId, appointments) => {
  const wd = parseISODate(iso).getDay()
  const now = new Date()
  const isToday = iso === toISODate(now)
  return (weeklySlots[wd] || []).map((time) => {
    const [h, m] = time.split(':').map(Number)
    const past = isToday && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes()))
    const free = freeProfessionals(iso, time, professionalId, appointments).length > 0
    return { time, available: !past && free }
  })
}

export const dateHasSlots = (iso, professionalId, appointments) =>
  parseISODate(iso) >= startOfToday() && slotsForDate(iso, professionalId, appointments).some((s) => s.available)

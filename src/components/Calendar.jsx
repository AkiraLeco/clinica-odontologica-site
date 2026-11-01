import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WEEKDAY_LABELS, formatMonthYear, parseISODate, startOfToday, toISODate } from '../utils/date'
import { maxMonthsAhead } from '../data/schedule'

// Calendário interativo. `isAvailable(iso)` define quais dias podem ser escolhidos.
export default function Calendar({ value, onChange, isAvailable }) {
  const today = startOfToday()
  const [view, setView] = useState(() => {
    const base = value ? parseISODate(value) : today
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + maxMonthsAhead, 1)

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1)
    const total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
    const list = Array(first.getDay()).fill(null)
    for (let d = 1; d <= total; d++) list.push(new Date(view.getFullYear(), view.getMonth(), d))
    return list
  }, [view])

  const go = (delta) => setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1))

  return (
    <div className="calendar">
      <div className="calendar__head">
        <button type="button" onClick={() => go(-1)} disabled={view <= minMonth} aria-label="Mês anterior">
          <ChevronLeft size={20} />
        </button>
        <strong aria-live="polite">{formatMonthYear(view)}</strong>
        <button type="button" onClick={() => go(1)} disabled={view >= maxMonth} aria-label="Próximo mês">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="calendar__grid" role="grid" aria-label="Calendário">
        {WEEKDAY_LABELS.map((w) => <span key={w} className="calendar__dow" role="columnheader">{w}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const iso = toISODate(d)
          const past = d < today
          const available = !past && isAvailable(iso)
          const selected = value === iso
          return (
            <button
              key={iso}
              type="button"
              className={`calendar__day ${selected ? 'is-selected' : ''} ${iso === toISODate(today) ? 'is-today' : ''}`}
              disabled={!available}
              aria-pressed={selected}
              aria-label={`${d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}${available ? '' : ', indisponível'}`}
              onClick={() => onChange(iso)}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
      <p className="calendar__legend">Dias desabilitados estão no passado ou sem horários demonstrativos livres.</p>
    </div>
  )
}

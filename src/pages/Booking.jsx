import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Info, Loader2, Users } from 'lucide-react'
import Calendar from '../components/Calendar'
import { Icon } from '../utils/icons'
import { treatments } from '../data/treatments'
import { professionals } from '../data/professionals'
import { appointmentService, STATUS } from '../services/appointmentService'
import { useAppointments } from '../hooks/useAppointments'
import { dateHasSlots, freeProfessionals, slotsForDate } from '../utils/availability'
import { formatLongDate } from '../utils/date'
import { formatPhone, validatePatient } from '../utils/validation'

const STEPS = ['Tratamento', 'Profissional', 'Data', 'Horário', 'Seus dados', 'Revisão']
const DEMO_NOTICE =
  'Esta é uma demonstração de agendamento. Sua solicitação foi salva somente neste navegador e ainda não representa uma consulta confirmada pela clínica.'

export default function Booking() {
  const [params] = useSearchParams()
  const { appointments, refresh } = useAppointments()

  const initialTreatment = treatments.some((t) => t.id === params.get('tratamento')) ? params.get('tratamento') : ''
  const initialPro = professionals.some((p) => p.id === params.get('profissional')) ? params.get('profissional') : 'any'

  const [step, setStep] = useState(initialTreatment ? 2 : 1)
  const [form, setForm] = useState({
    treatmentId: initialTreatment, professionalId: initialPro, date: '', time: '',
    name: '', phone: '', email: '', notes: '',
  })
  const [errors, setErrors] = useState({})
  const [stepError, setStepError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)
  const [canceled, setCanceled] = useState(false)

  useEffect(() => {
    document.title = 'Agendar consulta — Clínica Aurora'
    window.scrollTo({ top: 0 })
  }, [])
  useEffect(() => { document.getElementById('booking-heading')?.focus() }, [step, done])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const treatment = treatments.find((t) => t.id === form.treatmentId)
  const pro = professionals.find((p) => p.id === form.professionalId)

  const slots = useMemo(
    () => (form.date ? slotsForDate(form.date, form.professionalId, appointments) : []),
    [form.date, form.professionalId, appointments],
  )

  // Se a data/horário escolhido deixou de estar livre (ex.: outra aba), limpa a seleção.
  useEffect(() => {
    if (form.date && !dateHasSlots(form.date, form.professionalId, appointments)) set({ date: '', time: '' })
    else if (form.time && slots.length && !slots.find((s) => s.time === form.time)?.available) set({ time: '' })
  }, [appointments, slots, form.date, form.time, form.professionalId])

  const validateStep = () => {
    if (step === 1 && !form.treatmentId) return 'Selecione um tratamento para continuar.'
    if (step === 3 && !form.date) return 'Selecione uma data disponível no calendário.'
    if (step === 4 && !form.time) return 'Selecione um horário.'
    if (step === 5) {
      const e = validatePatient(form)
      setErrors(e)
      if (Object.keys(e).length) return 'Revise os campos destacados.'
    }
    return ''
  }

  const next = () => {
    const msg = validateStep()
    setStepError(msg)
    if (!msg) setStep((s) => s + 1)
  }
  const back = () => { setStepError(''); setStep((s) => s - 1) }

  const confirm = async () => {
    setSubmitting(true)
    setStepError('')
    try {
      const fresh = appointmentService.snapshot()
      const candidates = freeProfessionals(form.date, form.time, form.professionalId, fresh)
      if (!candidates.length) {
        await refresh()
        set({ time: '' })
        setStep(4)
        setStepError('Esse horário não está mais livre neste navegador. Escolha outro.')
        return
      }
      const assigned = candidates[0]
      const created = await appointmentService.create({
        ...form,
        treatmentName: treatment.name,
        professionalId: assigned.id,
        professionalName: assigned.name,
        professionalPreference: form.professionalId === 'any' ? 'any' : 'specific',
      })
      await refresh()
      setDone(created)
    } catch (err) {
      await refresh()
      setStepError(err.message || 'Não foi possível registrar a solicitação.')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelDone = async () => {
    setSubmitting(true)
    try {
      await appointmentService.setStatus(done.id, STATUS.CANCELED)
      await refresh()
      setCanceled(true)
    } catch (err) {
      setStepError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setDone(null); setCanceled(false); setStep(1); setStepError(''); setErrors({})
    setForm({ treatmentId: '', professionalId: 'any', date: '', time: '', name: '', phone: '', email: '', notes: '' })
  }

  /* ---------- Tela de confirmação ---------- */
  if (done) {
    return (
      <main id="conteudo" className="booking">
        <div className="container container--narrow">
          <div className="booking__card success">
            <span className={`success__icon ${canceled ? 'success__icon--warn' : ''}`}>
              {canceled ? <AlertTriangle size={32} /> : <Check size={32} />}
            </span>
            <h1 id="booking-heading" tabIndex={-1}>
              {canceled ? 'Solicitação cancelada' : 'Solicitação registrada com sucesso!'}
            </h1>
            <dl className="summary">
              <div><dt>Paciente</dt><dd>{done.name}</dd></div>
              <div><dt>Tratamento</dt><dd>{done.treatmentName}</dd></div>
              <div><dt>Profissional</dt><dd>{done.professionalName}</dd></div>
              <div><dt>Data</dt><dd>{formatLongDate(done.date)}</dd></div>
              <div><dt>Horário</dt><dd>{done.time}</dd></div>
              <div><dt>Identificação local</dt><dd><code>{done.id}</code></dd></div>
            </dl>
            <p className="notice" role="note"><Info size={18} aria-hidden="true" /> {DEMO_NOTICE}</p>
            {stepError && <p className="form-error" role="alert">{stepError}</p>}
            <div className="actions actions--center">
              <Link to="/" className="btn btn--primary">Voltar ao início</Link>
              <button className="btn btn--outline" onClick={reset}>Nova solicitação</button>
              {!canceled && (
                <button className="btn btn--danger-ghost" onClick={cancelDone} disabled={submitting}>
                  {submitting ? <Loader2 className="spin" size={18} /> : null} Cancelar esta solicitação
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ---------- Fluxo em etapas ---------- */
  return (
    <main id="conteudo" className="booking">
      <div className="container container--narrow">
        <header className="booking__head">
          <p className="eyebrow">Agendamento demonstrativo</p>
          <h1 id="booking-heading" tabIndex={-1}>{STEPS[step - 1]}</h1>
          <p className="booking__demo">Horários demonstrativos: não representam disponibilidade real da clínica.</p>
        </header>

        <ol className="stepper" aria-label="Progresso do agendamento">
          {STEPS.map((label, i) => (
            <li key={label} className={i + 1 === step ? 'is-current' : i + 1 < step ? 'is-done' : ''} aria-current={i + 1 === step ? 'step' : undefined}>
              <span>{i + 1 < step ? <Check size={14} aria-hidden="true" /> : i + 1}</span>
              <em>{label}</em>
            </li>
          ))}
        </ol>

        <div className="booking__card">
          {step === 1 && (
            <div className="choice-grid" role="radiogroup" aria-label="Tratamento">
              {treatments.map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={form.treatmentId === t.id}
                  className={`choice ${form.treatmentId === t.id ? 'is-selected' : ''}`}
                  onClick={() => { set({ treatmentId: t.id }); setStepError('') }}>
                  <span className="icon-chip"><Icon name={t.icon} size={20} /></span>
                  <span><strong>{t.name}</strong><small>{t.duration}</small></span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="choice-grid choice-grid--1" role="radiogroup" aria-label="Profissional">
              <button type="button" role="radio" aria-checked={form.professionalId === 'any'}
                className={`choice ${form.professionalId === 'any' ? 'is-selected' : ''}`}
                onClick={() => set({ professionalId: 'any', date: '', time: '' })}>
                <span className="icon-chip"><Users size={20} aria-hidden="true" /></span>
                <span><strong>Qualquer profissional</strong><small>Sem preferência — usaremos o primeiro horário livre</small></span>
              </button>
              {professionals.map((p) => (
                <button key={p.id} type="button" role="radio" aria-checked={form.professionalId === p.id}
                  className={`choice ${form.professionalId === p.id ? 'is-selected' : ''}`}
                  onClick={() => set({ professionalId: p.id, date: '', time: '' })}>
                  <span className="avatar" aria-hidden="true">{p.name.charAt(0)}</span>
                  <span><strong>{p.name}</strong><small>{p.specialty}{p.cro && ` · CRO ${p.cro}`}</small></span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <Calendar value={form.date} onChange={(date) => { set({ date, time: '' }); setStepError('') }}
              isAvailable={(iso) => dateHasSlots(iso, form.professionalId, appointments)} />
          )}

          {step === 4 && (
            <>
              <p className="muted">{formatLongDate(form.date)}</p>
              <div className="slots" role="radiogroup" aria-label="Horário">
                {slots.map((s) => (
                  <button key={s.time} type="button" role="radio" aria-checked={form.time === s.time}
                    disabled={!s.available} className={`slot ${form.time === s.time ? 'is-selected' : ''}`}
                    onClick={() => { set({ time: s.time }); setStepError('') }}>
                    {s.time}
                    {!s.available && <small>indisponível</small>}
                  </button>
                ))}
              </div>
              {!slots.some((s) => s.available) && <p className="empty">Nenhum horário livre neste dia. Volte e escolha outra data.</p>}
            </>
          )}

          {step === 5 && (
            <form className="form" noValidate onSubmit={(e) => { e.preventDefault(); next() }}>
              <Field id="name" label="Nome completo" error={errors.name} required>
                <input id="name" autoComplete="name" value={form.name} onChange={(e) => set({ name: e.target.value })}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
              </Field>
              <Field id="phone" label="Telefone" error={errors.phone} required>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={form.phone}
                  onChange={(e) => set({ phone: formatPhone(e.target.value) })}
                  aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-err' : undefined} />
              </Field>
              <Field id="email" label="E-mail (opcional)" error={errors.email}>
                <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set({ email: e.target.value })}
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
              </Field>
              <Field id="notes" label="Observação (opcional)">
                <textarea id="notes" rows={3} maxLength={300} value={form.notes} onChange={(e) => set({ notes: e.target.value })} />
              </Field>
              <p className="muted small">Não informe dados clínicos ou sensíveis. Os dados ficam salvos apenas neste navegador.</p>
              <button type="submit" hidden />
            </form>
          )}

          {step === 6 && (
            <>
              <dl className="summary">
                <div><dt>Tratamento</dt><dd>{treatment?.name}</dd></div>
                <div><dt>Profissional</dt><dd>{pro ? pro.name : 'Qualquer profissional'}</dd></div>
                <div><dt>Data</dt><dd>{formatLongDate(form.date)}</dd></div>
                <div><dt>Horário</dt><dd>{form.time}</dd></div>
                <div><dt>Nome</dt><dd>{form.name}</dd></div>
                <div><dt>Telefone</dt><dd>{form.phone}</dd></div>
              </dl>
              <p className="notice" role="note"><Info size={18} aria-hidden="true" /> {DEMO_NOTICE}</p>
            </>
          )}

          {stepError && <p className="form-error" role="alert"><AlertTriangle size={16} aria-hidden="true" /> {stepError}</p>}

          <div className="actions">
            {step > 1 ? (
              <button type="button" className="btn btn--ghost" onClick={back} disabled={submitting}>
                <ArrowLeft size={18} aria-hidden="true" /> Voltar
              </button>
            ) : <Link to="/" className="btn btn--ghost"><ArrowLeft size={18} aria-hidden="true" /> Início</Link>}
            {step < 6 ? (
              <button type="button" className="btn btn--primary" onClick={next}>
                Continuar <ArrowRight size={18} aria-hidden="true" />
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={confirm} disabled={submitting}>
                {submitting ? <><Loader2 className="spin" size={18} aria-hidden="true" /> Registrando…</> : 'Confirmar solicitação'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ id, label, error, required, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {error && <span id={`${id}-err`} className="field__error">{error}</span>}
    </div>
  )
}

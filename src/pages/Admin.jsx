import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Download, Eye, Search, Trash2, XCircle, RotateCcw, Loader2 } from 'lucide-react'
import Modal from '../components/Modal'
import { treatments } from '../data/treatments'
import { appointmentService, STATUS } from '../services/appointmentService'
import { useAppointments } from '../hooks/useAppointments'
import { formatLongDate, formatShortDate, toISODate } from '../utils/date'

const statusLabel = { [STATUS.PENDING]: 'Pendente', [STATUS.CANCELED]: 'Cancelado' }

export default function Admin() {
  const { appointments, refresh } = useAppointments()
  const [filters, setFilters] = useState({ q: '', date: '', treatment: '', status: '' })
  const [detail, setDetail] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Painel demonstrativo — Clínica Aurora' }, [])

  const today = toISODate(new Date())
  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((a) => a.status === STATUS.PENDING).length,
    canceled: appointments.filter((a) => a.status === STATUS.CANCELED).length,
    today: appointments.filter((a) => a.date === today).length,
  }), [appointments, today])

  const byTreatment = useMemo(() => {
    const map = new Map()
    appointments.filter((a) => a.status === STATUS.PENDING).forEach((a) => map.set(a.treatmentName, (map.get(a.treatmentName) || 0) + 1))
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [appointments])

  const list = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    return appointments
      .filter((a) => (!q || a.name.toLowerCase().includes(q))
        && (!filters.date || a.date === filters.date)
        && (!filters.treatment || a.treatmentId === filters.treatment)
        && (!filters.status || a.status === filters.status))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  }, [appointments, filters])

  const run = async (id, fn) => {
    setBusyId(id); setError('')
    try { await fn(); await refresh() } catch (e) { setError(e.message) } finally { setBusyId(null) }
  }
  const changeStatus = (a, status) => run(a.id, async () => {
    const updated = await appointmentService.setStatus(a.id, status)
    setDetail((d) => (d && d.id === a.id ? updated : d))
  })
  const doDelete = async () => {
    const id = toDelete.id
    await run(id, () => appointmentService.remove(id))
    setToDelete(null)
    setDetail((d) => (d && d.id === id ? null : d))
  }

  const setF = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const max = byTreatment[0]?.[1] || 1

  return (
    <main id="conteudo" className="admin">
      <div className="container">
        <div className="demo-banner" role="note">
          <AlertTriangle size={20} aria-hidden="true" />
          <p><strong>Painel de demonstração.</strong> Sem autenticação e sem acesso compartilhado: os dados ficam apenas no localStorage deste navegador. Não utilize dados reais de pacientes.</p>
        </div>

        <div className="admin__title">
          <h1>Solicitações de agendamento</h1>
          <button className="btn btn--outline" onClick={() => window.print()}>
            <Download size={18} aria-hidden="true" /> Exportar PDF
          </button>
        </div>

        <div className="stats">
          <Stat label="Total de solicitações" value={stats.total} />
          <Stat label="Pendentes" value={stats.pending} />
          <Stat label="Canceladas" value={stats.canceled} />
          <Stat label="Solicitações de hoje" value={stats.today} />
        </div>

        {byTreatment.length > 0 && (
          <section className="admin__panel" aria-labelledby="chart-title">
            <h2 id="chart-title">Pendentes por tratamento</h2>
            <ul className="bars">
              {byTreatment.map(([name, n]) => (
                <li key={name}>
                  <span>{name}</span>
                  <div className="bars__track"><div style={{ width: `${(n / max) * 100}%` }} /></div>
                  <strong>{n}</strong>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="admin__panel" aria-labelledby="list-title">
          <h2 id="list-title">Solicitações</h2>
          <div className="filters">
            <label className="filters__search">
              <span className="sr-only">Buscar pelo nome</span>
              <Search size={18} aria-hidden="true" />
              <input type="search" placeholder="Buscar pelo nome" value={filters.q} onChange={(e) => setF({ q: e.target.value })} />
            </label>
            <label><span className="sr-only">Filtrar por data</span>
              <input type="date" value={filters.date} onChange={(e) => setF({ date: e.target.value })} /></label>
            <label><span className="sr-only">Filtrar por tratamento</span>
              <select value={filters.treatment} onChange={(e) => setF({ treatment: e.target.value })}>
                <option value="">Todos os tratamentos</option>
                {treatments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select></label>
            <label><span className="sr-only">Filtrar por status</span>
              <select value={filters.status} onChange={(e) => setF({ status: e.target.value })}>
                <option value="">Todos os status</option>
                <option value={STATUS.PENDING}>Pendente</option>
                <option value={STATUS.CANCELED}>Cancelado</option>
              </select></label>
            {(filters.q || filters.date || filters.treatment || filters.status) && (
              <button className="btn btn--ghost" onClick={() => setFilters({ q: '', date: '', treatment: '', status: '' })}>Limpar filtros</button>
            )}
          </div>

          {error && <p className="form-error" role="alert"><AlertTriangle size={16} aria-hidden="true" /> {error}</p>}

          {list.length === 0 ? (
            <p className="empty">
              {appointments.length === 0
                ? 'Nenhuma solicitação registrada neste navegador ainda. Faça um agendamento de teste na página de agendamento.'
                : 'Nenhuma solicitação corresponde aos filtros.'}
            </p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Paciente</th><th>Tratamento</th><th>Data</th><th>Horário</th><th>Status</th><th><span className="sr-only">Ações</span></th></tr>
                </thead>
                <tbody>
                  {list.map((a) => (
                    <tr key={a.id}>
                      <td data-label="Paciente"><strong>{a.name}</strong><small>{a.id}</small></td>
                      <td data-label="Tratamento">{a.treatmentName}</td>
                      <td data-label="Data">{formatShortDate(a.date)}</td>
                      <td data-label="Horário">{a.time}</td>
                      <td data-label="Status"><span className={`status status--${a.status}`}>{statusLabel[a.status]}</span></td>
                      <td className="table__actions">
                        {busyId === a.id ? <Loader2 className="spin" size={18} aria-label="Processando" /> : (
                          <>
                            <button className="icon-btn" onClick={() => setDetail(a)} aria-label={`Ver detalhes de ${a.name}`} title="Detalhes"><Eye size={18} /></button>
                            {a.status === STATUS.PENDING
                              ? <button className="icon-btn" onClick={() => changeStatus(a, STATUS.CANCELED)} aria-label={`Cancelar solicitação de ${a.name}`} title="Cancelar"><XCircle size={18} /></button>
                              : <button className="icon-btn" onClick={() => changeStatus(a, STATUS.PENDING)} aria-label={`Reativar solicitação de ${a.name}`} title="Reativar como pendente"><RotateCcw size={18} /></button>}
                            <button className="icon-btn icon-btn--danger" onClick={() => setToDelete(a)} aria-label={`Excluir solicitação de ${a.name}`} title="Excluir"><Trash2 size={18} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {detail && (
        <Modal title="Detalhes da solicitação" onClose={() => setDetail(null)}>
          <h2>Detalhes da solicitação</h2>
          <dl className="summary">
            <div><dt>Identificação</dt><dd><code>{detail.id}</code></dd></div>
            <div><dt>Status</dt><dd><span className={`status status--${detail.status}`}>{statusLabel[detail.status]}</span></dd></div>
            <div><dt>Paciente</dt><dd>{detail.name}</dd></div>
            <div><dt>Telefone</dt><dd>{detail.phone}</dd></div>
            <div><dt>E-mail</dt><dd>{detail.email || '—'}</dd></div>
            <div><dt>Tratamento</dt><dd>{detail.treatmentName}</dd></div>
            <div><dt>Profissional</dt><dd>{detail.professionalName}{detail.professionalPreference === 'any' && ' (sem preferência)'}</dd></div>
            <div><dt>Data</dt><dd>{formatLongDate(detail.date)}</dd></div>
            <div><dt>Horário</dt><dd>{detail.time}</dd></div>
            <div><dt>Observação</dt><dd>{detail.notes || '—'}</dd></div>
            <div><dt>Criada em</dt><dd>{new Date(detail.createdAt).toLocaleString('pt-BR')}</dd></div>
          </dl>
          <div className="actions">
            {detail.status === STATUS.PENDING
              ? <button className="btn btn--outline" onClick={() => changeStatus(detail, STATUS.CANCELED)}>Cancelar solicitação</button>
              : <button className="btn btn--outline" onClick={() => changeStatus(detail, STATUS.PENDING)}>Reativar como pendente</button>}
            <button className="btn btn--ghost" onClick={() => setDetail(null)}>Fechar</button>
          </div>
        </Modal>
      )}

      {toDelete && (
        <Modal title="Confirmar exclusão" onClose={() => setToDelete(null)}>
          <h2>Excluir registro?</h2>
          <p>A solicitação de <strong>{toDelete.name}</strong> será removida deste navegador. Esta ação não pode ser desfeita.</p>
          <div className="actions">
            <button className="btn btn--ghost" onClick={() => setToDelete(null)}>Manter</button>
            <button className="btn btn--danger" onClick={doDelete} disabled={busyId === toDelete.id}>
              {busyId === toDelete.id && <Loader2 className="spin" size={18} />} Excluir
            </button>
          </div>
        </Modal>
      )}
    </main>
  )
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

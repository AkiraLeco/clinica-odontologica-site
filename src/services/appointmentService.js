/**
 * Camada de serviço de agendamentos.
 *
 * Hoje persiste em localStorage (apenas demonstração — NÃO é um banco seguro).
 * Toda a interface usa SOMENTE estas funções. Para migrar para Node/Express + API REST,
 * reimplemente cada função com `fetch`, mantendo os mesmos formatos de retorno:
 *   list()           -> GET    /api/appointments
 *   create(data)     -> POST   /api/appointments
 *   setStatus(id,s)  -> PATCH  /api/appointments/:id
 *   remove(id)       -> DELETE /api/appointments/:id
 */
import { settings } from '../data/settings'

const KEY = settings.storageKey
const wait = (ms = settings.simulatedLatency) => new Promise((r) => setTimeout(r, ms))

export const STATUS = { PENDING: 'pendente', CANCELED: 'cancelado' }

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    throw new Error('Não foi possível salvar neste navegador (armazenamento indisponível).')
  }
}

const newId = () => {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `AG-${Date.now().toString(36).toUpperCase().slice(-5)}${rand}`
}

const sameSlot = (a, b) => a.date === b.date && a.time === b.time && a.professionalId === b.professionalId

export const appointmentService = {
  storageKey: KEY,

  /** Leitura síncrona (estado inicial e sincronização entre abas). */
  snapshot: read,

  async list() {
    await wait(150)
    return read()
  },

  async create(data) {
    await wait()
    const list = read()
    if (list.some((a) => a.status === STATUS.PENDING && sameSlot(a, data))) {
      throw new Error('Este horário acabou de ser reservado neste navegador. Escolha outro horário.')
    }
    const appointment = {
      id: newId(),
      name: data.name.trim(),
      phone: data.phone,
      email: data.email?.trim() || '',
      notes: data.notes?.trim() || '',
      treatmentId: data.treatmentId,
      treatmentName: data.treatmentName,
      professionalId: data.professionalId,
      professionalName: data.professionalName,
      professionalPreference: data.professionalPreference,
      date: data.date,
      time: data.time,
      status: STATUS.PENDING,
      createdAt: new Date().toISOString(),
    }
    write([...list, appointment])
    return appointment
  },

  async setStatus(id, status) {
    await wait(200)
    const list = read()
    const target = list.find((a) => a.id === id)
    if (!target) throw new Error('Solicitação não encontrada.')
    if (status === STATUS.PENDING && list.some((a) => a.id !== id && a.status === STATUS.PENDING && sameSlot(a, target))) {
      throw new Error('Já existe outra solicitação pendente neste horário.')
    }
    const next = list.map((a) => (a.id === id ? { ...a, status } : a))
    write(next)
    return next.find((a) => a.id === id)
  },

  async remove(id) {
    await wait(200)
    write(read().filter((a) => a.id !== id))
  },
}

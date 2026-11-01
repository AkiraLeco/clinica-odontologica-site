import { useCallback, useEffect, useState } from 'react'
import { appointmentService } from '../services/appointmentService'

export function useAppointments() {
  const [appointments, setAppointments] = useState(() => appointmentService.snapshot())
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setAppointments(await appointmentService.list())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === appointmentService.storageKey) setAppointments(appointmentService.snapshot())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { appointments, loading, refresh }
}

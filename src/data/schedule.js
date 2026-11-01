// Horários demonstrativos por dia da semana (0 = domingo ... 6 = sábado).
// NÃO representam disponibilidade real: não há integração com agenda oficial.
const weekday = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

export const weeklySlots = {
  0: [],
  1: weekday,
  2: weekday,
  3: weekday,
  4: weekday,
  5: weekday,
  6: ['08:00', '09:00', '10:00', '11:00'],
}

// Quantos meses à frente o calendário permite navegar.
export const maxMonthsAhead = 3

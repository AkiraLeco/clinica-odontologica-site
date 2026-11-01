export const formatPhone = (value) => {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function validatePatient({ name, phone, email }) {
  const errors = {}
  const n = name.trim()
  if (!n) errors.name = 'Informe seu nome completo.'
  else if (n.split(/\s+/).length < 2 || n.length < 5) errors.name = 'Digite nome e sobrenome.'

  const digits = phone.replace(/\D/g, '')
  if (!digits) errors.phone = 'Informe um telefone para contato.'
  else if (digits.length < 10 || digits.length > 11) errors.phone = 'Telefone inválido. Use DDD + número.'

  if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errors.email = 'E-mail inválido.'
  return errors
}

// Dados da clínica — edite livremente. Campos vazios ("") não são exibidos
// como informação real; o site mostra um aviso "a ser informado".
export const clinic = {
  name: 'Clínica Aurora',
  tagline: 'Odontologia',
  shortDescription:
    'Atendimento odontológico personalizado, com tecnologia, conforto e atenção às necessidades de cada paciente.',

  contact: {
    address: '', // ex.: 'Rua Exemplo, 123 — Bairro, Cidade/UF'
    phone: '', // ex.: '(11) 0000-0000'
    whatsapp: '', // somente números com DDI, ex.: '5511900000000'
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o atendimento da clínica.',
    email: '',
    mapUrl: '', // link do Google Maps / localização
  },

  social: {
    instagram: '', // URL completa do perfil
    facebook: '',
    linkedin: '',
  },

  // Horário de funcionamento exibido no site (informativo).
  hours: [
    { label: 'Segunda a sexta', value: '08:00 às 17:00' },
    { label: 'Sábado', value: '08:00 às 12:00' },
    { label: 'Domingo', value: 'Fechado' },
  ],

  trustItems: [
    { icon: 'heart', title: 'Atendimento personalizado' },
    { icon: 'badge', title: 'Profissionais qualificados' },
    { icon: 'home', title: 'Ambiente acolhedor' },
    { icon: 'cpu', title: 'Tecnologia odontológica' },
  ],

  about: {
    title: 'Mais do que cuidar de sorrisos, cuidamos de pessoas.',
    paragraphs: [
      'Texto de exemplo: conte aqui a história da clínica — como começou, o que a motivou e como evoluiu ao longo do tempo.',
      'Texto de exemplo: descreva a filosofia de atendimento, com foco em escuta, acolhimento e explicação clara de cada etapa do cuidado.',
    ],
    highlights: [
      { icon: 'heart', title: 'Filosofia de atendimento', text: 'Escuta atenta e explicações claras em cada etapa.' },
      { icon: 'home', title: 'Estrutura', text: 'Descreva aqui o ambiente e a estrutura da clínica.' },
      { icon: 'cpu', title: 'Diferenciais', text: 'Liste aqui os diferenciais reais da clínica.' },
      { icon: 'shield', title: 'Compromisso com o paciente', text: 'Cuidado, transparência e respeito ao seu tempo.' },
    ],
    image: { src: '', alt: 'Ambiente da clínica', label: 'Foto do ambiente da clínica' },
  },

  hero: {
    eyebrow: 'ODONTOLOGIA COM CUIDADO E TECNOLOGIA',
    title: 'Seu sorriso merece cuidado em cada detalhe.',
    description:
      'Oferecemos atendimento odontológico personalizado, com tecnologia, conforto e atenção às necessidades de cada paciente.',
    image: { src: '', alt: 'Paciente sorrindo', label: 'Foto de sorriso natural' },
  },
}

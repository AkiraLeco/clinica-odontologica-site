import { Star } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { testimonials } from '../data/testimonials'

export default function Testimonials() {
  return (
    <section id="depoimentos" className="section" aria-labelledby="dep-title">
      <div className="container">
        <SectionHeading
          center
          eyebrow="Depoimentos"
          id="dep-title"
          title="A experiência de quem confia na clínica"
          text="Conteúdo de exemplo. Cadastre depoimentos reais, com autorização, em src/data/testimonials.js."
        />
        <div className="cards">
          {testimonials.map((t, i) => (
            <Reveal as="figure" key={t.id} className="card testimonial" delay={i * 80}>
              {t.demo && <span className="badge">Exemplo demonstrativo</span>}
              <div className="stars" role="img" aria-label={`${t.rating} de 5 estrelas`}>
                {Array.from({ length: 5 }, (_, n) => (
                  <Star key={n} size={18} fill={n < t.rating ? 'currentColor' : 'none'} aria-hidden="true" />
                ))}
              </div>
              <blockquote>{t.text}</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                {t.date && <span> · {t.date}</span>}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

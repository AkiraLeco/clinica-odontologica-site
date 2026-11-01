import Accordion from '../components/Accordion'
import SectionHeading from '../components/SectionHeading'
import { faq } from '../data/faq'

export default function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container container--narrow">
        <SectionHeading center eyebrow="Perguntas frequentes" id="faq-title" title="Tire suas dúvidas" />
        <Accordion items={faq} />
      </div>
    </section>
  )
}

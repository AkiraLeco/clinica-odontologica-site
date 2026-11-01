import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className="accordion">
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div key={item.q} className={`accordion__item ${open ? 'is-open' : ''}`}>
            <h3>
              <button
                id={`faq-btn-${i}`}
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(open ? -1 : i)}
              >
                <span>{item.q}</span>
                <ChevronDown size={20} aria-hidden="true" />
              </button>
            </h3>
            <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="accordion__panel">
              <div><p>{item.a}</p></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

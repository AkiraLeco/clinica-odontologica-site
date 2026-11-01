import { useEffect } from 'react'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Treatments from '../sections/Treatments'
import Professionals from '../sections/Professionals'
import Testimonials from '../sections/Testimonials'
import Gallery from '../sections/Gallery'
import Faq from '../sections/Faq'
import Contact from '../sections/Contact'

export default function Home() {
  useEffect(() => {
    document.title = 'Clínica Aurora Odontologia'
  }, [])
  return (
    <>
      <Hero />
      <About />
      <Treatments />
      <Professionals />
      <Testimonials />
      <Gallery />
      <Faq />
      <Contact />
    </>
  )
}

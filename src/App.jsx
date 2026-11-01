import { useEffect } from 'react'
import { Route, Routes, useLocation, Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Admin from './pages/Admin'

// Rola até a âncora (#secao) ou ao topo a cada navegação.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      // aguarda a página montar
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 30)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function NotFound() {
  return (
    <main id="conteudo" className="booking">
      <div className="container container--narrow">
        <div className="booking__card success">
          <h1>Página não encontrada</h1>
          <p>O endereço acessado não existe.</p>
          <Link className="btn btn--primary" to="/">Voltar ao início</Link>
        </div>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Header />
      <Routes>
        <Route path="/" element={<main id="conteudo"><Home /></main>} />
        <Route path="/agendar" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

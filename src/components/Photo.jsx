import { Image as ImageIcon } from 'lucide-react'

// Mostra a imagem quando `src` existe; caso contrário, um espaço reservado elegante.
export default function Photo({ src, alt, label, className = '', ratio }) {
  const style = ratio ? { aspectRatio: ratio } : undefined
  if (src) {
    return <img className={`photo ${className}`} style={style} src={src} alt={alt} loading="lazy" decoding="async" />
  }
  return (
    <div className={`photo photo--placeholder ${className}`} style={style} role="img" aria-label={alt || label}>
      <ImageIcon size={28} strokeWidth={1.5} aria-hidden="true" />
      <span>{label || 'Imagem'}</span>
      <small>Substitua em src/data</small>
    </div>
  )
}

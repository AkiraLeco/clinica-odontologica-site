import {
  Activity, Anchor, Baby, BadgeCheck, Cpu, Gem, HeartHandshake, House, Layers,
  ShieldCheck, Smile, Sparkles, Stethoscope, Sun,
} from 'lucide-react'

const map = {
  activity: Activity, anchor: Anchor, baby: Baby, badge: BadgeCheck, cpu: Cpu, gem: Gem,
  heart: HeartHandshake, home: House, layers: Layers, shield: ShieldCheck, smile: Smile,
  sparkles: Sparkles, stethoscope: Stethoscope, sun: Sun,
}

export function Icon({ name, ...props }) {
  const C = map[name] || Smile
  return <C aria-hidden="true" {...props} />
}

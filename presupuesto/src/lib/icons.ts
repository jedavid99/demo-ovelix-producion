import {
  Microscope,
  Eye,
  Zap,
  Smartphone,
  Laptop,
  Settings,
  Check,
  ShieldCheck,
  Package,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  microscope: Microscope,
  eye: Eye,
  zap: Zap,
  smartphone: Smartphone,
  laptop: Laptop,
  settings: Settings,
  check: Check,
  shield: ShieldCheck,
  package: Package,
}

export function resolveIcon(name?: string): LucideIcon {
  return (name ? ICONS[name] : undefined) || Zap
}
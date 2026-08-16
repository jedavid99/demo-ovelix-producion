import {
  Microscope,
  Eye,
  Zap,
  Smartphone,
  Tablet,
  Laptop,
  Settings,
  Check,
  ShieldCheck,
  Package,
  Camera,
  Usb,
  Cpu,
  BatteryCharging,
  Monitor,
  Gamepad2,
  Watch,
  Tv,
  Headphones,
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
  camera: Camera,
  usb: Usb,
  cpu: Cpu,
  battery: BatteryCharging,
}

export function resolveIcon(name?: string): LucideIcon {
  return (name ? ICONS[name] : undefined) || Zap
}

/** Ícono por categoría del tarifario de reparación. */
export function resolveCategoryIcon(categoria?: string): LucideIcon {
  const key = (categoria || '').toLowerCase()
  if (key.includes('pantalla') || key.includes('display') || key.includes('lcd')) return Smartphone
  if (key.includes('bater')) return BatteryCharging
  if (key.includes('placa') || key.includes('board') || key.includes('chip')) return Cpu
  if (key.includes('puerto') || key.includes('pin') || key.includes('carga')) return Usb
  if (key.includes('cámara') || key.includes('camara') || key.includes('foto')) return Camera
  if (key.includes('software') || key.includes('soporte')) return Settings
  if (key.includes('notebook') || key.includes('laptop') || key.includes('pc')) return Laptop
  return Microscope
}

/** Ícono por tipo de equipo (celular, pc, consola, tablet…). */
export function resolveEquipmentIcon(tipoEquipo?: string): LucideIcon {
  const key = (tipoEquipo || '').toLowerCase()
  if (key.includes('celular') || key.includes('phone') || key.includes('smartphone')) return Smartphone
  if (key.includes('tablet')) return Tablet
  if (key.includes('note') || key.includes('laptop')) return Laptop
  if (key.includes('pc') || key.includes('escritorio') || key.includes('desktop') || key.includes('computadora')) return Monitor
  if (key.includes('consola')) return Gamepad2
  if (key.includes('smartwatch') || key.includes('reloj') || key.includes('watch')) return Watch
  if (key.includes('tv') || key.includes('televisor') || key.includes('monitor')) return Tv
  if (key.includes('audio') || key.includes('sonido')) return Headphones
  return Package
}

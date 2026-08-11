import { Power, Volume, Eye, SwitchCamera, Smartphone, Wifi, Fingerprint, Camera, Volume2, Mic, Zap, Battery } from 'lucide-react'
import { RiSimCard2Line } from 'react-icons/ri'
import type { RepairData } from '../RepairFlow'
import type { HardwareItem } from '../types/technical.types'

export const DEFAULT_REPAIR_DATA: RepairData = {
  selectedClient: null,
  deviceType: 'phone',
  brand: '',
  model: '',
  serial: '',
  aestheticCondition: '',
  accessories: [],
  issueDescription: '',
  priority: 'Normal',
  estimatedDays: 3,
  hardwareChecks: {
    power: true,
    display: true,
    wifi: false,
    bluetooth: true,
    cameras: true,
    audio: true,
  },
  securityType: 'pin',
  accessPin: '920431',
  patternDots: [true, false, false, true, true, false, false, false, true],
  patternSequence: [],
  technicianNotes: '',
  termsAccepted: false,
  signaturePad: '',
  printOption: 'both',
}

export const HARDWARE_ITEMS: HardwareItem[] = [
  { key: 'botonPawer', label: 'Botón de Power', icon: Power },
  { key: 'botonVolumen', label: 'Botón de Volumen', icon: Volume },
  { key: 'sensorProximidad', label: 'Sensor de Proximidad', icon: Eye },
  { key: 'camaraFrontal', label: 'Cámara Frontal', icon: SwitchCamera },
  { key: 'modulo', label: 'Módulo', icon: Smartphone },
  { key: 'wifi', label: 'WiFi', icon: Wifi },
  { key: 'huella', label: 'Huella', icon: Fingerprint },
  { key: 'camaraTrasera', label: 'Cámara Trasera', icon: Camera },
  { key: 'audio', label: 'Audio', icon: Volume2 },
  { key: 'altavoz', label: 'Altavoz', icon: Mic },
  { key: 'fichaCarga', label: 'Ficha de Carga', icon: Zap },
  { key: 'bateria', label: 'Batería', icon: Battery },
  { key: 'lectorSimcard', label: 'Lector de Simcard', icon: RiSimCard2Line },
]

export const SECURITY_TYPES = [
  { id: 'Ninguno', label: 'Ninguno' },
  { id: 'Pin', label: 'PIN/Pass' },
  { id: 'Patron', label: 'Patron' },
]

export const STEPS = [
  { num: 1, label: 'Cliente y Dispositivo' },
  { num: 2, label: 'Información Técnica' },
  { num: 3, label: 'Finalizar' },
]

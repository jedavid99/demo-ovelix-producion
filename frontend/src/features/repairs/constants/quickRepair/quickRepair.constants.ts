import { Smartphone, Laptop, Tablet, Watch, Headphones, Gamepad2, FileText } from 'lucide-react';

export const DEVICE_TYPES = [
  { id: 'Telefono', name: 'Telefono', icon: Smartphone },
  { id: 'laptop', name: 'Laptop/Notebook', icon: Laptop },
  { id: 'tablet', name: 'Tablet', icon: Tablet },
  { id: 'watch', name: 'Smartwatch', icon: Watch },
  { id: 'headphones', name: 'Audífonos', icon: Headphones },
  { id: 'gaming', name: 'Consola', icon: Gamepad2 },
  { id: 'other', name: 'Otro', icon: FileText },
];

export const securityOptionsByDevice: Record<string, string[]> = {
  smartphone: ['', 'pin', 'pattern', 'face_id', 'fingerprint', 'none'],
  tablet: ['', 'pin', 'pattern', 'none'],
  laptop: ['', 'pin', 'none'],
  watch: ['', 'pin', 'pattern', 'none'],
  headphones: ['', 'none'],
  gaming: ['', 'pin', 'none'],
  other: ['', 'pin', 'none'],
};

export const accessoriesByDevice: Record<string, { id: string; label: string }[]> = {
  smartphone: [
    { id: 'charger', label: 'Cargador' },
    { id: 'cable', label: 'Cable USB' },
    { id: 'case', label: 'Funda' },
    { id: 'headphones', label: 'Auriculares' },
    { id: 'box', label: 'Caja original' },
  ],
  tablet: [
    { id: 'charger', label: 'Cargador' },
    { id: 'cable', label: 'Cable' },
    { id: 'case', label: 'Funda' },
    { id: 'stylus', label: 'Stylus/Lápiz' },
    { id: 'keyboard', label: 'Teclado' },
  ],
  laptop: [
    { id: 'charger', label: 'Cargador' },
    { id: 'case', label: 'Mochila/Funda' },
    { id: 'mouse', label: 'Mouse' },
    { id: 'external_drive', label: 'Disco externo' },
  ],
  watch: [
    { id: 'charger', label: 'Cargador' },
    { id: 'strap', label: 'Correa' },
    { id: 'box', label: 'Caja' },
  ],
  headphones: [
    { id: 'case', label: 'Estuche' },
    { id: 'cable', label: 'Cable' },
    { id: 'adapter', label: 'Adaptador' },
  ],
  gaming: [
    { id: 'controller', label: 'Control' },
    { id: 'charger', label: 'Cargador' },
    { id: 'cables', label: 'Cables' },
    { id: 'games', label: 'Juegos' },
  ],
  other: [
    { id: 'cables', label: 'Cables' },
    { id: 'adapter', label: 'Adaptador' },
    { id: 'other', label: 'Otros' },
  ],
};

export const gridPoints = [
  { id: 1, x: 50, y: 50 },
  { id: 2, x: 150, y: 50 },
  { id: 3, x: 250, y: 50 },
  { id: 4, x: 50, y: 150 },
  { id: 5, x: 150, y: 150 },
  { id: 6, x: 250, y: 150 },
  { id: 7, x: 50, y: 250 },
  { id: 8, x: 150, y: 250 },
  { id: 9, x: 250, y: 250 },
];

export const SECURITY_LABELS: Record<string, string> = {
  '': 'Sin seguridad / Sin bloqueo',
  'pin': 'PIN / Contraseña',
  'pattern': 'Patrón de desbloqueo',
  'face_id': 'Face ID / Reconocimiento facial',
  'fingerprint': 'Huella digital',
  'none': 'No funciona / Olvidado',
};

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baja', border: 'border-slate-400', bg: 'bg-slate-50', selectedBg: 'bg-slate-100' },
  { value: 'medium', label: 'Media', border: 'border-blue-400', bg: 'bg-blue-50', selectedBg: 'bg-blue-100' },
  { value: 'high', label: 'Alta', border: 'border-orange-400', bg: 'bg-orange-50', selectedBg: 'bg-orange-100' },
  { value: 'critical', label: 'Urgente', border: 'border-red-500', bg: 'bg-red-50', selectedBg: 'bg-red-100' },
];

export const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'mercado_pago', label: 'Mercado Pago' },
  { value: 'cheque', label: 'Cheque' },
];

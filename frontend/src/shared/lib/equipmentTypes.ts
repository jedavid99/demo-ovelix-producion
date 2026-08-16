export interface EquipmentType {
  value: string;
  label: string;
}

export const EQUIPMENT_TYPES: EquipmentType[] = [
  { value: 'celular', label: 'Celular' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'notebook', label: 'Notebook' },
  { value: 'pc', label: 'PC de escritorio' },
  { value: 'consola', label: 'Consola de videojuegos' },
  { value: 'smartwatch', label: 'Smartwatch' },
  { value: 'tv', label: 'TV / Monitor' },
  { value: 'audio', label: 'Audio' },
  { value: 'otro', label: 'Otro equipo' },
];

export function equipmentLabel(value?: string | null): string {
  if (!value) return '';
  const found = EQUIPMENT_TYPES.find((t) => t.value === value);
  return found ? found.label : value;
}

export const DEFAULT_EQUIPMENT_TYPE = 'celular';
export interface RepairCategoryOption {
  value: string;
  label: string;
}

export const REPAIR_CATEGORIES: RepairCategoryOption[] = [
  { value: 'celular', label: 'Teléfono / Celular' },
  { value: 'smartwatch', label: 'Smartwatch' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'notebook', label: 'Notebook / Laptop' },
  { value: 'pc', label: 'PC de escritorio' },
  { value: 'consola', label: 'Consola de videojuegos' },
  { value: 'tv', label: 'TV / Monitor' },
  { value: 'audio', label: 'Audio' },
  { value: 'otro', label: 'Otro equipo' },
];
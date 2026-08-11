import type { ReactNode } from 'react';

export interface iPhone {
  id: string;
  model: string;
  color: string;
  modelNumber: string;
  storage: string;
  imei: string;
  battery: number;
  status: 'Available' | 'Reserved' | 'Sold' | 'Out of Stock';
  image: ReactNode;
}

export type StatusFilter = 'All' | 'Available' | 'Reserved' | 'Sold' | 'Out of Stock';
export type SeriesOption = 'All' | 'iPhone 15 Series' | 'iPhone 14 Series' | 'iPhone 13 Series';

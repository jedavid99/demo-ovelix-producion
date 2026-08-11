import type { ElementType } from 'react';

export interface StockItem {
  id: number;
  name: string;
  description: string;
  sku: string;
  category: string;
  quantity: number;
  status: string;
  price: number;
  icon: ElementType;
  color: string;
}

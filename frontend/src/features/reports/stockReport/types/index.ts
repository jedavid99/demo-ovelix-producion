export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  lastSale?: Date;
}

export interface CategoryData {
  name: string;
  stock: number;
  color: string;
}

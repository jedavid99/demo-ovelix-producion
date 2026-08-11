export interface ProductFormData {
  itemName: string;
  sku: string;
  category: string;
  brand: string;
  initialQuantity: string;
  minStockLevel: string;
  storageLocation: string;
  purchaseCost: string;
  sellingPrice: string;
  tax: string;
}

export interface ProductFormProps {
  form: ProductFormData;
  compatibility: string[];
  onChange: (field: string, value: string) => void;
  setCompatibility: (value: string[]) => void;
  addCompatibility: (device: string) => void;
  removeCompatibility: (device: string) => void;
  compatibilityInput: string;
  setCompatibilityInput: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

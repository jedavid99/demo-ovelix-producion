import { useState } from 'react';
import type { ProductFormData } from '../types';

const initialForm: ProductFormData = {
  itemName: '', sku: '', category: '', brand: '', initialQuantity: '',
  minStockLevel: '', storageLocation: '', purchaseCost: '', sellingPrice: '', tax: '',
};

export function useProductForm(onSubmit: (data: ProductFormData, compatibility: string[], asDraft: boolean) => void) {
  const [form, setForm] = useState<ProductFormData>(initialForm);
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [compatibilityInput, setCompatibilityInput] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addCompatibility = (device: string) => {
    const newDevice = device || compatibilityInput;
    if (newDevice && !compatibility.includes(newDevice)) {
      setCompatibility([...compatibility, newDevice]);
      setCompatibilityInput('');
    }
  };

  const removeCompatibility = (device: string) => {
    setCompatibility(compatibility.filter(d => d !== device));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCompatibility(compatibilityInput);
    }
  };

  const handleSubmit = (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();
    onSubmit(form, compatibility, asDraft);
  };

  return {
    form, compatibility, compatibilityInput, handleChange,
    setCompatibility, setCompatibilityInput,
    addCompatibility, removeCompatibility, handleKeyPress, handleSubmit,
  };
}

import React from 'react';
import { Smartphone, Settings, CheckCircle2, Cable } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { deviceCategories } from './RepairAdd.types';

interface RepairDeviceFormProps {
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  aestheticCondition: string;
  accessories: string[];
  onDeviceTypeChange: (type: string) => void;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onSerialChange: (serial: string) => void;
  onConditionChange: (condition: string) => void;
  onAccessoryToggle: (accessory: string) => void;
  onGenerateSerial: () => void;
  getAccessoriesForDevice: () => string[];
}

export const RepairDeviceForm: React.FC<RepairDeviceFormProps> = ({
  deviceType,
  brand,
  model,
  serial,
  aestheticCondition,
  accessories,
  onDeviceTypeChange,
  onBrandChange,
  onModelChange,
  onSerialChange,
  onConditionChange,
  onAccessoryToggle,
  onGenerateSerial,
  getAccessoriesForDevice,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        {/* Categoría */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 text-primary p-2 rounded-xl">
            <Smartphone size={18} />
          </div>
          <h2 className="text-base font-bold text-foreground">Categoría de Dispositivo</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {deviceCategories.map((category) => {
            const Icon = category.icon;
            const isSelected = deviceType === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onDeviceTypeChange(category.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isSelected
                    ? 'border-2 border-primary bg-primary/5 shadow-sm'
                    : 'border border-border bg-muted hover:border-primary/30 hover:bg-primary/10 hover:shadow-sm'
                }`}
              >
                <div className={`${category.bgColor} ${category.color} p-2 rounded-lg`}>
                  <Icon size={20} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Especificaciones Técnicas */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 text-primary p-2 rounded-xl">
            <Settings size={18} />
          </div>
          <h2 className="text-base font-bold text-foreground">Especificaciones Técnicas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Marca</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => onBrandChange(e.target.value)}
              placeholder="ej. Samsung, Apple..."
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Modelo</label>
            <input
              type="text"
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              placeholder="ej. Galaxy S24 Ultra..."
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              {deviceType === 'phone' ? 'IMEI' : 'Serial / Número de Serie'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={serial}
                onChange={(e) => onSerialChange(e.target.value)}
                placeholder={deviceType === 'phone' ? '15 dígitos' : '12 caracteres'}
                className="flex-1 min-w-0 px-3 py-2.5 bg-muted border border-border rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Condición y Accesorios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-muted-foreground" />
              Condición Estética
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Nuevo', 'Rayones Leves', 'Pantalla Rota', 'Desgaste Intenso'].map((condition) => (
                <button
                  key={condition}
                  onClick={() => onConditionChange(condition)}
                  className={`py-1.5 px-2 text-[10px] font-bold border rounded-lg transition-all ${
                    aestheticCondition === condition
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-border'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
          <div className="border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
              <Cable size={16} className="text-muted-foreground" />
              Accesorios Incluidos
            </h3>
            <div className="flex flex-wrap gap-1">
              {getAccessoriesForDevice().map((accessory) => (
                <button
                  key={accessory}
                  onClick={() => onAccessoryToggle(accessory)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all flex items-center gap-1 ${
                    accessories.includes(accessory)
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'bg-muted border-border text-foreground hover:border-border'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accessories.includes(accessory)}
                    onChange={() => {}}
                    className="w-3 h-3 rounded"
                  />
                  {accessory}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

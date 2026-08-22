import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useProductForm } from '../hooks/useProductForm';
import { GeneralInfoSection } from '../components/GeneralInfoSection';
import { InventorySection } from '../components/InventorySection';
import { PricingSection } from '../components/PricingSection';
import { ProductTypeSection } from '../components/ProductTypeSection';
import { ImageSection } from '../components/ImageSection';
import { BarcodeSection } from '../components/BarcodeSection';
import { NotesSection } from '../components/NotesSection';

export default function ProductAddPage() {
  const navigate = useNavigate();
  const { form, handleChange, handleSubmit, isSubmitting } = useProductForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-muted p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Agregar producto</h1>
            <p className="text-sm text-muted-foreground">Completa los datos del nuevo repuesto o producto.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/stock')} size="sm">
              <ArrowLeft size={16} className="mr-1.5" /> Volver
            </Button>
            <Button onClick={handleSubmit} size="sm" disabled={isSubmitting}>
              <Save size={16} className="mr-1.5" /> {isSubmitting ? 'Guardando...' : 'Guardar producto'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-12">
          <GeneralInfoSection form={form} onChange={handleChange} />
          <ImageSection form={form} onChange={handleChange} />
          <InventorySection form={form} onChange={handleChange} />
          <PricingSection form={form} onChange={handleChange} />
          <ProductTypeSection form={form} onChange={handleChange} />
          <BarcodeSection form={form} onChange={handleChange} />
          <NotesSection form={form} onChange={handleChange} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex items-center justify-end gap-3 pt-4 border-t border-border"
          >
            <Button type="button" variant="outline" size="sm" onClick={() => navigate('/stock')}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              <Save size={16} className="mr-1.5" /> {isSubmitting ? 'Guardando...' : 'Guardar producto'}
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/use-toast';
import { useProductForm } from '../hooks/useProductForm';
import { GeneralInfoSection } from '../components/GeneralInfoSection';
import { InventorySection } from '../components/InventorySection';
import { PricingSection } from '../components/PricingSection';
import { CompatibilitySection } from '../components/CompatibilitySection';
import { ImageSection } from '../components/ImageSection';

export default function ProductAddPage() {
  const navigate = useNavigate();

  const handleSave = (data: any, compatibility: string[], asDraft: boolean) => {
    toast({ title: asDraft ? 'Borrador guardado' : 'Éxito', description: 'Producto guardado correctamente' });
    navigate('/stock');
  };

  const {
    form, compatibility, compatibilityInput, handleChange,
    setCompatibilityInput, addCompatibility, removeCompatibility, handleKeyPress, handleSubmit,
  } = useProductForm(handleSave);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-muted  p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Agregar producto</h1>
            <p className="text-sm text-muted-foreground">Completa los detalles del nuevo repuesto o producto.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/stock')} size="sm">Cancelar</Button>
            <Button onClick={e => handleSubmit(e, false)} size="sm"><Save size={16} className="mr-2" /> Guardar</Button>
          </div>
        </div>

        <form onSubmit={e => handleSubmit(e, false)} className="space-y-4 pb-12">
          <GeneralInfoSection form={form} onChange={handleChange} />
          <InventorySection form={form} onChange={handleChange} />
          <PricingSection form={form} onChange={handleChange} />
          <CompatibilitySection
            compatibility={compatibility}
            compatibilityInput={compatibilityInput}
            onInputChange={setCompatibilityInput}
            onKeyPress={handleKeyPress}
            onAdd={addCompatibility}
            onRemove={removeCompatibility}
          />
          <ImageSection />

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.3 } } }}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border"
          >
            <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => navigate('/stock')}>
              <Trash2 size={16} className="mr-1.5" /> Descartar
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" size="sm" onClick={e => handleSubmit(e, true)}>Guardar borrador</Button>
              <Button type="submit" size="sm"><Save size={16} className="mr-1.5" /> Publicar</Button>
            </div>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}

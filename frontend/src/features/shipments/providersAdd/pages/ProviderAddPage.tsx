import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/use-toast';
import { useProviderForm } from '../hooks/useProviderForm';
import { BasicInfoSection } from '../components/BasicInfoSection';
import { ContactSection } from '../components/ContactSection';
import { CategoriesSection } from '../components/CategoriesSection';
import { AddressSection } from '../components/AddressSection';

export default function ProviderAddPage() {
  const navigate = useNavigate();

  const handleSave = (data: any) => {
    toast({ title: 'Éxito', description: 'Proveedor guardado correctamente' });
    navigate('/providers');
  };

  const { form, errors, handleChange, toggleCategory, handlePartsChange, removePart, handleSubmit } = useProviderForm(handleSave);

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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Nuevo proveedor</h1>
            <p className="text-sm text-muted-foreground">Crea un perfil de proveedor para gestionar compras y reposición.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/providers')} size="sm">Cancelar</Button>
            <Button type="submit" onClick={handleSubmit} size="sm">
              <Save size={16} className="mr-2" /> Guardar
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-12">
          <BasicInfoSection form={form} errors={errors} onChange={handleChange} />
          <ContactSection form={form} errors={errors} onChange={handleChange} />
          <CategoriesSection
            form={form}
            toggleCategory={toggleCategory}
            handlePartsChange={handlePartsChange}
            removePart={removePart}
          />
          <AddressSection form={form} errors={errors} onChange={handleChange} />

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.24, duration: 0.3 } } }}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border"
          >
            <Button variant="outline" onClick={() => navigate('/providers')} size="sm">Cancelar</Button>
            <Button type="submit" size="sm">
              <Save size={16} className="mr-2" /> Guardar proveedor
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useExpensesAdd } from './hooks/useExpensesAdd';
import { ExpensesAddHeader } from './components/ExpensesAddHeader';
import { FormFields, AmountCurrencyRow } from './components/FormFields';
import { FileUpload } from './components/FileUpload';
import { FormActions } from './components/FormActions';

export default function ExpensesAdd() {
  const {
    form, file, isLoading, errors,
    handleChange, handleFileChange, handleSubmit, navigate, setFile,
  } = useExpensesAdd();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="min-h-screen bg-muted  p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        <ExpensesAddHeader onCancel={() => navigate('/expenses')} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardContent className="p-4 md:p-6 space-y-5">
              <FormFields form={form} errors={errors} onChange={handleChange} />
              <AmountCurrencyRow form={form} errors={errors} onChange={handleChange} />
              <FileUpload file={file} onFileChange={handleFileChange} onClear={() => setFile(null)} />
            </CardContent>
          </Card>
          <FormActions isLoading={isLoading} onCancel={() => navigate('/expenses')} />
        </form>
      </div>
    </motion.div>
  );
}

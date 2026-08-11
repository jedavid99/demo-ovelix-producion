import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuickRepair } from '../../hooks/quickRepair/useQuickRepair';
import { QuickRepairFormProps } from '../../types/quickRepair/quickRepair.types';
import QuickRepairStep1 from '../../components/quickRepair/QuickRepairStep1';
import QuickRepairStep2 from '../../components/quickRepair/QuickRepairStep2';
import QuickRepairStep3 from '../../components/quickRepair/QuickRepairStep3';
import QuickRepairStep4 from '../../components/quickRepair/QuickRepairStep4';

export const QuickRepairPage: React.FC<QuickRepairFormProps> = (props) => {
  const navigate = useNavigate();
  const qr = useQuickRepair(props);

  return (
    <div className="min-h-screen   p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Nueva Reparación Rápida
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Completa los pasos para registrar una reparación</p>
        </div>

        <div className="bg-card rounded-xl shadow-md p-4 mb-5">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
                      qr.step >= s
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {qr.step > s ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s}
                  </div>
                  <span className={`mt-1 text-xs font-medium transition-colors ${qr.step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s === 1 ? 'Cliente' : s === 2 ? 'Dispositivo' : s === 3 ? 'Problema' : 'Detalles'}
                  </span>
                </div>
                {s < 4 && (
                  <div className={`flex-1 mx-2 h-1 rounded-full transition-all duration-300 ${qr.step > s ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {qr.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-destructive/10 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm"
            >
              <X className="w-4 h-4 text-destructive" />
              <span>{qr.error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-card rounded-xl shadow-md p-5 mb-5">
          <AnimatePresence mode="wait">
            {qr.step === 1 && <QuickRepairStep1 {...qr} />}
            {qr.step === 2 && <QuickRepairStep2 {...qr} />}
            {qr.step === 3 && <QuickRepairStep3 {...qr} />}
            {qr.step === 4 && <QuickRepairStep4 {...qr} />}
          </AnimatePresence>
        </div>

        <div className="flex gap-3">
          <button
            onClick={qr.step === 1 ? (props.onCancel || (() => navigate('/reparaciones/list'))) : qr.handleBack}
            className="flex-1 px-4 py-2.5 bg-card border-2 border-border text-foreground rounded-lg hover:bg-muted transition-all font-medium text-sm"
          >
            {qr.step === 1 ? 'Cancelar' : 'Atrás'}
          </button>

          {qr.step < 4 ? (
            <button
              onClick={qr.handleNext}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-medium text-sm shadow-sm flex items-center justify-center gap-1"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={qr.handleSubmit}
              disabled={qr.loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-medium text-sm shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {qr.loading ? 'Guardando...' : 'Crear'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickRepairPage;

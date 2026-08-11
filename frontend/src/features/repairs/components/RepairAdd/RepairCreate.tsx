import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useRepairCreate } from './hooks/useRepairCreate';
import { RepairAddHeader } from './RepairAddHeader';
import { ClientSelector } from './ClientSelector';
import { RepairDeviceForm } from './RepairDeviceForm';
import { RepairSecurityForm } from './RepairSecurityForm';
import { RepairDiagnosticForm } from './RepairDiagnosticForm';
import { RepairSummary } from './RepairSummary';
import { RepairPaymentForm } from './RepairPaymentForm';
import { RepairConfirmModal } from './RepairConfirmModal';
import { HelpTip } from './components/HelpTip';
import type { RepairCreateProps } from './RepairAdd.types';

export default function RepairCreate({ data, updateData, onSave = () => {}, currentStep = 1 }: RepairCreateProps) {
  const {
    state, applyUpdate, currentHardwareItems, currentSecurityOptions,
    handleHardwareToggle, functionalCount, handleGenerateSerial,
    getAccessoriesForDevice, handleAccessoryToggle,
    search, setSearch, searchResults, searching, lastClient, loadingClients,
    handleSelectClient, handleSelectLastClientWrapper, handleClearClient,
    orderStep, repairPrice, setRepairPrice, submitting,
    handleCreateOrder, handleConfirmOrder, handleBackToForm,
  } = useRepairCreate(data, updateData);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="min-h-screen bg-background">
      <main className="max-w-[1400px] mx-auto p-4 md:p-6">
        <RepairAddHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <ClientSelector
              selectedClient={state.selectedClient}
              onSelectClient={handleSelectClient}
              onClearClient={handleClearClient}
              search={search} searchResults={searchResults} searching={searching}
              lastClient={lastClient} loadingClients={loadingClients}
              onSearchChange={setSearch}
              onSelectFromSearch={handleSelectClient}
              onSelectLastClient={handleSelectLastClientWrapper}
            />

            <RepairDeviceForm
              deviceType={state.deviceType} brand={state.brand} model={state.model}
              serial={state.serial} aestheticCondition={state.aestheticCondition}
              accessories={state.accessories}
              onDeviceTypeChange={(type) => applyUpdate({ deviceType: type })}
              onBrandChange={(brand) => applyUpdate({ brand })}
              onModelChange={(model) => applyUpdate({ model })}
              onSerialChange={(serial) => applyUpdate({ serial })}
              onConditionChange={(condition) => applyUpdate({ aestheticCondition: condition })}
              onAccessoryToggle={handleAccessoryToggle}
              onGenerateSerial={handleGenerateSerial}
              getAccessoriesForDevice={getAccessoriesForDevice}
            />

            <RepairSecurityForm
              deviceType={state.deviceType} securityType={state.securityType}
              accessPin={state.accessPin} hardwareChecks={state.hardwareChecks}
              currentHardwareItems={currentHardwareItems}
              currentSecurityOptions={currentSecurityOptions}
              functionalCount={functionalCount}
              onSecurityTypeChange={(type) => applyUpdate({ securityType: type })}
              onAccessPinChange={(pin) => applyUpdate({ accessPin: pin })}
              onHardwareToggle={handleHardwareToggle}
            />

            <RepairDiagnosticForm
              issueDescription={state.issueDescription} technicianNotes={state.technicianNotes}
              priority={state.priority} estimatedDays={state.estimatedDays}
              onIssueDescriptionChange={(desc) => applyUpdate({ issueDescription: desc })}
              onTechnicianNotesChange={(notes) => applyUpdate({ technicianNotes: notes })}
              onPriorityChange={(priority) => applyUpdate({ priority })}
              onEstimatedDaysChange={(days) => applyUpdate({ estimatedDays: days })}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex justify-end">
              <Button onClick={handleCreateOrder} size="lg" className="px-8 py-5 text-base">
                <Check size={20} className="mr-2" />
                Crear Orden de Servicio
              </Button>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <RepairSummary
                selectedClient={state.selectedClient} deviceType={state.deviceType}
                brand={state.brand} model={state.model} serial={state.serial}
                hardwareChecks={state.hardwareChecks}
                currentHardwareItems={currentHardwareItems}
                orderNumber={state.orderNumber}
              />
              <RepairPaymentForm
                paymentMethod={state.paymentMethod} paymentType={state.paymentType}
                installmentsCount={state.installmentsCount}
                onPaymentMethodChange={(method) => applyUpdate({ paymentMethod: method })}
                onPaymentTypeChange={(type) => applyUpdate({ paymentType: type })}
                onInstallmentsCountChange={(count) => applyUpdate({ installmentsCount: count })}
              />
              <HelpTip />
            </div>
          </div>
        </div>

        <RepairConfirmModal
          isOpen={orderStep === 'confirm'}
          selectedClient={state.selectedClient} deviceType={state.deviceType}
          brand={state.brand} model={state.model} serial={state.serial}
          issueDescription={state.issueDescription}
          repairPrice={repairPrice} submitting={submitting}
          onBack={handleBackToForm} onConfirm={handleConfirmOrder}
          onPriceChange={setRepairPrice}
        />
      </main>
    </motion.div>
  );
}

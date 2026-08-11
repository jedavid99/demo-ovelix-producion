import React from 'react'
import { MdCheck } from 'react-icons/md'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useCanjeNew } from '../hooks/useCanjeNew'
import { STEP_LABELS } from '../constants/canje.constants'
import CanjeForm from '../components/CanjeForm'
import CanjeHistory from '../components/CanjeHistory'
import ValuationSummary from '../components/ValuationSummary'

function CanjeNewPage() {
  const {
    step,   selectedDeviceId, device, setDevice, imei, setImei,
    powerOn, setPowerOn, icloudLogout, setIcloudLogout,
    deviceColor, setDeviceColor, checks, setChecks,
    selectedNew, damages, tradeInCredit, selectedDevice,
    availableDevices, addDamage, removeDamage, clearDamages,
    handleSelectDevice, handleNext, handlePrev, handleCancel, finalize,
  } = useCanjeNew()

  return (
    <div className="space-y-6">
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0"></div>
          {[1, 2, 3].map((num) => {
            const state = num < step ? 'completed' : num === step ? 'active' : 'pending'
            return (
              <div key={num} className="relative z-10 flex flex-col items-center gap-2 bg-background px-4">
                <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors ${
                  state === 'active' ? 'bg-primary text-white border-primary' :
                  state === 'completed' ? 'bg-success text-white border-green-500' :
                  'bg-muted text-muted-foreground border-muted'
                }`}>
                  {state === 'completed' ? <MdCheck size={12} /> : num}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  state === 'active' ? 'text-primary' :
                  state === 'completed' ? 'text-success' :
                  'text-muted-foreground'
                }`}>
                  {STEP_LABELS[num]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {step === 1 && 'Identificación del Dispositivo'}
          {step === 2 && 'Evaluación del Dispositivo'}
          {step === 3 && 'Resumen Final'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {step === 1 && 'Paso 1: Identifique el iPhone actual del cliente y su estado básico.'}
          {step === 2 && 'Paso 2: Evalúe la condición física y la salud de la batería.'}
          {step === 3 && 'Paso 3: Revise y confirme la transacción de canje.'}
        </p>
      </div>
      {step === 1 && (
        <>
          <CanjeForm
            devices={availableDevices} selectedDeviceId={selectedDeviceId}
            device={device} imei={imei} powerOn={powerOn} icloudLogout={icloudLogout}
            deviceColor={deviceColor} selectedDevice={selectedDevice}
            onSelectDevice={handleSelectDevice} onImeiChange={setImei}
            onPowerChange={setPowerOn} onIcloudChange={setIcloudLogout}
            onStorageChange={(v) => setDevice(d => ({ ...d, storage: v }))}
            onColorChange={setDeviceColor}
          />
          {selectedDeviceId && (
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={handleCancel} className="w-full">
                <X size={16} className="mr-2" />Cancelar
              </Button>
              <Button onClick={handleNext} className="w-full" size="lg">
                Siguiente Paso<ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
      {step === 2 && (
        <CanjeHistory
          device={device} checks={checks} damages={damages} tradeInCredit={tradeInCredit}
          onBatteryChange={(v) => setDevice(d => ({ ...d, battery: v }))}
          onCheckToggle={(key) => setChecks(c => ({ ...c, [key]: !c[key] }))}
          onAddDamage={addDamage} onRemoveDamage={removeDamage}
          onClearDamages={clearDamages}
        />
      )}
      {step === 3 && (
        <ValuationSummary
          device={device} deviceColor={deviceColor} checks={checks}
          tradeInCredit={tradeInCredit} selectedNew={selectedNew}
          onFinalize={finalize} onEdit={() => {}} onCancel={handleCancel}
        />
      )}
      {step > 1 && step < 3 && (
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={handlePrev} className="flex-1">
            <ArrowLeft size={16} className="mr-2" />Anterior
          </Button>
          <Button onClick={handleNext} className="flex-[2]">
            Siguiente Paso<ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default CanjeNewPage
export { CanjeNewPage as CanjeNew }

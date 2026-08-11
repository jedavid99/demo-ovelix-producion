import React from 'react'
import { MdCheck, MdBuild } from 'react-icons/md'
import { useTechnical } from '../hooks/useTechnical'
import TechnicalDetails from '../components/TechnicalDetails'
import TechnicianAssignment from '../components/TechnicianAssignment'
import TechnicalDiagnostics from '../components/TechnicalDiagnostics'
import TechnicalActions from '../components/TechnicalActions'
import TechnicalTicketSummary from '../components/TechnicalTicketSummary'
import { HARDWARE_ITEMS, STEPS } from '../constants/technical.constants'
import type { RepairTechnicalProps } from '../types/technical.types'

function TechnicalPage({ data, updateData, onNext, onBack, currentStep = 2 }: RepairTechnicalProps) {
  const {
    state, applyUpdate, handleHardwareToggle, functionalCount,
    localDots, canvasRef, startDraw, enterDot, endDraw, clearPattern,
    patternSequence, safeOnNext, safeOnBack,
  } = useTechnical({ data, updateData, onNext, onBack, currentStep })

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1400px] mx-auto p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Información Técnica</h1>
            <p className="text-muted-foreground text-sm">Paso 2: Información Técnica y Seguridad</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className={`flex items-center gap-2 opacity-${currentStep >= step.num ? '100' : '40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep > step.num
                      ? 'bg-primary/10 text-primary'
                      : currentStep === step.num
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.num ? <MdCheck size={12} /> : step.num}
                  </div>
                  <span className={`text-sm font-semibold ${
                    currentStep >= step.num ? 'text-foreground' : 'text-muted-foreground'
                  }`}>{step.label}</span>
                </div>
                {idx < STEPS.length - 1 && <div className="w-8 h-px bg-border" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <TechnicalDetails hardwareChecks={state.hardwareChecks} onToggle={handleHardwareToggle} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TechnicianAssignment
                securityType={state.securityType} accessPin={state.accessPin}
                localDots={localDots} canvasRef={canvasRef}
                patternSequence={patternSequence}
                onStartDraw={startDraw} onEnterDot={enterDot}
                onEndDraw={endDraw} onClearPattern={clearPattern}
                onUpdate={applyUpdate}
              />
              <TechnicalDiagnostics technicianNotes={state.technicianNotes} onUpdate={applyUpdate} />
            </div>
            <TechnicalActions onNext={safeOnNext} onBack={safeOnBack} />
          </div>
          <div className="lg:col-span-4">
            <TechnicalTicketSummary
              selectedClient={state.selectedClient} brand={state.brand}
              model={state.model} serial={state.serial}
              functionalCount={functionalCount} totalHardwareItems={HARDWARE_ITEMS.length}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default TechnicalPage
export { TechnicalPage as Technical }

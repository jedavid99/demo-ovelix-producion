import React from 'react'
import { RefreshCw, LogOut } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useSimpleCodeGenerator } from '../hooks/useSimpleCodeGenerator'
import CodeStats from '../components/CodeStats'
import CodeGeneratorForm from '../components/CodeGeneratorForm'
import CodeList from '../components/CodeList'
import CodeFilters from '../components/CodeFilters'
import logo from '/ovelix-claro.png'

function SimpleCodeGeneratorPage() {
  const {
    isChecking, isLoggedIn, codes, newCode, isGenerating,
    copiedCode, showDeleteConfirm, setShowDeleteConfirm,
    selectedPlan, setSelectedPlan, companyData, setCompanyData,
    stats, handleGenerateCode, handleCopyCode, handleDeleteCode, handleLogout,
  } = useSimpleCodeGenerator()

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) return null

  return (
    <main className="min-h-screen bg-background text-primary">
      <header className="bg-card border-b border-border/60 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ovelix" loading="lazy" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="text-xl font-bold text-primary">Generador de Códigos</h1>
              <p className="text-xs text-muted-foreground">Códigos de Activación</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />Salir
          </Button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-6">
        <CodeStats stats={stats} />
        <CodeGeneratorForm
          selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan}
          companyData={companyData} setCompanyData={setCompanyData}
          isGenerating={isGenerating} newCode={newCode} copiedCode={copiedCode}
          onGenerate={handleGenerateCode} onCopy={handleCopyCode}
        />
        <CodeFilters />
        <CodeList
          codes={codes} copiedCode={copiedCode}
          onCopy={handleCopyCode} onDelete={setShowDeleteConfirm}
        />

        <ConfirmDialog
          open={showDeleteConfirm !== null}
          onOpenChange={(open) => { if (!open) setShowDeleteConfirm(null); }}
          title="Eliminar código"
          description="¿Estás seguro de que deseas eliminar este código?"
          onConfirm={() => {
            if (showDeleteConfirm) handleDeleteCode(showDeleteConfirm);
          }}
        />
      </div>
    </main>
  )
}

export default SimpleCodeGeneratorPage
export { SimpleCodeGeneratorPage as SimpleCodeGenerator }

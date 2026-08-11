import { useActivationCodes } from './hooks/useActivationCodes';
import { CheckingState } from './components/CheckingState';
import { AdminHeader } from './components/AdminHeader';
import { StatsCards } from './components/StatsCards';
import { GenerateCodeSection } from './components/GenerateCodeSection';
import { CodeList } from './components/CodeList';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

export default function AdminActivationCodes() {
  const {
    isAdmin, isChecking, codes, newCode, isGenerating, copiedCode, showDeleteConfirm,
    generateCode, copyCode, deleteCode, handleLogout, setShowDeleteConfirm,
  } = useActivationCodes();

  if (isChecking) return <CheckingState />;
  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AdminHeader onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto p-6">
        <StatsCards codes={codes} />
        <GenerateCodeSection
          isGenerating={isGenerating} newCode={newCode} copiedCode={copiedCode}
          onGenerate={generateCode} onCopy={copyCode}
        />
        <CodeList
          codes={codes} copiedCode={copiedCode}
          onCopy={copyCode} onDelete={setShowDeleteConfirm}
        />

        <ConfirmDialog
          open={showDeleteConfirm !== null}
          onOpenChange={(open) => { if (!open) setShowDeleteConfirm(null); }}
          title="Eliminar código"
          description="¿Estás seguro de que deseas eliminar este código?"
          onConfirm={() => {
            if (showDeleteConfirm) deleteCode(showDeleteConfirm);
          }}
        />
      </div>
    </main>
  );
}

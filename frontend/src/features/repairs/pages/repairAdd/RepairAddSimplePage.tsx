import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useRepairAddForm } from '../../hooks/repairAdd/useRepairAddForm';
import { LastClientCard } from '../../components/repairAddSimple/LastClientCard';
import { SelectedClientBanner } from '../../components/repairAddSimple/SelectedClientBanner';
import { ClientSearch } from '../../components/repairAddSimple/ClientSearch';
import { RepairForm } from '../../components/repairAddSimple/RepairForm';

export default function RepairAddSimplePage() {
  const { form, loading, submitting, lastClient, selectedClient, searchQuery, searchResults, searching, setSearchQuery, handleSelectClient, handleSelectLastClient, handleChangeClient, handleCancel, onSubmit } = useRepairAddForm();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} className="shrink-0" aria-label="Cancelar"><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nueva Reparación</h1>
            <p className="text-sm text-muted-foreground">Registro de orden de servicio</p>
          </div>
        </div>
        <LastClientCard loading={loading} lastClient={lastClient} selectedClientId={selectedClient?.id} onSelect={handleSelectLastClient} />
        {selectedClient && <SelectedClientBanner client={selectedClient} onChange={handleChangeClient} />}
        {!selectedClient && <ClientSearch query={searchQuery} searching={searching} results={searchResults} onQueryChange={(e) => setSearchQuery(e.target.value)} onSelect={handleSelectClient} />}
        {selectedClient && <RepairForm form={form} submitting={submitting} onSubmit={onSubmit} onCancel={handleCancel} />}
      </div>
    </div>
  );
}

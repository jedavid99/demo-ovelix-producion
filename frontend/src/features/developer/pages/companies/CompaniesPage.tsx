import React from 'react'
import { Plus } from 'lucide-react'
import { useCompanies } from '../../hooks/companies/useCompanies'
import CompaniesTable from '../../components/companies/CompaniesTable'
import CompanyDetailsModal from '../../components/companies/CompanyDetailsModal'
import CreateCompanyModal from '../../components/companies/CreateCompanyModal'
import SendTemplateModal from '../../components/companies/SendTemplateModal'
import { LoadingState } from '@/shared/components/async/LoadingState'
import { ErrorState } from '@/shared/components/async/ErrorState'

function CompaniesPage() {
  const {
    companies, loading, loadError,
    showModal, setShowModal,
    selectedCompany, setSelectedCompany, companyUsers, loadingUsers,
    showSendTemplateModal, setShowSendTemplateModal,
    templates, whatsappTemplates,
    selectedTemplate, setSelectedTemplate,
    selectedWhatsAppTemplate, setSelectedWhatsAppTemplate,
    selectedUsers, sending,
    handleCreateCompany, handleToggleActive,
    handleViewDetails, handleToggleUserActive,
    handleOpenSendTemplate, handleSendTemplate,
    handleToggleUserSelection,
    loadCompanies,
  } = useCompanies()

  if (loading) {
    return <LoadingState label="Cargando empresas..." />
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <ErrorState message={loadError} onRetry={loadCompanies} className="!py-4" />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestionar Empresas</h2>
          <p className="text-sm text-muted-foreground mt-1">Administra las empresas registradas en el sistema</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nueva Empresa</span>
        </button>
      </div>
      <CompaniesTable
        companies={companies}
        onViewDetails={handleViewDetails}
        onToggleActive={handleToggleActive}
        onSendTemplate={handleOpenSendTemplate}
        onAddNew={() => setShowModal(true)}
      />
      {showModal && (
        <CreateCompanyModal onClose={() => setShowModal(false)} onSubmit={handleCreateCompany} nextCode={companies.length + 1} />
      )}
      {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany} users={companyUsers} loadingUsers={loadingUsers}
          onToggleUserActive={handleToggleUserActive} onClose={() => setSelectedCompany(null)}
        />
      )}
      {showSendTemplateModal && selectedCompany && (
        <SendTemplateModal
          company={selectedCompany} users={companyUsers}
          templates={templates} whatsappTemplates={whatsappTemplates}
          selectedTemplate={selectedTemplate} selectedWhatsAppTemplate={selectedWhatsAppTemplate}
          selectedUsers={selectedUsers} sending={sending}
          onSelectTemplate={setSelectedTemplate} onSelectWhatsAppTemplate={setSelectedWhatsAppTemplate}
          onToggleUser={handleToggleUserSelection} onSend={handleSendTemplate}
          onClose={() => setShowSendTemplateModal(false)}
        />
      )}
    </div>
  )
}

export default CompaniesPage
export { CompaniesPage as Companies }

import React from 'react'
import { Building2, Plus, Check, X, Mail } from 'lucide-react'
import type { Company } from '../../types/companies/companies.types'
import { EmptyState } from '@/shared/components/async/EmptyState'

interface CompaniesTableProps {
  companies: Company[]
  onViewDetails: (company: Company) => void
  onToggleActive: (id: string, active: boolean) => void
  onSendTemplate: (company: Company) => void
  onAddNew: () => void
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies, onViewDetails, onToggleActive, onSendTemplate, onAddNew,
}) => {
  if (companies.length === 0) {
    return <EmptyState icon={Building2} title="No hay empresas registradas" />
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
        <thead className="bg-muted border-b border-border sticky top-0">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Código</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rubro</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuarios</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clientes</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reparaciones</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-muted">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{company.codigo_empresa}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{company.razon_social}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{company.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  company.tipo_plan === 'demo' ? 'bg-green-100 text-green-800'
                    : company.plan_seleccionado === 'basico' ? 'bg-primary/10 text-blue-800'
                    : company.plan_seleccionado === 'premium' ? 'bg-purple-100 text-purple-800'
                    : company.plan_seleccionado === 'oro' ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-muted text-foreground'
                }`}>
                  {company.tipo_plan === 'demo' ? 'Demo' : company.plan_seleccionado || '-'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  company.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {company.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{company._count.users}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{company._count.clients}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{company._count.repairs}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button onClick={() => onSendTemplate(company)}
                    className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-colors" title="Enviar plantillas">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button onClick={() => onViewDetails(company)}
                    className="p-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors" title="Ver detalles">
                    <Building2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onToggleActive(company.id, company.activo)}
                    className={`p-1.5 rounded-lg transition-colors ${company.activo ? 'text-destructive hover:bg-destructive/10' : 'text-success hover:bg-success/10'}`}
                    title={company.activo ? 'Desactivar' : 'Activar'}
                  >
                    {company.activo ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompaniesTable

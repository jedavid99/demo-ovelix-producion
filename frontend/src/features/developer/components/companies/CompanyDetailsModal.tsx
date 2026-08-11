import React from 'react'
import { createPortal } from 'react-dom'
import { Building2, X, Check } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'

const CompanyDetailsModal: React.FC<any> = ({ company, users, loadingUsers, onToggleUserActive, onClose }) => {
  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-card rounded-xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card px-6 py-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">{company.codigo_empresa}</h3>
              <p className="text-xs text-muted-foreground">{company.razon_social}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Datos generales</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Código', value: company.codigo_empresa },
                { label: 'Razón Social', value: company.razon_social },
                { label: 'CUIT', value: company.cuit_cuil || '—' },
                { label: 'Email', value: company.email || '—' },
                { label: 'Teléfono', value: company.telefono || '—' },
                { label: 'Estado', value: company.activo ? 'Activo' : 'Inactivo', badge: true, active: company.activo },
                { label: 'Plan', value: company.tipo_plan === 'demo' ? 'Demo' : company.plan_seleccionado || 'Sin plan' },
                { label: 'Creación', value: new Date(company.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) },
              ].map((item, i) => (
                <div key={i} className="bg-muted rounded-lg p-3">
                  <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{item.label}</label>
                  {item.badge ? (
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.value}
                    </span>
                  ) : (
                    <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Estadísticas</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Usuarios', value: company._count.users },
                { label: 'Clientes', value: company._count.clients },
                { label: 'Reparaciones', value: company._count.repairs },
              ].map((item, i) => (
                <div key={i} className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Usuarios ({users.length})</h4>
            {loadingUsers ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Cargando...</p>
              </div>
            ) : users.length === 0 ? (
              <EmptyState title="No hay usuarios" className="!py-8 bg-muted rounded-lg" />
            ) : (
              <div className="bg-muted rounded-lg overflow-hidden border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Usuario</th>
                        <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                        <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Rol</th>
                        <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-2 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-xs">
                                {user.nombre?.charAt(0) || '?'}{user.apellido?.charAt(0) || '?'}
                              </div>
                              <span className="font-medium text-foreground text-xs">{user.nombre} {user.apellido}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-muted-foreground">{user.email}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              typeof user.rol === 'string'
                                ? user.rol === 'DESARROLLADOR' ? 'bg-purple-100 text-purple-700'
                                  : user.rol === 'ADMIN' ? 'bg-primary/10 text-primary'
                                  : user.rol === 'TECNICO' ? 'bg-green-100 text-green-700'
                                  : 'bg-muted text-muted-foreground'
                                : user.rol?.name === 'DESARROLLADOR' ? 'bg-purple-100 text-purple-700'
                                  : user.rol?.name === 'ADMIN' ? 'bg-primary/10 text-primary'
                                  : user.rol?.name === 'TECNICO' ? 'bg-green-100 text-green-700'
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              {typeof user.rol === 'string' ? user.rol : user.rol?.name || user.rol}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${user.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.activo ? 'bg-success' : 'bg-destructive/100'}`} />
                              {user.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-right">
                            <button onClick={() => onToggleUserActive(user.id, user.activo)}
                              className={`p-1.5 rounded-lg transition-colors ${user.activo ? 'text-destructive hover:bg-destructive/10' : 'text-success hover:bg-success/10'}`}
                              title={user.activo ? 'Desactivar' : 'Activar'}
                            >
                              {user.activo ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CompanyDetailsModal

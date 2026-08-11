import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Mail, MessageSquare, Loader2 } from 'lucide-react'

const SendTemplateModal: React.FC<any> = ({
  company, users, templates, whatsappTemplates,
  selectedTemplate, selectedWhatsAppTemplate, selectedUsers, sending,
  onSelectTemplate, onSelectWhatsAppTemplate, onToggleUser, onSend, onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email')

  const welcomeTemplates = templates.filter((t: any) => t.type === 'welcome')
  const paymentReminderTemplates = templates.filter((t: any) => t.type === 'payment_reminder')
  const whatsappPaymentTemplates = whatsappTemplates.filter((t: any) => t.type === 'whatsapp_payment_reminder')

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <div className="bg-card rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Enviar Plantillas</h3>
              <p className="text-sm text-muted-foreground">{company.razon_social}</p>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-muted-foreground">✕</button>
          </div>
          <div className="flex space-x-4 mb-6 border-b border-border">
            <button onClick={() => setActiveTab('email')}
              className={`pb-3 px-1 text-sm font-medium ${activeTab === 'email' ? 'text-primary border-b-2 border-blue-600' : 'text-muted-foreground hover:text-foreground'}`}>
              <Mail className="w-4 h-4 inline mr-1" />Email
            </button>
            <button onClick={() => setActiveTab('whatsapp')}
              className={`pb-3 px-1 text-sm font-medium ${activeTab === 'whatsapp' ? 'text-success border-b-2 border-green-600' : 'text-muted-foreground hover:text-foreground'}`}>
              <MessageSquare className="w-4 h-4 inline mr-1" />WhatsApp
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {activeTab === 'email' ? 'Seleccionar Plantilla de Email' : 'Seleccionar Plantilla de WhatsApp'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeTab === 'email' ? (
                  <>
                    {welcomeTemplates.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Bienvenida</p>
                        {welcomeTemplates.map((template: any) => (
                          <button key={template.id} onClick={() => onSelectTemplate(template)}
                            className={`w-full text-left p-3 rounded-lg border ${selectedTemplate?.id === template.id ? 'border-blue-500 bg-primary/5' : 'border-border hover:border-border'}`}>
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.subject}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    {paymentReminderTemplates.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Recordatorio de Pago</p>
                        {paymentReminderTemplates.map((template: any) => (
                          <button key={template.id} onClick={() => onSelectTemplate(template)}
                            className={`w-full text-left p-3 rounded-lg border ${selectedTemplate?.id === template.id ? 'border-blue-500 bg-primary/5' : 'border-border hover:border-border'}`}>
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.subject}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    {welcomeTemplates.length === 0 && paymentReminderTemplates.length === 0 && (
                      <div className="col-span-2 p-4 text-center text-sm text-muted-foreground border border-border rounded-lg">
                        No hay plantillas de email disponibles. Crea plantillas en la sección de Plantillas.
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {whatsappPaymentTemplates.length > 0 ? (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Recordatorio de Pago</p>
                        {whatsappPaymentTemplates.map((template: any) => (
                          <button key={template.id} onClick={() => onSelectWhatsAppTemplate(template)}
                            className={`w-full text-left p-3 rounded-lg border ${selectedWhatsAppTemplate?.id === template.id ? 'border-green-500 bg-green-50' : 'border-border hover:border-border'}`}>
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{template.message}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="col-span-2 p-4 text-center text-sm text-muted-foreground border border-border rounded-lg">
                        No hay plantillas de WhatsApp disponibles. Crea plantillas en la sección de Plantillas.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Seleccionar Usuarios ({selectedUsers.length} seleccionados)
              </label>
              <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                {users.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No hay usuarios en esta empresa</div>
                ) : (
                  <div className="divide-y divide-border">
                    {users.map((user: any) => (
                      <label key={user.id} className="flex items-center p-3 hover:bg-muted cursor-pointer">
                        <input type="checkbox" checked={selectedUsers.includes(user.id)}
                          onChange={() => onToggleUser(user.id)} className="rounded border-border text-primary focus:ring-ring" />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-foreground">{user.nombre} {user.apellido}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <button onClick={onClose} disabled={sending}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors disabled:opacity-50 text-sm">
                Cancelar
              </button>
              <button onClick={onSend}
                disabled={sending || (!selectedTemplate && !selectedWhatsAppTemplate) || selectedUsers.length === 0}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                {sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Enviando...</span></>
                ) : (
                  <><Mail className="w-4 h-4" /><span>Enviar Mensajes</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default SendTemplateModal

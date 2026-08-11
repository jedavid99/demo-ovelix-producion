import React from 'react';
import { Mail, MessageSquare, FileText, Plus, Search, Inbox } from 'lucide-react';
import { useTemplates } from '../../hooks/templates/useTemplates';
import TemplateCard from '../../components/templates/TemplateCard';
import { CreateEmailModal, CreateWhatsAppModal } from '../../components/templates/CreateModals';
import { EditEmailModal, EditWhatsAppModal } from '../../components/templates/EditModals';
import { EmailPreviewModal, WhatsAppPreviewModal } from '../../components/templates/PreviewModals';
import VariablesSection from '../../components/templates/VariablesSection';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { EmptyState } from '@/shared/components/async/EmptyState';

export default function TemplatesPage() {
  const t = useTemplates();

  if (t.loading) {
    return <LoadingState label="Cargando plantillas..." />;
  }

  if (t.error) {
    return <ErrorState message={t.error} onRetry={() => t.fetchTemplates()} />;
  }

  const filteredEmails = t.filterTemplates(t.templates);
  const filteredWhatsapp = t.filterTemplates(t.whatsappTemplates);
  const filteredPages = t.filterTemplates(t.pageTemplates);

  return (
    <div className="space-y-8">
      <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Plantillas</h2>
              <p className="text-sm text-muted-foreground">Gestiona todas las plantillas de comunicación y páginas del sistema</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar plantilla..."
                  aria-label="Buscar plantilla"
                  value={t.searchTerm}
                  onChange={(e) => t.setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                <Plus className="w-4 h-4" />
                <span>Nueva</span>
              </button>
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Correos Electrónicos
                </h3>
                <p className="text-sm text-muted-foreground">Plantillas para envío de correos automáticos</p>
              </div>
              <button onClick={() => t.setShowCreateEmailModal(true)} className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors">
                <Plus className="w-4 h-4" /><span>Nueva</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEmails.length === 0 ? (
                <div className="md:col-span-2">
                  <EmptyState icon={Inbox} title="No hay plantillas de correo" description="Creá tu primera plantilla para envíos automáticos." />
                </div>
              ) : (
                filteredEmails.map((template: any) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    iconType="email"
                    onPreview={() => t.setPreviewTemplate(template)}
                    onEdit={() => t.openEditEmailModal(template)}
                  />
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-success" />
                  WhatsApp
                </h3>
                <p className="text-sm text-muted-foreground">Mensajes automatizados para comunicaciones por WhatsApp</p>
              </div>
              <button onClick={() => t.setShowCreateWhatsAppModal(true)} className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <Plus className="w-4 h-4" /><span>Nueva</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWhatsapp.length === 0 ? (
                <div className="md:col-span-2">
                  <EmptyState icon={Inbox} title="No hay plantillas de WhatsApp" description="Creá tu primera plantilla para mensajes automatizados." />
                </div>
              ) : (
                filteredWhatsapp.map((template: any) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    iconType="whatsapp"
                    onPreview={() => t.setPreviewWhatsApp(template)}
                    onEdit={() => t.openEditWhatsAppModal(template)}
                  />
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  Páginas del Sistema
                </h3>
                <p className="text-sm text-muted-foreground">Páginas especiales (404, fin de prueba, fin de suscripción, recordatorio de pago)</p>
              </div>
              <button className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg hover:bg-muted transition-colors">
                <Plus className="w-4 h-4" /><span>Nueva</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPages.length === 0 ? (
                <div className="md:col-span-2">
                  <EmptyState icon={Inbox} title="No hay páginas del sistema" description="No hay páginas especiales configuradas." />
                </div>
              ) : (
                filteredPages.map((template: any) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    iconType="page"
                    onPreview={() => window.open(template.path, '_blank')}
                    onEdit={() => window.open(template.path, '_blank')}
                  />
                ))
              )}
            </div>
          </section>

          {t.previewTemplate && (
            <EmailPreviewModal template={t.previewTemplate} onClose={() => t.setPreviewTemplate(null)} />
          )}
          {t.previewWhatsApp && (
            <WhatsAppPreviewModal template={t.previewWhatsApp} onClose={() => t.setPreviewWhatsApp(null)} />
          )}

          {t.showCreateEmailModal && (
            <CreateEmailModal
              newEmailTemplate={t.newEmailTemplate}
              setNewEmailTemplate={t.setNewEmailTemplate}
              onClose={() => t.setShowCreateEmailModal(false)}
              onCreate={t.handleCreateEmailTemplate}
            />
          )}
          {t.showCreateWhatsAppModal && (
            <CreateWhatsAppModal
              newWhatsAppTemplate={t.newWhatsAppTemplate}
              setNewWhatsAppTemplate={t.setNewWhatsAppTemplate}
              onClose={() => t.setShowCreateWhatsAppModal(false)}
              onCreate={t.handleCreateWhatsAppTemplate}
            />
          )}

          {t.showEditEmailModal && t.editingTemplate && (
            <EditEmailModal
              editingTemplate={t.editingTemplate}
              setEditingTemplate={t.setEditingTemplate}
              onClose={() => t.setShowEditEmailModal(false)}
              onSave={t.handleUpdateEmailTemplate}
            />
          )}
          {t.showEditWhatsAppModal && t.editingWhatsApp && (
            <EditWhatsAppModal
              editingWhatsApp={t.editingWhatsApp}
              setEditingWhatsApp={t.setEditingWhatsApp}
              onClose={() => t.setShowEditWhatsAppModal(false)}
              onSave={t.handleUpdateWhatsAppTemplate}
            />
          )}

          <VariablesSection />
      </>
    </div>
  );
}

import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import type { EmailTemplate, WhatsAppTemplate } from '../../types/templates/templates.types';

interface EditEmailModalProps {
  editingTemplate: EmailTemplate;
  setEditingTemplate: React.Dispatch<React.SetStateAction<EmailTemplate | null>>;
  onClose: () => void;
  onSave: () => void;
}

interface EditWhatsAppModalProps {
  editingWhatsApp: WhatsAppTemplate;
  setEditingWhatsApp: React.Dispatch<React.SetStateAction<WhatsAppTemplate | null>>;
  onClose: () => void;
  onSave: () => void;
}

export const EditEmailModal: React.FC<EditEmailModalProps> = ({ editingTemplate, setEditingTemplate, onClose, onSave }) => (
  <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Editar Plantilla de Email</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-tpl-name" className="block text-sm font-medium text-foreground mb-1">Nombre</label>
          <input id="edit-tpl-name" type="text" value={editingTemplate.name} onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="edit-tpl-type" className="block text-sm font-medium text-foreground mb-1">Tipo</label>
          <select id="edit-tpl-type" value={editingTemplate.type} onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value as any })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="welcome">Bienvenida</option>
            <option value="password_reset">Recuperación de Contraseña</option>
            <option value="trial_end">Fin de Prueba</option>
            <option value="subscription_end">Fin de Suscripción</option>
            <option value="payment_reminder">Recordatorio de Pago</option>
          </select>
        </div>
        <div>
          <label htmlFor="edit-tpl-subject" className="block text-sm font-medium text-foreground mb-1">Asunto</label>
          <input id="edit-tpl-subject" type="text" value={editingTemplate.subject} onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="edit-tpl-body" className="block text-sm font-medium text-foreground mb-1">Cuerpo del Email</label>
          <textarea id="edit-tpl-body" value={editingTemplate.body} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })} rows={6} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave}>Guardar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const EditWhatsAppModal: React.FC<EditWhatsAppModalProps> = ({ editingWhatsApp, setEditingWhatsApp, onClose, onSave }) => (
  <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Editar Plantilla de WhatsApp</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-wa-name" className="block text-sm font-medium text-foreground mb-1">Nombre</label>
          <input id="edit-wa-name" type="text" value={editingWhatsApp.name} onChange={(e) => setEditingWhatsApp({ ...editingWhatsApp, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="edit-wa-type" className="block text-sm font-medium text-foreground mb-1">Tipo</label>
          <select id="edit-wa-type" value={editingWhatsApp.type} onChange={(e) => setEditingWhatsApp({ ...editingWhatsApp, type: e.target.value as any })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="whatsapp_trial_end">Fin de Prueba</option>
            <option value="whatsapp_subscription_end">Fin de Suscripción</option>
            <option value="whatsapp_payment_reminder">Recordatorio de Pago</option>
          </select>
        </div>
        <div>
          <label htmlFor="edit-wa-message" className="block text-sm font-medium text-foreground mb-1">Mensaje</label>
          <textarea id="edit-wa-message" value={editingWhatsApp.message} onChange={(e) => setEditingWhatsApp({ ...editingWhatsApp, message: e.target.value })} rows={6} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave}>Guardar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

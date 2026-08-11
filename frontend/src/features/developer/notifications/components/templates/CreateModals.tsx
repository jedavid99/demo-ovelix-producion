import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface CreateEmailModalProps {
  newEmailTemplate: { name: string; subject: string; body: string; type: string; variables: string[] };
  setNewEmailTemplate: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onCreate: () => void;
}

interface CreateWhatsAppModalProps {
  newWhatsAppTemplate: { name: string; message: string; type: string; variables: string[] };
  setNewWhatsAppTemplate: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onCreate: () => void;
}

export const CreateEmailModal: React.FC<CreateEmailModalProps> = ({ newEmailTemplate, setNewEmailTemplate, onClose, onCreate }) => (
  <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Crear Plantilla de Email</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label htmlFor="new-tpl-name" className="block text-sm font-medium text-foreground mb-1">Nombre</label>
          <input id="new-tpl-name" type="text" value={newEmailTemplate.name} onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="new-tpl-type" className="block text-sm font-medium text-foreground mb-1">Tipo</label>
          <select id="new-tpl-type" value={newEmailTemplate.type} onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, type: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="welcome">Bienvenida</option>
            <option value="password_reset">Recuperación de Contraseña</option>
            <option value="trial_end">Fin de Prueba</option>
            <option value="subscription_end">Fin de Suscripción</option>
            <option value="payment_reminder">Recordatorio de Pago</option>
          </select>
        </div>
        <div>
          <label htmlFor="new-tpl-subject" className="block text-sm font-medium text-foreground mb-1">Asunto</label>
          <input id="new-tpl-subject" type="text" value={newEmailTemplate.subject} onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, subject: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="new-tpl-body" className="block text-sm font-medium text-foreground mb-1">Cuerpo del Email</label>
          <textarea id="new-tpl-body" value={newEmailTemplate.body} onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, body: e.target.value })} rows={6} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onCreate}>Crear</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const CreateWhatsAppModal: React.FC<CreateWhatsAppModalProps> = ({ newWhatsAppTemplate, setNewWhatsAppTemplate, onClose, onCreate }) => (
  <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Crear Plantilla de WhatsApp</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label htmlFor="new-wa-name" className="block text-sm font-medium text-foreground mb-1">Nombre</label>
          <input id="new-wa-name" type="text" value={newWhatsAppTemplate.name} onChange={(e) => setNewWhatsAppTemplate({ ...newWhatsAppTemplate, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="new-wa-type" className="block text-sm font-medium text-foreground mb-1">Tipo</label>
          <select id="new-wa-type" value={newWhatsAppTemplate.type} onChange={(e) => setNewWhatsAppTemplate({ ...newWhatsAppTemplate, type: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="whatsapp_trial_end">Fin de Prueba</option>
            <option value="whatsapp_subscription_end">Fin de Suscripción</option>
            <option value="whatsapp_payment_reminder">Recordatorio de Pago</option>
          </select>
        </div>
        <div>
          <label htmlFor="new-wa-message" className="block text-sm font-medium text-foreground mb-1">Mensaje</label>
          <textarea id="new-wa-message" value={newWhatsAppTemplate.message} onChange={(e) => setNewWhatsAppTemplate({ ...newWhatsAppTemplate, message: e.target.value })} rows={6} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onCreate}>Crear</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import type { EmailTemplate, WhatsAppTemplate } from '../../types/templates/templates.types';

interface EmailPreviewModalProps {
  template: EmailTemplate;
  onClose: () => void;
}

interface WhatsAppPreviewModalProps {
  template: WhatsAppTemplate;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ template, onClose }) => (
  <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Previsualizar Plantilla de Email</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Asunto</p>
          <p className="font-medium text-foreground">{template.subject}</p>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">Cuerpo del Email</p>
          <div className="bg-muted rounded-lg p-4 text-sm text-foreground">
            <p>Hola {'{name}'},</p>
            <p className="mt-2">Este es un ejemplo de cómo se verá el email enviado con la plantilla "{template.name}".</p>
            <p className="mt-2">Los campos dinámicos como {'{name}'}, {'{empresa}'}, etc. serán reemplazados con los datos reales del usuario.</p>
            <p className="mt-4">Saludos,<br />El equipo de ovelix</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({ template, onClose }) => (
  <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Previsualizar Mensaje de WhatsApp</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Plantilla</p>
          <p className="font-medium text-foreground">{template.name}</p>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">Mensaje</p>
          <div className="bg-green-50 rounded-lg p-4 text-sm text-foreground border border-green-200">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-success mt-0.5" />
              <p>{template.message}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Variables disponibles: {'{name}'}, {'{date}'}, {'{time}'}, {'{order}'}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

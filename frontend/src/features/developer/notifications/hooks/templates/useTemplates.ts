import { useState, useEffect } from 'react';
import type { EmailTemplate, WhatsAppTemplate, NewEmailTemplate, NewWhatsAppTemplate } from '../../types/templates/templates.types';
import { PAGE_TEMPLATES } from '../../constants/templates/templates.constants';
import * as api from '../../api/templates/templatesApi';

export function useTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setError(null);
      const [emailsResponse, whatsappResponse] = await Promise.all([
        api.fetchEmailTemplates(),
        api.fetchWhatsAppTemplates(),
      ]);
      setTemplates(Array.isArray(emailsResponse) ? emailsResponse : []);
      setWhatsappTemplates(Array.isArray(whatsappResponse) ? whatsappResponse : []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('No se pudieron cargar las plantillas. Verificá tu conexión e intentá de nuevo.');
      setTemplates([]);
      setWhatsappTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const [showModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [previewWhatsApp, setPreviewWhatsApp] = useState<WhatsAppTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateEmailModal, setShowCreateEmailModal] = useState(false);
  const [showCreateWhatsAppModal, setShowCreateWhatsAppModal] = useState(false);
  const [showEditEmailModal, setShowEditEmailModal] = useState(false);
  const [showEditWhatsAppModal, setShowEditWhatsAppModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editingWhatsApp, setEditingWhatsApp] = useState<WhatsAppTemplate | null>(null);
  const [newEmailTemplate, setNewEmailTemplate] = useState<NewEmailTemplate>({ name: '', subject: '', body: '', type: 'welcome', variables: [] });
  const [newWhatsAppTemplate, setNewWhatsAppTemplate] = useState<NewWhatsAppTemplate>({ name: '', message: '', type: 'whatsapp_trial_end', variables: [] });

  const filterTemplates = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCreateEmailTemplate = async () => {
    try {
      await api.createEmailTemplate(newEmailTemplate);
      await fetchTemplates();
      setShowCreateEmailModal(false);
      setNewEmailTemplate({ name: '', subject: '', body: '', type: 'welcome', variables: [] });
    } catch (error) {
      console.error('Error creating email template:', error);
    }
  };

  const handleCreateWhatsAppTemplate = async () => {
    try {
      await api.createWhatsAppTemplate(newWhatsAppTemplate);
      await fetchTemplates();
      setShowCreateWhatsAppModal(false);
      setNewWhatsAppTemplate({ name: '', message: '', type: 'whatsapp_trial_end', variables: [] });
    } catch (error) {
      console.error('Error creating WhatsApp template:', error);
    }
  };

  const handleUpdateEmailTemplate = async () => {
    if (!editingTemplate) return;
    try {
      await api.updateEmailTemplate(editingTemplate.id, editingTemplate);
      await fetchTemplates();
      setShowEditEmailModal(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error updating email template:', error);
    }
  };

  const handleUpdateWhatsAppTemplate = async () => {
    if (!editingWhatsApp) return;
    try {
      await api.updateWhatsAppTemplate(editingWhatsApp.id, editingWhatsApp);
      await fetchTemplates();
      setShowEditWhatsAppModal(false);
      setEditingWhatsApp(null);
    } catch (error) {
      console.error('Error updating WhatsApp template:', error);
    }
  };

  const openEditEmailModal = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditEmailModal(true);
  };

  const openEditWhatsAppModal = (template: WhatsAppTemplate) => {
    setEditingWhatsApp(template);
    setShowEditWhatsAppModal(true);
  };

  const pageTemplates = PAGE_TEMPLATES;

  return {
    templates, whatsappTemplates, loading, error, fetchTemplates, pageTemplates,
    previewTemplate, setPreviewTemplate,
    previewWhatsApp, setPreviewWhatsApp,
    searchTerm, setSearchTerm,
    showCreateEmailModal, setShowCreateEmailModal,
    showCreateWhatsAppModal, setShowCreateWhatsAppModal,
    showEditEmailModal, setShowEditEmailModal,
    showEditWhatsAppModal, setShowEditWhatsAppModal,
    editingTemplate, setEditingTemplate,
    editingWhatsApp, setEditingWhatsApp,
    newEmailTemplate, setNewEmailTemplate,
    newWhatsAppTemplate, setNewWhatsAppTemplate,
    filterTemplates,
    handleCreateEmailTemplate,
    handleCreateWhatsAppTemplate,
    handleUpdateEmailTemplate,
    handleUpdateWhatsAppTemplate,
    openEditEmailModal,
    openEditWhatsAppModal,
  };
}

import api from '../../../../../services/api';

export const fetchEmailTemplates = async () => {
  const response = await api.get('/templates/emails');
  return response.data;
};

export const fetchWhatsAppTemplates = async () => {
  const response = await api.get('/templates/whatsapp');
  return response.data;
};

export const createEmailTemplate = async (data: any) => {
  await api.post('/templates/emails', data);
};

export const createWhatsAppTemplate = async (data: any) => {
  await api.post('/templates/whatsapp', data);
};

export const updateEmailTemplate = async (id: string, data: any) => {
  await api.put(`/templates/emails/${id}`, data);
};

export const updateWhatsAppTemplate = async (id: string, data: any) => {
  await api.put(`/templates/whatsapp/${id}`, data);
};

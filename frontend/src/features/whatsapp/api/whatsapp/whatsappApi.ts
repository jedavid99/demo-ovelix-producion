import { whatsappApi, repairsApi } from '../../../../services/api';

export const getQRImage = async () => {
  return await whatsappApi.getQRImage();
};

export const getClients = async () => {
  return await whatsappApi.getClients();
};

export const getClientMessages = async (contactId: string, page = 1, limit = 20) => {
  return await whatsappApi.getClientMessages(contactId, page, limit);
};

export const getStatus = async () => {
  return await whatsappApi.getStatus();
};

export const getChats = async () => {
  return await whatsappApi.getChats();
};

export const generateQR = async () => {
  return await whatsappApi.generateQR();
};

export const regenerateQR = async () => {
  return await whatsappApi.regenerateQR();
};

export const disconnect = async () => {
  return await whatsappApi.disconnect();
};

export const sendToClient = async (contactId: string, text: string) => {
  return await whatsappApi.sendToClient(contactId, text);
};

export const sendOrderPdf = async (contactId: string, orderId: string, caption: string) => {
  return await whatsappApi.sendOrderPdf(contactId, orderId, caption);
};

export const getRepairsByClient = async (clientId: string) => {
  return await repairsApi.getByClient(clientId);
};

export const requestPairingCode = async (phoneNumber: string) => {
  return await whatsappApi.requestPairingCode(phoneNumber);
};

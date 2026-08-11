import axios from 'axios';
import { API_BASE } from '@/services/api';
import { CashClosingData, CashClosingFilters } from '@/types/cashClosing.types';

const API_URL = API_BASE;

export const cashClosingService = {
  async list(filters?: CashClosingFilters) {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/cash-closings`, {
      headers: { Authorization: `Bearer ${token}` },
      params: filters
    });
    // Backend usa TransformInterceptor: { data: {...}, statusCode, timestamp, path }
    return response.data?.data?.data || response.data?.data || response.data;
  },

  async getById(id: string) {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/cash-closings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data?.data?.data || response.data?.data || response.data;
  },

  async create(data: CashClosingData) {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(`${API_URL}/cash-closings`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data?.data?.data || response.data?.data || response.data;
  },

  async update(id: string, data: Partial<CashClosingData>) {
    const token = localStorage.getItem('access_token');
    const response = await axios.patch(`${API_URL}/cash-closings/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data?.data?.data || response.data?.data || response.data;
  },

  async delete(id: string) {
    const token = localStorage.getItem('access_token');
    await axios.delete(`${API_URL}/cash-closings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async getByDate(date: string) {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/cash-closings/by-date/${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data?.data?.data || response.data?.data || response.data;
  }
};

import api from './api';

export interface UploadResult {
  url: string;
  key: string;
}

interface ApiResponse {
  data: UploadResult;
  statusCode: number;
  timestamp: string;
  path: string;
}

export const uploadService = {
  uploadFile: async (file: File, folder = 'uploads'): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post<ApiResponse>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  deleteFile: async (key: string): Promise<void> => {
    await api.delete(`/upload/${encodeURIComponent(key)}`);
  },
};

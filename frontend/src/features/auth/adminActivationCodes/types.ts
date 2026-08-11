export interface ActivationCode {
  id: string;
  code: string;
  createdAt: string;
  used: boolean;
  usedAt?: string;
}

export const ADMIN_EMAIL = 'admin@ovelix.com';

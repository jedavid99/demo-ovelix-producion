export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'password_reset' | 'trial_end' | 'subscription_end' | 'payment_reminder';
  variables: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  message: string;
  type: 'whatsapp_trial_end' | 'whatsapp_subscription_end' | 'whatsapp_payment_reminder';
  variables: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageTemplate {
  id: string;
  name: string;
  type: string;
  updated_at: string;
  active: boolean;
  path: string;
}

export interface NewEmailTemplate {
  name: string;
  subject: string;
  body: string;
  type: string;
  variables: string[];
}

export interface NewWhatsAppTemplate {
  name: string;
  message: string;
  type: string;
  variables: string[];
}

import { Company, CompanyData, UserData, StoredActivationCode, ActivationCode, CompanyDataEntry, SubscriptionPlanKey } from '../types/auth.types';
import { SUBSCRIPTION_PLANS } from '../constants/auth.constants';

export const getStoredActivationCodes = (): StoredActivationCode[] | null => {
  const storedCodes = localStorage.getItem('activation_codes');
  if (!storedCodes) return null;
  try {
    return JSON.parse(storedCodes);
  } catch {
    localStorage.removeItem('activation_codes');
    return null;
  }
};

export const validateActivationCodeService = (code: string): {
  valid: boolean;
  error?: string;
  hasCompany?: boolean;
  companyData?: CompanyData | null;
} => {
  if (!code.trim()) {
    return { valid: false, error: 'Por favor, ingresa el código de activación' };
  }

  const codes = getStoredActivationCodes();
  if (!codes) {
    return { valid: false, error: 'Código de activación inválido' };
  }

  const codeData = codes.find((c) => c.code === code);
  if (!codeData) {
    return { valid: false, error: 'Código de activación inválido' };
  }

  const expiresAt = new Date(codeData.expiresAt);
  if (expiresAt < new Date()) {
    return { valid: false, error: 'Este código de activación ha vencido' };
  }

  if (codeData.used && codeData.companyDetails && codeData.companyDetails.razonSocial) {
    return {
      valid: true,
      hasCompany: true,
      companyData: codeData.companyDetails,
    };
  }

  return {
    valid: true,
    hasCompany: false,
    companyData: null,
  };
};

export const saveCompanyService = (companyData: CompanyData, code: string): void => {
  const newCompany: Company = {
    id: Date.now().toString(),
    name: companyData.razonSocial,
    address: companyData.address,
    phone: companyData.phone,
    email: companyData.email,
    codigoEmpresa: code,
  };
  localStorage.setItem('newCompany', JSON.stringify(newCompany));
  localStorage.setItem('companyDetails', JSON.stringify({ ...companyData, codigoEmpresa: code }));
};

export const registerUserService = async (params: {
  activationCode: string;
  userData: UserData;
  companyData: CompanyData;
  hasCompanyRegistered: boolean;
  existingCompanyData: CompanyData | null;
}): Promise<void> => {
  const { activationCode, userData, companyData, hasCompanyRegistered, existingCompanyData } = params;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const storedCodes = localStorage.getItem('activation_codes');
  if (storedCodes) {
    let codes: StoredActivationCode[] = [];
    try {
      codes = JSON.parse(storedCodes);
    } catch {
      localStorage.removeItem('activation_codes');
    }
    const updatedCodes = codes.map((c: StoredActivationCode) => {
      if (c.code === activationCode) {
        return {
          ...c,
          used: true,
          usedAt: new Date().toISOString(),
          userEmail: userData.email,
          userName: userData.fullName,
          userRole: userData.role,
          companyDetails: hasCompanyRegistered
            ? existingCompanyData
            : { ...companyData, codigoEmpresa: companyData.codigoEmpresa },
        };
      }
      return c;
    });
    localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
  }

  const registrationData = {
    userData,
    companyData: hasCompanyRegistered ? existingCompanyData : companyData,
    registrationType: hasCompanyRegistered ? 'existing' : 'new',
    activationCode,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem('registrationData', JSON.stringify(registrationData));
  console.log('Registration completed:', registrationData);
};

// --- Code Generator API ---

export const loadCodesFromStorage = (): ActivationCode[] => {
  const storedCodes = localStorage.getItem('activation_codes');
  if (!storedCodes) return [];
  try {
    return JSON.parse(storedCodes);
  } catch {
    localStorage.removeItem('activation_codes');
    return [];
  }
};

export const generateCodeInStorage = (
  selectedPlan: SubscriptionPlanKey,
  companyData: CompanyDataEntry,
  existingCodes: ActivationCode[]
): ActivationCode => {
  const code = 'ovelix-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const plan = SUBSCRIPTION_PLANS[selectedPlan];
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + plan.duration * 24 * 60 * 60 * 1000);
  const newActivationCode: ActivationCode = {
    id: Date.now().toString(),
    code,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    plan: selectedPlan,
    used: false,
    status: 'active',
    companyDetails: {
      razonSocial: '',
      nombreFantasia: '',
      address: '',
      phone: '',
      email: '',
      cuit: companyData.cuit,
      owner: companyData.owner,
      paymentMethod: companyData.paymentMethod,
      workshopType: companyData.workshopType,
    },
  };
  const updatedCodes = [newActivationCode, ...existingCodes];
  localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
  return newActivationCode;
};

export const deleteCodeFromStorage = (id: string, existingCodes: ActivationCode[]): ActivationCode[] => {
  const updatedCodes = existingCodes.filter((c) => c.id !== id);
  localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
  return updatedCodes;
};

export const copyCodeToClipboard = (code: string): void => {
  navigator.clipboard.writeText(code);
};

export const sendWhatsAppReminder = (code: ActivationCode): void => {
  const message = `Hola ${code.userName || 'usuario'}, tu código de activación ${code.code} vence el ${new Date(
    code.expiresAt
  ).toLocaleDateString()}. Por favor renueva tu suscripción para continuar usando ovelix.`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

export const sendGmailReminder = (code: ActivationCode): void => {
  const subject = 'Recordatorio: Tu suscripción de ovelix está por vencer';
  const body = `Hola ${code.userName || 'usuario'},\n\nTu código de activación ${code.code} vence el ${new Date(
    code.expiresAt
  ).toLocaleDateString()}.\n\nPor favor renueva tu suscripción para continuar usando ovelix.\n\nSaludos,\nEquipo de ovelix`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, '_blank');
};

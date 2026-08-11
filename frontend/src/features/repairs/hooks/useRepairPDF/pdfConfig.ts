export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  cuit: string;
}

export function loadBusinessInfo(): BusinessInfo {
  const defaultInfo: BusinessInfo = {
    name: 'TechFix Reparaciones',
    address: 'Av. Corrientes 1234, CABA, Argentina',
    phone: '+54 11 4321-1234',
    email: 'info@techfix.com',
    cuit: '20-12345678-9',
  };

  try {
    const savedConfig = localStorage.getItem('pdfConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (config.companyName) defaultInfo.name = config.companyName;
      if (config.companyAddress) defaultInfo.address = config.companyAddress;
      if (config.companyPhone) defaultInfo.phone = config.companyPhone;
      if (config.companyEmail) defaultInfo.email = config.companyEmail;
    }
  } catch (error) {
    console.error('Error al cargar configuraci\u00F3n del negocio:', error);
  }

  return defaultInfo;
}

export function loadBusinessName(): string {
  try {
    const savedConfig = localStorage.getItem('pdfConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (config.companyName) return config.companyName;
    }
  } catch (error) {}
  return 'TechFix';
}

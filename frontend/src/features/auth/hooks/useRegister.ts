import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyData, UserData, ActivationCode } from '../types/auth.types';
import { INITIAL_COMPANY_DATA, INITIAL_USER_DATA, INITIAL_ACTIVATION_CODE } from '../constants/auth.constants';
import {
  validateActivationCodeService,
  registerUserService,
  loadCodesFromStorage,
} from '../services/authApi';

export function useRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activationCode, setActivationCode] = useState('');
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  const [activationError, setActivationError] = useState('');
  const [hasCompanyRegistered, setHasCompanyRegistered] = useState(false);
  const [existingCompanyData, setExistingCompanyData] = useState<CompanyData | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData>(INITIAL_COMPANY_DATA);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [registeredCompanyCode, setRegisteredCompanyCode] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Cargar códigos de activación desde localStorage al iniciar
  useEffect(() => {
    const codes = loadCodesFromStorage();
    if (codes) {
      setActivationCodes(codes);
    }
  }, []);

  // Cargar modo developer desde localStorage
  useEffect(() => {
    const mode = localStorage.getItem('developerMode');
    if (mode) {
      setDeveloperMode(mode === 'true');
    }
  }, []);

  // Funciones de validación
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) =>
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);

  const validateActivationCode = () => {
    const result = validateActivationCodeService(activationCode);
    if (!result.valid) {
      setActivationError(result.error || 'Código inválido');
      return false;
    }

    setHasCompanyRegistered(!!result.hasCompany);
    setExistingCompanyData(result.companyData || null);
    setActivationError('');
    return true;
  };

  const validateCompanyForm = () => {
    const newErrors: Record<string, string> = {};
    if (!companyData.razonSocial.trim()) newErrors.razonSocial = 'La razón social es obligatoria';
    if (!companyData.nombreFantasia.trim()) newErrors.nombreFantasia = 'El nombre del taller es obligatorio';
    if (!companyData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!companyData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!validatePhone(companyData.phone)) newErrors.phone = 'Teléfono inválido';
    if (!companyData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!validateEmail(companyData.email)) newErrors.email = 'Email inválido';
    if (!companyData.cuit.trim()) newErrors.cuit = 'El CUIT/CUIL es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUserForm = () => {
    const newErrors: Record<string, string> = {};
    if (!userData.nombreUsuario?.trim()) newErrors.nombreUsuario = 'El nombre es obligatorio';
    if (!userData.apellidoUsuario?.trim()) newErrors.apellidoUsuario = 'El apellido es obligatorio';
    if (!userData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!validateEmail(userData.email)) newErrors.email = 'Email inválido';
    if (!userData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!validatePhone(userData.phone)) newErrors.phone = 'Teléfono inválido';

    if (hasCompanyRegistered && !userData.codigoEmpresa?.trim()) {
      newErrors.codigoEmpresa = 'El código de empresa es obligatorio';
    }
    if (!userData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (userData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!userData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (userData.password !== userData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (hasCompanyRegistered && !userData.role) {
      newErrors.role = 'El rol es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejadores de pasos
  const handleNextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    if (step === 0) {
      navigate('/');
      return;
    }
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCompanyForm()) {
      setStep(1);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserForm()) {
      setIsSubmitting(true);
      try {
        const result = await registerUserService({
          activationCode: '',
          userData,
          companyData,
          hasCompanyRegistered: false,
          existingCompanyData: null,
        });
        setRegisteredCompanyCode(result.codigo_empresa);
        setIsSubmitting(false);
        handleNextStep();
      } catch (err) {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  const handleCopyCode = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    step,
    direction,
    activationCode,
    setActivationCode,
    activationError,
    setActivationError,
    hasCompanyRegistered,
    existingCompanyData,
    companyData,
    setCompanyData,
    userData,
    setUserData,
    errors,
    isSubmitting,
    copied,
    activationCodes,
    registeredCompanyCode,
    handleNextStep,
    handlePreviousStep,
    handleCompanySubmit,
    handleUserSubmit,
    handleGoToLogin,
    handleCopyCode,
  };
}

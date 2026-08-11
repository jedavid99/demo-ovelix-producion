import type { CompanyFormData, PlanOption, PaymentMethod } from '../../types/companies/companies.types'

export const ITEMS_PER_PAGE = 10

export const EMPTY_FORM_DATA: CompanyFormData = {
  codigo_empresa: '',
  rubro: '',
  cuit_cuil: '',
  email: '',
  telefono: '',
  admin_email: '',
  admin_password: '',
  admin_nombre: '',
  admin_apellido: '',
  admin_dni: '',
  admin_telefono: '',
  tipo_plan: 'demo',
  plan_seleccionado: '',
  metodo_pago: '',
}

export const PLAN_OPTIONS: PlanOption[] = [
  { id: 'basico', nombre: 'Básico', precio: 29, descripcion: 'Hasta 5 usuarios, 100 clientes' },
  { id: 'premium', nombre: 'Premium', precio: 79, descripcion: 'Hasta 20 usuarios, 500 clientes' },
  { id: 'oro', nombre: 'Oro', precio: 149, descripcion: 'Usuarios y clientes ilimitados' },
]

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'tarjeta', nombre: 'Tarjeta de Crédito/Débito' },
  { id: 'transferencia', nombre: 'Transferencia Bancaria' },
  { id: 'paypal', nombre: 'PayPal' },
  { id: 'mercadopago', nombre: 'MercadoPago' },
]

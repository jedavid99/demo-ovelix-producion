export interface Company {
  id: string
  codigo_empresa: string
  razon_social: string
  email?: string
  telefono?: string
  direccion?: string
  ciudad?: string
  provincia?: string
  codigo_postal?: string
  activo: boolean
  created_at: string
  tipo_plan?: string
  plan_seleccionado?: string
  metodo_pago?: string
  _count: {
    users: number
    clients: number
    repairs: number
  }
}

export interface CompanyFormData {
  codigo_empresa: string
  rubro: string
  cuit_cuil: string
  email: string
  telefono: string
  admin_email: string
  admin_password: string
  admin_nombre: string
  admin_apellido: string
  admin_dni: string
  admin_telefono: string
  tipo_plan: string
  plan_seleccionado: string
  metodo_pago: string
}

export interface PlanOption {
  id: string
  nombre: string
  precio: number
  descripcion: string
}

export interface PaymentMethod {
  id: string
  nombre: string
}

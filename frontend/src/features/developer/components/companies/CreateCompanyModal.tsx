import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Building2, Plus, X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { PLAN_OPTIONS, PAYMENT_METHODS, EMPTY_FORM_DATA } from '../../constants/companies/companies.constants'

const CreateCompanyModal: React.FC<any> = ({ onClose, onSubmit, nextCode }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const generatedCode = `ovelix-${String(nextCode).padStart(4, '0')}`

  const [formData, setFormData] = useState({ ...EMPTY_FORM_DATA, codigo_empresa: generatedCode })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormData((prev) => ({ ...prev, codigo_empresa: `ovelix-${String(nextCode).padStart(4, '0')}` }))
  }, [nextCode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.rubro.trim()) newErrors.rubro = 'El rubro es obligatorio'
    if (!formData.cuit_cuil.trim()) newErrors.cuit_cuil = 'El CUIT/CUIL es obligatorio'
    if (!formData.admin_email.trim()) newErrors.admin_email = 'El email del administrador es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(formData.admin_email)) newErrors.admin_email = 'Email inválido'
    if (!formData.admin_password.trim()) newErrors.admin_password = 'La contraseña es obligatoria'
    else if (formData.admin_password.length < 6) newErrors.admin_password = 'Mínimo 6 caracteres'
    if (!formData.admin_nombre.trim()) newErrors.admin_nombre = 'El nombre es obligatorio'
    if (!formData.admin_apellido.trim()) newErrors.admin_apellido = 'El apellido es obligatorio'
    if (formData.tipo_plan === 'suscripcion') {
      if (!formData.plan_seleccionado) newErrors.plan_seleccionado = 'Selecciona un plan'
      if (!formData.metodo_pago) newErrors.metodo_pago = 'Selecciona un método de pago'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        ...formData,
        razon_social: formData.rubro,
        direccion: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
      })
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la empresa. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card/95 backdrop-blur z-10 px-5 py-3 border-b border-border flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/5 rounded-lg">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Nueva Empresa</h3>
              <p className="text-xs text-muted-foreground">Completa los datos para registrar una nueva empresa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors" disabled={isSubmitting}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <section>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-blue-200 mr-2"></span>
              Datos de la empresa
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company-codigo" className="block text-xs font-medium text-foreground mb-1">Código Empresa <span className="text-muted-foreground">(autogenerado)</span></label>
                <input id="company-codigo" type="text" readOnly value={formData.codigo_empresa} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground cursor-not-allowed text-sm" />
              </div>
              <div>
                <label htmlFor="company-rubro" className="block text-xs font-medium text-foreground mb-1">Rubro <span className="text-destructive">*</span></label>
                <input id="company-rubro" type="text" required placeholder="Ej: Servicios Informáticos" value={formData.rubro}
                  onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm ${errors.rubro ? 'border-red-300 ring-1 ring-red-300' : 'border-border'}`} />
                {errors.rubro && <p className="mt-1 text-xs text-destructive">{errors.rubro}</p>}
              </div>
              <div>
                <label htmlFor="company-cuit" className="block text-xs font-medium text-foreground mb-1">CUIT / CUIL <span className="text-destructive">*</span></label>
                <input id="company-cuit" type="text" required placeholder="Ej: 30-12345678-9" value={formData.cuit_cuil}
                  onChange={(e) => setFormData({ ...formData, cuit_cuil: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm ${errors.cuit_cuil ? 'border-red-300 ring-1 ring-red-300' : 'border-border'}`} />
                {errors.cuit_cuil && <p className="mt-1 text-xs text-destructive">{errors.cuit_cuil}</p>}
              </div>
              <div>
                <label htmlFor="company-email" className="block text-xs font-medium text-foreground mb-1">Email de la empresa</label>
                <input id="company-email" type="email" placeholder="contacto@empresa.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm" />
              </div>
              <div>
                <label htmlFor="company-telefono" className="block text-xs font-medium text-foreground mb-1">Teléfono</label>
                <input id="company-telefono" type="text" placeholder="+54 11 1234-5678" value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm" />
              </div>
            </div>
          </section>
          <section>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-blue-200 mr-2"></span>
              Datos del administrador
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company-admin-email" className="block text-xs font-medium text-foreground mb-1">Email <span className="text-destructive">*</span></label>
                <input id="company-admin-email" type="email" required placeholder="admin@empresa.com" value={formData.admin_email}
                  onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm ${errors.admin_email ? 'border-red-300 ring-1 ring-red-300' : 'border-border'}`} />
                {errors.admin_email && <p className="mt-1 text-xs text-destructive">{errors.admin_email}</p>}
              </div>
              <div>
                <label htmlFor="company-admin-password" className="block text-xs font-medium text-foreground mb-1">Contraseña <span className="text-destructive">*</span></label>
                <div className="relative">
                  <input id="company-admin-password" type={showPassword ? 'text' : 'password'} required placeholder="Mínimo 6 caracteres" value={formData.admin_password}
                    onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent pr-10 text-sm ${errors.admin_password ? 'border-red-300 ring-1 ring-red-300' : 'border-border'}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.admin_password && <p className="mt-1 text-xs text-destructive">{errors.admin_password}</p>}
              </div>
              <div>
                <label htmlFor="company-admin-nombre" className="block text-xs font-medium text-foreground mb-1">Nombre <span className="text-destructive">*</span></label>
                <input id="company-admin-nombre" type="text" required placeholder="Juan" value={formData.admin_nombre}
                  onChange={(e) => setFormData({ ...formData, admin_nombre: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm ${errors.admin_nombre ? 'border-red-300 ring-1 ring-red-300' : 'border-border'}`} />
                {errors.admin_nombre && <p className="mt-1 text-xs text-destructive">{errors.admin_nombre}</p>}
              </div>
              <div>
                <label htmlFor="company-admin-apellido" className="block text-xs font-medium text-foreground mb-1">Apellido <span className="text-destructive">*</span></label>
                <input id="company-admin-apellido" type="text" required placeholder="Pérez" value={formData.admin_apellido}
                  onChange={(e) => setFormData({ ...formData, admin_apellido: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm ${errors.admin_apellido ? 'border-red-300 ring-1 ring-red-300' : 'border-border'}`} />
                {errors.admin_apellido && <p className="mt-1 text-xs text-destructive">{errors.admin_apellido}</p>}
              </div>
              <div>
                <label htmlFor="company-admin-dni" className="block text-xs font-medium text-foreground mb-1">DNI</label>
                <input id="company-admin-dni" type="text" placeholder="30.123.456" value={formData.admin_dni}
                  onChange={(e) => setFormData({ ...formData, admin_dni: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm" />
              </div>
              <div>
                <label htmlFor="company-admin-telefono" className="block text-xs font-medium text-foreground mb-1">Teléfono del admin</label>
                <input id="company-admin-telefono" type="text" placeholder="+54 9 11 1234-5678" value={formData.admin_telefono}
                  onChange={(e) => setFormData({ ...formData, admin_telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm" />
              </div>
            </div>
          </section>
          <section>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-blue-200 mr-2"></span>
              Plan y método de pago
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">Tipo de Plan</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, tipo_plan: 'demo', plan_seleccionado: '', metodo_pago: '' })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${formData.tipo_plan === 'demo' ? 'border-blue-500 bg-primary/5 shadow-md' : 'border-border hover:border-border hover:shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm">Demo</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Gratis</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">15 días de prueba</p>
                    <p className="text-xs text-muted-foreground">Sin compromiso</p>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, tipo_plan: 'suscripcion' })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${formData.tipo_plan === 'suscripcion' ? 'border-blue-500 bg-primary/5 shadow-md' : 'border-border hover:border-border hover:shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm">Suscripción</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Mensual</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Acceso completo</p>
                    <p className="text-xs text-muted-foreground">Pago recurrente</p>
                  </button>
                </div>
              </div>
              {formData.tipo_plan === 'suscripcion' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-2">Selecciona tu plan <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PLAN_OPTIONS.map((plan) => (
                        <button key={plan.id} type="button" onClick={() => setFormData({ ...formData, plan_seleccionado: plan.id })}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${formData.plan_seleccionado === plan.id ? 'border-blue-500 bg-primary/5 shadow-md ring-2 ring-blue-200' : 'border-border hover:border-border hover:shadow-sm'}`}>
                          <div className="font-semibold text-foreground text-sm">{plan.nombre}</div>
                          <div className="text-xl font-bold text-primary">${plan.precio}</div>
                          <div className="text-xs text-muted-foreground">/mes</div>
                          <p className="text-xs text-muted-foreground mt-1">{plan.descripcion}</p>
                        </button>
                      ))}
                    </div>
                    {errors.plan_seleccionado && <p className="mt-1 text-xs text-destructive">{errors.plan_seleccionado}</p>}
                  </div>
                  <div>
                    <label htmlFor="company-metodo-pago" className="block text-xs font-medium text-foreground mb-1">Método de Pago <span className="text-destructive">*</span></label>
                    <select id="company-metodo-pago" required value={formData.metodo_pago} onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm ${errors.metodo_pago ? 'border-red-300 ring-1 ring-red-300' : 'border-border'}`}>
                      <option value="">Seleccionar método de pago</option>
                      {PAYMENT_METHODS.map((metodo) => (
                        <option key={metodo.id} value={metodo.id}>{metodo.nombre}</option>
                      ))}
                    </select>
                    {errors.metodo_pago && <p className="mt-1 text-xs text-destructive">{errors.metodo_pago}</p>}
                  </div>
                </>
              )}
            </div>
          </section>
          {error && (
            <div className="bg-destructive/10 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center space-x-2 text-sm">
              <span className="text-destructive">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors disabled:opacity-50 text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Creando...</span></>
              ) : (
                <><Plus className="w-4 h-4" /><span>Crear Empresa</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default CreateCompanyModal

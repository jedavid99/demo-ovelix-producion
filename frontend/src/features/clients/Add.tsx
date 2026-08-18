import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, MapPin, Phone, Mail, Hash, MessageCircle } from 'lucide-react'
import { useClientMutations } from '@/hooks/useClients'
import { logger } from '@/utils/logger';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientCreateSchema, ClientCreateFormData } from '@/validations/client.validation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

export default function ClientAdd() {
  const navigate = useNavigate()
  const { createClient, loading, error } = useClientMutations()
  const { user } = useAuth()
  const [includeAddress, setIncludeAddress] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ClientCreateFormData>({
    resolver: zodResolver(clientCreateSchema),
    defaultValues: {
      nombre_completo: '',
      telefono: '',
      dni: '',
      direccion: '',
      notas: '',
      empresa_id: '',
    },
  })

  useEffect(() => {
    // Si es desarrollador, cargar empresas para seleccionar
    if (user?.rol === 'DESARROLLADOR' && !user?.empresa_id) {
      fetchCompanies()
    } else if (user?.empresa_id) {
      // Si el usuario ya tiene empresa_id, establecerla automáticamente
      setValue('empresa_id', user.empresa_id)
    }
  }, [user, setValue])

  const fetchCompanies = async () => {
    setLoadingCompanies(true)
    try {
      const response = await api.get('/companies')
      setCompanies(response.data.data || response.data || [])
    } catch (error) {
      logger.error('Error fetching companies:', error)
    } finally {
      setLoadingCompanies(false)
    }
  }

  const onSubmit = async (data: ClientCreateFormData) => {
    
    // Si no se incluye dirección, enviar undefined en lugar de string vacío
    const submitData = {
      ...data,
      direccion: includeAddress ? data.direccion : undefined,
      notas: includeAddress ? data.notas : undefined,
    }
    
    const result = await createClient(submitData)
    if (result) {
      navigate('/clients')
    } else {
      logger.error('ClientAdd - Error al crear cliente:', error)
    }
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/clients" className="inline-flex items-center justify-center w-9 h-9 bg-card border rounded-md shadow-sm hover:bg-muted">
            <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <h2 className="text-2xl font-semibold">Nuevo Registro de Cliente</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-xl shadow p-6 border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda: Datos Personales */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><User size={16} /></div>
              <h3 className="font-medium">Datos Personales</h3>
            </div>
            <div className="space-y-4">
              {/* Company selector for developers */}
              {user?.rol === 'DESARROLLADOR' && !user?.empresa_id && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Empresa *</label>
                  {loadingCompanies ? (
                    <div className="w-full px-4 py-3 border rounded-lg bg-muted text-muted-foreground">
                      Cargando empresas...
                    </div>
                  ) : (
                    <select
                      {...register('empresa_id')}
                      className={`w-full px-4 py-3 border rounded-lg bg-muted ${errors.empresa_id ? 'border-red-500' : ''}`}
                    >
                      <option value="">Seleccionar empresa</option>
                      {companies.map((company: any) => (
                        <option key={company.id} value={company.id}>
                          {company.razon_social}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.empresa_id && (
                    <p className="text-destructive text-xs mt-1">{errors.empresa_id.message}</p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm text-muted-foreground mb-2" htmlFor="nombre-completo">Nombre Completo *</label>
                <div className="relative">
                  <input 
                    id="nombre-completo"
                    {...register('nombre_completo')}
                    className={`w-full px-4 py-3 border rounded-lg bg-muted ${errors.nombre_completo ? 'border-red-500' : ''}`} 
                    placeholder="Ej. Juan Pérez" 
                  />
                  {errors.nombre_completo && (
                    <p className="text-destructive text-xs mt-1">{errors.nombre_completo.message}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 items-end">
                <div className="w-24 flex-shrink-0">
                  <label className="block text-sm text-muted-foreground mb-2">Código</label>
                  <div className="px-3 py-3 border rounded-lg bg-muted text-foreground font-medium text-center select-none">
                    +54
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-2" htmlFor="telefono">Teléfono *</label>
                  <input
                    id="telefono"
                    {...register('telefono')}
                    className={`w-full px-4 py-3 border rounded-lg bg-muted ${errors.telefono ? 'border-red-500' : ''}`}
                    placeholder="000 000 000"
                  />
                  {errors.telefono && (
                    <p className="text-destructive text-xs mt-1">{errors.telefono.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2" htmlFor="dni">DNI</label>
                <input 
                  id="dni"
                  {...register('dni')}
                  className={`w-full px-4 py-3 border rounded-lg bg-muted ${errors.dni ? 'border-red-500' : ''}`} 
                  placeholder="12345678X" 
                />
                {errors.dni && (
                  <p className="text-destructive text-xs mt-1">{errors.dni.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Columna Derecha: Dirección y Facturación (con toggle) */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 rounded-full text-indigo-600"><MapPin size={16} /></div>
              <h3 className="font-medium">Dirección y Facturación</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeAddress"
                  checked={includeAddress}
                  onChange={(e) => setIncludeAddress(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-border rounded focus:ring-indigo-500"
                />
                <label htmlFor="includeAddress" className="text-sm text-foreground">
                  Incluir dirección y notas
                </label>
              </div>
              {includeAddress && (
                <>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2" htmlFor="direccion">Calle / Dirección</label>
                    <input 
                      id="direccion"
                      {...register('direccion')}
                      className={`w-full px-4 py-3 border rounded-lg bg-muted ${errors.direccion ? 'border-red-500' : ''}`} 
                      placeholder="Calle Principal 123" 
                    />
                    {errors.direccion && (
                      <p className="text-destructive text-xs mt-1">{errors.direccion.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2" htmlFor="notas">Notas</label>
                    <textarea 
                      id="notas"
                      {...register('notas')}
                      className={`w-full px-4 py-3 border rounded-lg bg-muted ${errors.notas ? 'border-red-500' : ''}`} 
                      rows={3}
                      placeholder="Notas adicionales..."
                    />
                    {errors.notas && (
                      <p className="text-destructive text-xs mt-1">{errors.notas.message}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Pie del formulario */}
        <div className="mt-6 border-t pt-4">
          {error && (
            <div className="mb-4 bg-destructive/10 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate('/clients')} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-success text-white rounded shadow disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Guardando...' : 'Registrar Cliente'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

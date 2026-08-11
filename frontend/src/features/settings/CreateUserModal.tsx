import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { AlertCircle, UserPlus, X } from 'lucide-react'
interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateUser: (user: any) => void
}
const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreateUser,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio'
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio'
    if (!formData.role) newErrors.role = 'El rol es obligatorio'
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria'
    else if (formData.password.length < 6) newErrors.password = 'Debe tener al menos 6 caracteres'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    // Simular envío a API
    setTimeout(() => {
      onCreateUser(formData)
      setIsSubmitting(false)
      onClose()
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        password: '',
        confirmPassword: '',
      })
    }, 1000)
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <UserPlus size={22} className="text-primary" />
            Crear Nuevo Usuario
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nombre completo */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-semibold">
              Nombre completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Ej: Juan Pérez"
              className={errors.fullName ? 'border-destructive' : ''}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.fullName}
              </p>
            )}
          </div>
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Ej: juan@empresa.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.email}
              </p>
            )}
          </div>
          {/* Teléfono */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-semibold">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Ej: +34 600 123 456"
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.phone}
              </p>
            )}
          </div>
          {/* Rol */}
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-sm font-semibold">
              Rol en la empresa <span className="text-destructive">*</span>
            </Label>
            <Select
  value={formData.role}
  onValueChange={(value) => setFormData({ ...formData, role: value })}
>
  <SelectTrigger 
    className={`
      w-full 
      bg-card dark:bg-muted 
      border border-input 
      rounded-lg 
      px-3 py-2 
      text-sm text-foreground 
      shadow-sm 
      focus:ring-2 focus:ring-primary/20 focus:border-primary 
      transition-all
      ${errors.role ? 'border-destructive ring-destructive/20' : ''}
    `}
  >
    <SelectValue placeholder="Selecciona el rol" />
  </SelectTrigger>
  <SelectContent 
    className="
      bg-card dark:bg-muted 
      border border-input 
      rounded-lg 
      shadow-lg 
      max-h-[200px] 
      overflow-y-auto
    "
  >
    <SelectItem value="Administrador" className="cursor-pointer hover:bg-muted/50 px-3 py-2">
      Administrador
    </SelectItem>
    <SelectItem value="Técnico" className="cursor-pointer hover:bg-muted/50 px-3 py-2">
      Técnico
    </SelectItem>
    <SelectItem value="Recepcionista" className="cursor-pointer hover:bg-muted/50 px-3 py-2">
      Recepcionista
    </SelectItem>
    <SelectItem value="Gerente" className="cursor-pointer hover:bg-muted/50 px-3 py-2">
      Gerente
    </SelectItem>
    <SelectItem value="Contador" className="cursor-pointer hover:bg-muted/50 px-3 py-2">
      Contador
    </SelectItem>
    <SelectItem value="Otro" className="cursor-pointer hover:bg-muted/50 px-3 py-2">
      Otro
    </SelectItem>
  </SelectContent>
</Select>
            {errors.role && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.role}
              </p>
            )}
          </div>
          {/* Departamento (opcional) */}
          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-sm font-semibold">
              Departamento <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
            </Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Ej: Taller, Ventas, Administración"
            />
          </div>
          {/* Contraseña */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold">
              Contraseña <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.password}
              </p>
            )}
          </div>
          {/* Confirmar contraseña */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold">
              Confirmar contraseña <span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Repite tu contraseña"
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.confirmPassword}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default CreateUserModal

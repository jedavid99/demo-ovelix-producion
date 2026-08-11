import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useClientMutations } from '@/hooks/useClients'
import { toast } from '@/shared/components/ui/use-toast'

interface EditClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: any
  onSuccess: () => void
}

export default function EditClientModal({ open, onOpenChange, client, onSuccess }: EditClientModalProps) {
  const { updateClient, loading } = useClientMutations()
  const [form, setForm] = useState({
    nombre_completo: '',
    telefono: '',
    email: '',
    dni: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    notas: ''
  })

  useEffect(() => {
    if (client) {
      setForm({
        nombre_completo: client.nombre_completo || '',
        telefono: client.telefono || '',
        email: client.email || '',
        dni: client.dni || '',
        direccion: client.direccion || '',
        ciudad: client.ciudad || '',
        provincia: client.provincia || '',
        notas: client.notas || ''
      })
    }
  }, [client])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client?.id) return

    try {
      const result = await updateClient(client.id, form)
      if (result) {
        toast({ title: 'Cliente actualizado exitosamente' })
        onSuccess()
        onOpenChange(false)
      }
    } catch (error) {
      toast({ title: 'Error al actualizar cliente', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Cliente</DialogTitle>
          <DialogDescription>Actualiza la información del cliente</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_completo">Nombre Completo *</Label>
              <Input
                id="nombre_completo"
                name="nombre_completo"
                value={form.nombre_completo}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="11 1234 5678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="juan@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                placeholder="12345678"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Calle Principal 123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                placeholder="Buenos Aires"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia</Label>
              <Input
                id="provincia"
                name="provincia"
                value={form.provincia}
                onChange={handleChange}
                placeholder="Buenos Aires"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notas">Notas</Label>
              <textarea
                id="notas"
                name="notas"
                value={form.notas}
                onChange={handleChange}
                placeholder="Notas adicionales sobre el cliente..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

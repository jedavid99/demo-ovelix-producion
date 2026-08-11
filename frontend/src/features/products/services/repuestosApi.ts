import type { RepuestoItem, NewRepuestoForm } from '../types/repuestos.types'

export const repuestosData: RepuestoItem[] = []

export async function getRepuestos(): Promise<RepuestoItem[]> {
  return repuestosData
}

export async function createRepuesto(data: NewRepuestoForm): Promise<void> {
  console.log('Nuevo repuesto:', data)
}

export async function updateRepuesto(id: number, data: Partial<NewRepuestoForm>): Promise<void> {
  console.log('Actualizar repuesto:', id, data)
}

export async function deleteRepuesto(id: number): Promise<void> {
  console.log('Eliminar repuesto:', id)
}

export async function adjustStock(id: number, quantity: number): Promise<void> {
  console.log('Ajustar stock:', id, quantity)
}

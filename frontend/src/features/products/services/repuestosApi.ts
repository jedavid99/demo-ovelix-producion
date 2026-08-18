import type { RepuestoItem, NewRepuestoForm } from '../types/repuestos.types'

export const repuestosData: RepuestoItem[] = []

export async function getRepuestos(): Promise<RepuestoItem[]> {
  return repuestosData
}

export async function createRepuesto(data: NewRepuestoForm): Promise<void> {
}

export async function updateRepuesto(id: number, data: Partial<NewRepuestoForm>): Promise<void> {
}

export async function deleteRepuesto(id: number): Promise<void> {
}

export async function adjustStock(id: number, quantity: number): Promise<void> {
}

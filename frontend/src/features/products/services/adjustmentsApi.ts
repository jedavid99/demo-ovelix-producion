import type { AdjustmentItem, NewAdjustmentForm } from '../types/adjustments.types'

export const adjustmentsData: AdjustmentItem[] = []

export async function getAdjustments(): Promise<AdjustmentItem[]> {
  return adjustmentsData
}

export async function createAdjustment(data: NewAdjustmentForm): Promise<void> {
  console.log('Nuevo ajuste:', data)
}

export async function updateAdjustment(id: number, data: Partial<NewAdjustmentForm>): Promise<void> {
  console.log('Actualizar ajuste:', id, data)
}

export async function deleteAdjustment(id: number): Promise<void> {
  console.log('Eliminar ajuste:', id)
}

export async function getProductosParaAjuste(): Promise<string[]> {
  return []
}

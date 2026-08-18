import type { AdjustmentItem, NewAdjustmentForm } from '../types/adjustments.types'

export const adjustmentsData: AdjustmentItem[] = []

export async function getAdjustments(): Promise<AdjustmentItem[]> {
  return adjustmentsData
}

export async function createAdjustment(data: NewAdjustmentForm): Promise<void> {
}

export async function updateAdjustment(id: number, data: Partial<NewAdjustmentForm>): Promise<void> {
}

export async function deleteAdjustment(id: number): Promise<void> {
}

export async function getProductosParaAjuste(): Promise<string[]> {
  return []
}

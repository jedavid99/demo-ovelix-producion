import type { Remise, NewRemiseForm } from '../types/shipments.types'

export const initialRemises: Remise[] = []

export async function getShipments(): Promise<Remise[]> {
  return initialRemises
}

export async function createShipment(data: NewRemiseForm): Promise<Remise> {
  const newId = `REM-${String(initialRemises.length + 1).padStart(4, '0')}`
  const now = new Date().toLocaleString()
  return { ...data, id: newId, lastUpdate: now }
}

export async function updateShipment(id: string, data: Partial<NewRemiseForm>): Promise<void> {
  console.log('Actualizar remise:', id, data)
}

export async function deleteShipment(id: string): Promise<void> {
  console.log('Eliminar remise:', id)
}

export async function updateTrackingStatus(id: string, status: string): Promise<void> {
  console.log('Actualizar estado:', id, status)
}

export async function getTransportistas(): Promise<string[]> {
  return []
}

import type { DeviceOption, NewDeviceOption } from '../types/canje.types'

export const availableDevices: DeviceOption[] = []

export const newDevices: NewDeviceOption[] = []

export const tradeInBase: Record<string, number> = {}

export async function getAvailableDevices(): Promise<DeviceOption[]> {
  return availableDevices
}

export async function getNewDevices(): Promise<NewDeviceOption[]> {
  return newDevices
}

export async function createCanje(data: { deviceId: string; imei: string; tradeInCredit: number }): Promise<string> {
  const id = `TC-${Math.floor(Math.random() * 900000) + 100000}`
  return id
}

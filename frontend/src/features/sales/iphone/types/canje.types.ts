export type CanjeStep = 1 | 2 | 3

export interface DeviceOption {
  id: string
  name: string
  storage: string
  image: string
  basePrice: number
}

export interface NewDeviceOption {
  id: string
  name: string
  desc: string
  price: number
}

export interface ColorOption {
  name: string
  value: string
  hex: string
}

export interface DeviceState {
  model: string
  storage: string
  battery: number
}

export interface FunctionalChecks {
  screen: boolean
  faceid: boolean
  backglass: boolean
  cameras: boolean
}

export interface Damage {
  id: number
  label: string
  amount: number
}

export interface SelectedNewDevice {
  id: string
  name: string
  desc: string
  price: number
}

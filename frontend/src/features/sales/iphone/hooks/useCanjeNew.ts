import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/shared/components/ui/use-toast'
import { availableDevices, newDevices, tradeInBase } from '../services/canjeApi'
import type { CanjeStep, DeviceState, FunctionalChecks, Damage, SelectedNewDevice, ColorOption } from '../types/canje.types'
import { COLOR_OPTIONS } from '../constants/canje.constants'

export function useCanjeNew() {
  const navigate = useNavigate()
  const [step, setStep] = useState<CanjeStep>(1)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [device, setDevice] = useState<DeviceState>({ model: '', storage: '', battery: 50 })
  const [imei, setImei] = useState('')
  const [powerOn, setPowerOn] = useState(false)
  const [icloudLogout, setIcloudLogout] = useState(false)
  const [deviceColor, setDeviceColor] = useState('space-black')
  const [checks, setChecks] = useState<FunctionalChecks>({ screen: false, faceid: false, backglass: false, cameras: false })
  const [selectedNew, setSelectedNew] = useState<SelectedNewDevice>({ id: '', name: '', desc: '', price: 0 })
  const [damages, setDamages] = useState<Damage[]>([])

  const tradeInCredit = useMemo(() => {
    const base = tradeInBase[device.model] ?? 0
    const batteryFactor = device.battery / 100
    const damageTotal = damages.reduce((s, x) => s + x.amount, 0)
    return Math.max(0, Math.round((base * batteryFactor - damageTotal) * 100) / 100)
  }, [device, damages, tradeInBase])

  const selectedDevice = availableDevices.find(d => d.id === selectedDeviceId) || null

  const addDamage = (label = 'Scratch', amount = 15) => {
    setDamages(d => [...d, { id: d.length + 1, label, amount }])
  }

  const removeDamage = (id: number) => {
    setDamages(d => d.filter(x => x.id !== id))
  }

  const clearDamages = () => setDamages([])

  const handleSelectDevice = (dev: typeof availableDevices[0]) => {
    setSelectedDeviceId(dev.id)
    setDevice({ model: dev.name, storage: dev.storage, battery: 88 })
  }

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as CanjeStep)
  }

  const handlePrev = () => {
    if (step > 1) setStep((step - 1) as CanjeStep)
  }

  const handleCancel = () => {
    navigate('/iphone-canje')
  }

  const finalize = () => {
    const id = `TC-${Math.floor(Math.random() * 900000) + 100000}`
    toast({ title: 'Éxito', description: `Transacción completada: ${id}` })
    navigate('/iphone-canje')
  }

  return {
    step,
    selectedDeviceId,
    device, setDevice,
    imei, setImei,
    powerOn, setPowerOn,
    icloudLogout, setIcloudLogout,
    deviceColor, setDeviceColor,
    checks, setChecks,
    selectedNew, setSelectedNew,
    damages,
    tradeInCredit,
    selectedDevice,
    availableDevices,
    newDevices,
    colorOptions: COLOR_OPTIONS,
    addDamage,
    removeDamage,
    clearDamages,
    handleSelectDevice,
    handleNext,
    handlePrev,
    handleCancel,
    finalize,
  }
}

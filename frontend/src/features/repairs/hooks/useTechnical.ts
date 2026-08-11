import { useState, useRef, useEffect } from 'react'
import type { RepairData } from '../RepairFlow'
import type { RepairTechnicalProps } from '../types/technical.types'
import { DEFAULT_REPAIR_DATA } from '../constants/technical.constants'

export function useTechnical({ data, updateData, onNext, onBack, currentStep = 2 }: RepairTechnicalProps) {
  const [localData, setLocalData] = useState<RepairData>(DEFAULT_REPAIR_DATA)
  const state = data ?? localData

  const applyUpdate = (updates: Partial<RepairData>) => {
    if (updateData) updateData(updates)
    else setLocalData(prev => ({ ...prev, ...updates }))
  }

  const handleHardwareToggle = (key: string) => {
    const updated = { ...state.hardwareChecks }
    updated[key as keyof typeof state.hardwareChecks] = !updated[key as keyof typeof state.hardwareChecks]
    applyUpdate({ hardwareChecks: updated })
  }

  const functionalCount = Object.values(state.hardwareChecks).filter(Boolean).length

  const isDrawing = useRef(false)
  const seqRef = useRef<number[]>(state.patternSequence ? [...state.patternSequence] : [])
  const [localDots, setLocalDots] = useState<boolean[]>(state.patternDots.slice())
  const [refresh, setRefresh] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsPositionRef = useRef<{ x: number; y: number }[]>([])

  useEffect(() => {
    setLocalDots(state.patternDots.slice())
    seqRef.current = state.patternSequence ? [...state.patternSequence] : []
  }, [state.patternDots, state.patternSequence])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const startX = 35
    const startY = 35
    const spacing = 93
    dotsPositionRef.current = []
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3)
      const col = i % 3
      dotsPositionRef.current.push({
        x: startX + col * spacing,
        y: startY + row * spacing,
      })
    }
    if (seqRef.current.length > 1) {
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      const first = dotsPositionRef.current[seqRef.current[0]]
      ctx.moveTo(first.x, first.y)
      for (let i = 1; i < seqRef.current.length; i++) {
        const dot = dotsPositionRef.current[seqRef.current[i]]
        ctx.lineTo(dot.x, dot.y)
      }
      ctx.stroke()
    }
  }, [refresh, seqRef.current])

  const startDraw = (idx: number, e: React.PointerEvent) => {
    isDrawing.current = true
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId) } catch {}
    if (!seqRef.current.includes(idx)) {
      seqRef.current.push(idx)
      setLocalDots(prev => { const next = [...prev]; next[idx] = true; return next })
      setRefresh(r => r + 1)
    }
  }

  const enterDot = (idx: number) => {
    if (!isDrawing.current) return
    if (!seqRef.current.includes(idx)) {
      seqRef.current.push(idx)
      setLocalDots(prev => { const next = [...prev]; next[idx] = true; return next })
      setRefresh(r => r + 1)
    }
  }

  const endDraw = (e?: React.PointerEvent) => {
    isDrawing.current = false
    if (e) try { (e.currentTarget as Element).releasePointerCapture(e.pointerId) } catch {}
    applyUpdate({ patternSequence: seqRef.current, patternDots: localDots })
  }

  const clearPattern = () => {
    seqRef.current = []
    const cleared = Array(9).fill(false)
    setLocalDots(cleared)
    setRefresh(r => r + 1)
    applyUpdate({ patternSequence: [], patternDots: cleared })
  }

  const safeOnNext = onNext ?? (() => {})
  const safeOnBack = onBack ?? (() => {})

  return {
    state,
    applyUpdate,
    handleHardwareToggle,
    functionalCount,
    localDots,
    canvasRef,
    startDraw,
    enterDot,
    endDraw,
    clearPattern,
    patternSequence: seqRef.current,
    safeOnNext,
    safeOnBack,
    currentStep,
  }
}

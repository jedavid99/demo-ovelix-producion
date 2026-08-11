import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ActivationCode, SubscriptionPlanKey, CodeStats } from '../types/auth.types'
import {
  loadCodesFromStorage,
  generateCodeInStorage,
  deleteCodeFromStorage,
  copyCodeToClipboard,
} from '../services/authApi'

export function useSimpleCodeGenerator() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [codes, setCodes] = useState<ActivationCode[]>([])
  const [newCode, setNewCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanKey>('monthly')
  const [companyData, setCompanyData] = useState({ cuit: '', owner: '', workshopType: '', paymentMethod: '' })

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession === 'true') {
      setIsLoggedIn(true)
      setCodes(loadCodesFromStorage())
    } else {
      navigate('/admin/login')
    }
    setIsChecking(false)
  }, [navigate])

  useEffect(() => {
    const updateStatuses = () => {
      const now = new Date()
      const updatedCodes = codes.map((code) => {
        const expiresAt = new Date(code.expiresAt)
        const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        let status: 'active' | 'expired' | 'expiring_soon' = 'active'
        if (daysUntilExpiry <= 0) status = 'expired'
        else if (daysUntilExpiry <= 7) status = 'expiring_soon'
        return { ...code, status }
      })
      setCodes(updatedCodes)
    }
    updateStatuses()
  }, [codes.length])

  const handleGenerateCode = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newActivationCode = generateCodeInStorage(selectedPlan, companyData, codes)
      setCodes([newActivationCode, ...codes])
      setNewCode(newActivationCode.code)
      setIsGenerating(false)
    }, 500)
  }

  const handleCopyCode = (code: string) => {
    copyCodeToClipboard(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleDeleteCode = (id: string) => {
    const updatedCodes = deleteCodeFromStorage(id, codes)
    setCodes(updatedCodes)
    setShowDeleteConfirm(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_email')
    navigate('/admin/login')
  }

  const stats: CodeStats = {
    total: codes.length,
    active: codes.filter((c) => c.status === 'active' && !c.used).length,
    expiringSoon: codes.filter((c) => c.status === 'expiring_soon').length,
    expired: codes.filter((c) => c.status === 'expired').length,
  }

  return {
    isChecking,
    isLoggedIn,
    codes,
    newCode,
    isGenerating,
    copiedCode,
    showDeleteConfirm, setShowDeleteConfirm,
    selectedPlan, setSelectedPlan,
    companyData, setCompanyData,
    stats,
    handleGenerateCode,
    handleCopyCode,
    handleDeleteCode,
    handleLogout,
  }
}

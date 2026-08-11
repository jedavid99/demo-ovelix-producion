import { useState, useEffect } from 'react'
import type { Company } from '../../types/companies/companies.types'
import { toast } from '@/shared/components/ui/use-toast'
import {
  fetchCompanies as apiFetchCompanies,
  fetchTemplates as apiFetchTemplates,
  createCompany as apiCreateCompany,
  toggleCompanyActive as apiToggleCompanyActive,
  fetchCompanyUsers as apiFetchCompanyUsers,
  toggleUserActive as apiToggleUserActive,
  sendEmailTemplate as apiSendEmailTemplate,
  sendWhatsAppTemplate as apiSendWhatsAppTemplate,
} from '../../services/companies/companiesApi'

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companyUsers, setCompanyUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [showSendTemplateModal, setShowSendTemplateModal] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [whatsappTemplates, setWhatsappTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [selectedWhatsAppTemplate, setSelectedWhatsAppTemplate] = useState<any>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadCompanies()
    loadTemplates()
  }, [])

  const loadCompanies = async () => {
    setLoadError(null)
    try {
      const data = await apiFetchCompanies()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
      setLoadError('Error al cargar las empresas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const data = await apiFetchTemplates()
      setTemplates(data.emails)
      setWhatsappTemplates(data.whatsapp)
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handleCreateCompany = async (data: any) => {
    try {
      await apiCreateCompany(data)
      setShowModal(false)
      loadCompanies()
    } catch (error) {
      console.error('Error creating company:', error)
      throw error
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await apiToggleCompanyActive(id, active)
      loadCompanies()
    } catch (error) {
      console.error('Error toggling company:', error)
    }
  }

  const handleViewDetails = async (company: Company) => {
    setSelectedCompany(company)
    setLoadingUsers(true)
    try {
      const data = await apiFetchCompanyUsers(company.id)
      setCompanyUsers(data)
    } catch (error) {
      console.error('Error fetching company users:', error)
      setCompanyUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleToggleUserActive = async (userId: string, active: boolean) => {
    try {
      await apiToggleUserActive(userId, active)
      setCompanyUsers(prev =>
        prev.map((user: any) => user.id === userId ? { ...user, activo: !active } : user)
      )
    } catch (error) {
      console.error('Error toggling user:', error)
    }
  }

  const handleOpenSendTemplate = async (company: Company) => {
    setSelectedCompany(company)
    setSelectedUsers([])
    setSelectedTemplate(null)
    setSelectedWhatsAppTemplate(null)
    setLoadingUsers(true)
    try {
      const data = await apiFetchCompanyUsers(company.id)
      setCompanyUsers(data)
    } catch (error) {
      console.error('Error fetching company users:', error)
      setCompanyUsers([])
    } finally {
      setLoadingUsers(false)
    }
    setShowSendTemplateModal(true)
  }

  const handleSendTemplate = async () => {
    if (!selectedCompany || (!selectedTemplate && !selectedWhatsAppTemplate) || selectedUsers.length === 0) return
    setSending(true)
    try {
      if (selectedTemplate) {
        await apiSendEmailTemplate(selectedTemplate.id, selectedUsers, selectedCompany.id)
      } else if (selectedWhatsAppTemplate) {
        await apiSendWhatsAppTemplate(selectedWhatsAppTemplate.id, selectedUsers, selectedCompany.id)
      }
      setShowSendTemplateModal(false)
      toast({ title: 'Éxito', description: 'Mensajes enviados exitosamente' })
    } catch (error) {
      console.error('Error sending template:', error)
      toast({ title: 'Error', description: 'Error al enviar mensajes', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  const handleToggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  return {
    companies, loading, loadError,
    showModal, setShowModal,
    selectedCompany, setSelectedCompany, companyUsers, loadingUsers,
    showSendTemplateModal, setShowSendTemplateModal,
    templates, whatsappTemplates,
    selectedTemplate, setSelectedTemplate,
    selectedWhatsAppTemplate, setSelectedWhatsAppTemplate,
    selectedUsers, sending,
    handleCreateCompany, handleToggleActive,
    handleViewDetails, handleToggleUserActive,
    handleOpenSendTemplate, handleSendTemplate,
    handleToggleUserSelection, loadCompanies,
  }
}

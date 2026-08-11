import api from '../../../../services/api'

export async function fetchCompanies(): Promise<any[]> {
  const response = await api.get('/companies')
  const data = response.data.data
  return Array.isArray(data) ? data : []
}

export async function fetchTemplates(): Promise<{ emails: any[]; whatsapp: any[] }> {
  const [emailsResponse, whatsappResponse] = await Promise.all([
    api.get('/templates/emails'),
    api.get('/templates/whatsapp'),
  ])
  return {
    emails: Array.isArray(emailsResponse.data) ? emailsResponse.data : [],
    whatsapp: Array.isArray(whatsappResponse.data) ? whatsappResponse.data : [],
  }
}

export async function createCompany(data: any): Promise<void> {
  await api.post('/companies', data)
}

export async function toggleCompanyActive(id: string, currentActive: boolean): Promise<void> {
  await api.patch(`/companies/${id}/${currentActive ? 'deactivate' : 'activate'}`)
}

export async function fetchCompanyUsers(companyId: string): Promise<any[]> {
  const response = await api.get(`/users?empresa_id=${companyId}`)
  const data = response.data.data
  return Array.isArray(data) ? data.filter((user: any) => user.empresa_id === companyId) : []
}

export async function toggleUserActive(userId: string, currentActive: boolean): Promise<void> {
  await api.patch(`/users/${userId}/${currentActive ? 'deactivate' : 'activate'}`)
}

export async function sendEmailTemplate(templateId: string, userIds: string[], companyId: string): Promise<void> {
  await api.post('/templates/send-email', { templateId, userIds, companyId })
}

export async function sendWhatsAppTemplate(templateId: string, userIds: string[], companyId: string): Promise<void> {
  await api.post('/templates/send-whatsapp', { templateId, userIds, companyId })
}

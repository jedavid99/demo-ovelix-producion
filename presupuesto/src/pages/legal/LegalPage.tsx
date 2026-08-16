import { Navigate } from 'react-router-dom'
import { useTenant } from '../../context/TenantContext'
import LegalPageShell from './LegalPageShell'
import LegalParagraphs from './LegalParagraphs'

export default function LegalPage() {
  const { footer } = useTenant()
  const page = (footer.legalPages ?? []).find(p => p.slug === 'legal')
  if (!page) return <Navigate to="/" replace />
  return (
    <LegalPageShell title={page.label}>
      <LegalParagraphs content={page.content} />
    </LegalPageShell>
  )
}
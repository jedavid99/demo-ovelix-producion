import React from 'react'
import { motion } from 'framer-motion'
import { Key, AlertCircle, Clock, CheckCircle2, Calendar, Copy, MessageCircle, Mail, Trash2 } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import type { ActivationCode } from '../types/auth.types'
import { SUBSCRIPTION_PLANS, CODE_STATUS_COLORS, CODE_STATUS_LABELS } from '../constants/auth.constants'
import { sendWhatsAppReminder, sendGmailReminder } from '../services/authApi'

interface CodeListProps {
  codes: ActivationCode[]
  copiedCode: string | null
  onCopy: (code: string) => void
  onDelete: (id: string) => void
}

const CodeItem: React.FC<{
  code: ActivationCode
  copiedCode: string | null
  onCopy: (code: string) => void
  onDelete: (id: string) => void
}> = ({ code, copiedCode, onCopy, onDelete }) => {
  const expiresAt = new Date(code.expiresAt)
  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const statusColor = code.status === 'expired'
    ? 'bg-red-100 dark:bg-red-900/30'
    : code.status === 'expiring_soon'
    ? 'bg-orange-100 dark:bg-orange-900/30'
    : code.used
    ? 'bg-muted '
    : 'bg-green-100 dark:bg-green-900/30'
  const IconComponent = code.status === 'expired'
    ? AlertCircle
    : code.status === 'expiring_soon'
    ? Clock
    : CheckCircle2
  const iconColor = code.status === 'expired'
    ? 'text-destructive dark:text-red-300'
    : code.status === 'expiring_soon'
    ? 'text-orange-600 dark:text-orange-300'
    : code.used
    ? 'text-muted-foreground dark:text-muted-foreground'
    : 'text-success dark:text-green-300'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 hover:bg-muted  transition-colors ${
        code.status === 'expired' ? 'bg-destructive/10/30 dark:bg-red-950/20' : code.status === 'expiring_soon' ? 'bg-orange-50/30 dark:bg-orange-950/20' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-2 rounded-lg shrink-0 ${statusColor}`}>
            <IconComponent className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-mono font-bold text-foreground">{code.code}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CODE_STATUS_COLORS[code.status] || (code.used ? CODE_STATUS_COLORS.used : CODE_STATUS_COLORS.active)}`}>
                {code.status === 'expired'
                  ? CODE_STATUS_LABELS.expired
                  : code.status === 'expiring_soon'
                  ? `Vence en ${daysUntilExpiry} días`
                  : code.used
                  ? CODE_STATUS_LABELS.used
                  : CODE_STATUS_LABELS.active}
              </span>
            </div>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Plan: {SUBSCRIPTION_PLANS[code.plan].name} ({SUBSCRIPTION_PLANS[code.plan].price})</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Vence: {expiresAt.toLocaleDateString()}</span>
              </div>
              {code.userName && (
                <div className="flex items-center gap-2">
                  <span>Usuario: {code.userName} ({code.userEmail})</span>
                </div>
              )}
              {code.companyDetails && (
                <div className="mt-2 pt-2 border-t border-border ">
                  <p className="font-medium text-foreground mb-1">Datos de la empresa:</p>
                  <div className="space-y-0.5">
                    <p><strong>Razón Social:</strong> {code.companyDetails.razonSocial}</p>
                    <p><strong>Nombre Fantasía:</strong> {code.companyDetails.nombreFantasia}</p>
                    <p><strong>Dirección:</strong> {code.companyDetails.address}</p>
                    {code.companyDetails.googleMapsLink && (
                      <p><strong>Google Maps:</strong> <a href={code.companyDetails.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-blue-300 hover:underline">Ver ubicación</a></p>
                    )}
                    <p><strong>CUIT:</strong> {code.companyDetails.cuit}</p>
                    <p><strong>Dueño:</strong> {code.companyDetails.owner}</p>
                    <p><strong>Tipo:</strong> {code.companyDetails.workshopType}</p>
                    <p><strong>Pago:</strong> {code.companyDetails.paymentMethod}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!code.used && code.status !== 'expired' && (
            <Button variant="outline" size="sm" onClick={() => onCopy(code.code)} className="flex items-center gap-2">
              {copiedCode === code.code ? <><CheckCircle2 className="w-4 h-4" />Copiado</> : <><Copy className="w-4 h-4" />Copiar</>}
            </Button>
          )}
          {code.status === 'expiring_soon' && (
            <>
              <Button variant="outline" size="sm" onClick={() => sendWhatsAppReminder(code)} className="flex items-center gap-2 text-success dark:text-green-400 hover:text-green-700">
                <MessageCircle className="w-4 h-4" />WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={() => sendGmailReminder(code)} className="flex items-center gap-2 text-primary dark:text-blue-400 hover:text-primary">
                <Mail className="w-4 h-4" />Gmail
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={() => onDelete(code.id)} className="flex items-center gap-2 text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />Eliminar
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export const CodeList: React.FC<CodeListProps> = ({
  codes, copiedCode, onCopy, onDelete,
}) => {
  return (
    <Card className="bg-card dark:bg-card border border-border/60">
      <div className="p-6 border-b border-border/60">
        <h2 className="text-lg font-semibold text-foreground">Historial de Códigos</h2>
      </div>
      <div className="divide-y divide-border/60">
        {codes.length === 0 ? (
          <EmptyState icon={Key} title="No hay códigos generados aún" />
        ) : (
          codes.map((code) => (
            <CodeItem
              key={code.id}
              code={code}
              copiedCode={copiedCode}
              onCopy={onCopy}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </Card>
  )
}
export default CodeList

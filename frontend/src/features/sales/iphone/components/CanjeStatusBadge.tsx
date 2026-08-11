import React from 'react'
import { Badge } from '@/shared/components/ui/badge'

interface CanjeStatusBadgeProps {
  variant?: 'success' | 'default' | 'outline'
  children: React.ReactNode
}

export const CanjeStatusBadge: React.FC<CanjeStatusBadgeProps> = ({ variant = 'outline', children }) => {
  return <Badge variant={variant} className="text-[10px]">{children}</Badge>
}
export default CanjeStatusBadge

import React from 'react'
import { cn } from '@/utils/formatters'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  const padMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }
  return (
    <div className={cn('bg-card border border-rule rounded-[14px] shadow-card', padMap[padding], className)}>
      {children}
    </div>
  )
}

interface GroupHeaderProps {
  name: string
  hint?: string
  badge?: React.ReactNode
}

export function GroupHeader({ name, hint, badge }: GroupHeaderProps) {
  return (
    <div className="kit-ghead">
      <span className="gname">{name}</span>
      {hint && <span className="ghint">{hint}</span>}
      {badge}
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('border-t border-rule', className)} />
}

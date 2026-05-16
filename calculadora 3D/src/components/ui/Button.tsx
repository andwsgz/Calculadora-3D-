import React from 'react'
import { cn } from '@/utils/formatters'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'accent' | 'danger' | 'on-dark'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
}

export function Button({
  variant = 'ghost',
  size = 'md',
  icon,
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const sizeMap = { sm: 'px-3 py-2', md: 'px-4 py-2.5', lg: 'px-6 py-3' }
  return (
    <button
      className={cn(
        'kit-btn inline-flex items-center gap-2',
        variant === 'primary' && 'primary',
        variant === 'accent'  && 'accent',
        variant === 'on-dark' && 'on-dark',
        variant === 'danger'  && 'border-warn text-warn hover:bg-warn hover:text-paper',
        sizeMap[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon}
      {children}
    </button>
  )
}

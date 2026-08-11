import * as React from 'react'
import { cn } from '../../lib/utils'
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & { error?: boolean | string; size?: 'default' | 'sm' | 'lg'; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode }>(
  ({ className, type, error, size = 'default', leftIcon, rightIcon, ...props }, ref) => {
    const sizeClasses: Record<string, string> = {
      default: 'h-10 px-4 py-2.5 text-sm',
      sm: 'h-8 px-3 py-2 text-xs',
      lg: 'h-12 px-5 py-3 text-base',
    }
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary/20 selection:text-primary-foreground w-full min-w-0 rounded border bg-background text-foreground transition-all duration-150 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            sizeClasses[size],
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            'border-input focus:border-ring focus:ring-2 focus:ring-ring/20',
            error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : '',
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {rightIcon}
          </div>
        )}
        {error && typeof error === 'string' && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input }

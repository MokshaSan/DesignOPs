import { ReactNode, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

// ─── Card ──────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
}

export function Card({ children, className, onClick, glass }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border transition-all duration-200',
        glass
          ? 'bg-white/5 border-white/10 backdrop-blur-md'
          : 'bg-white dark:bg-dark-card border-gray-100 dark:border-dark-border',
        onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
        'shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Button ────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 inline-flex items-center justify-center gap-2',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50',
        variant === 'secondary' && 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50',
        variant === 'ghost' && 'bg-transparent hover:bg-gray-100 dark:hover:bg-dark-border text-gray-600 dark:text-gray-300',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        'disabled:cursor-not-allowed',
        className
      )}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── Badge ─────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variant === 'success' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      variant === 'warning' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      variant === 'danger' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      variant === 'info' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      variant === 'purple' && 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
      variant === 'neutral' && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
      className
    )}>
      {children}
    </span>
  );
}

// ─── Toggle ────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, disabled, size = 'md' }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
        checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow-lg transform transition duration-200',
          size === 'sm' ? 'h-4 w-4 mt-0.5 ml-0.5' : 'h-5 w-5 mt-0.5 ml-0.5',
          checked && (size === 'sm' ? 'translate-x-4' : 'translate-x-5')
        )}
      />
    </button>
  );
}

// ─── StatusDot ─────────────────────────────────
export function StatusDot({ status }: { status: 'online' | 'offline' | 'warning' | 'error' }) {
  return (
    <span className={cn(
      'inline-block h-2.5 w-2.5 rounded-full',
      status === 'online' && 'bg-green-500',
      status === 'warning' && 'bg-yellow-500 animate-pulse',
      status === 'offline' && 'bg-gray-400',
      status === 'error' && 'bg-red-500 animate-pulse',
    )} />
  );
}

// ─── Slider ────────────────────────────────────
interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, label }: SliderProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      {label && <span className="text-xs text-gray-500 dark:text-gray-400 w-16 shrink-0">{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-primary-600 cursor-pointer"
      />
      <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{value}</span>
    </div>
  );
}

// ─── Section header ────────────────────────────
export function SectionHeader({ title, action, actionLabel }: { title: string; action?: () => void; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {action && actionLabel && (
        <button onClick={action} className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ─── Empty State ───────────────────────────────
export function EmptyState({ icon, title, description }: { icon: string; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}

// ─── Metric Card ───────────────────────────────
export function MetricCard({ label, value, sub, icon, color = 'purple' }: {
  label: string; value: string | number; sub?: string; icon?: string; color?: 'purple' | 'green' | 'blue' | 'orange';
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
        </div>
        {icon && (
          <div className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center text-xl',
            color === 'purple' && 'bg-primary-100 dark:bg-primary-900/30',
            color === 'green' && 'bg-green-100 dark:bg-green-900/30',
            color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30',
            color === 'orange' && 'bg-orange-100 dark:bg-orange-900/30',
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

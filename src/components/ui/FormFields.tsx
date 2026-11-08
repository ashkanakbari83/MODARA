import { useId } from 'react'
import type { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './FormFields.module.css'

interface ShellProps {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}

function FieldShell({ id, label, hint, error, required, children }: ShellProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className={styles.required} aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  error?: string
  required?: boolean
  type?: HTMLInputTypeAttribute
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  /** Use "ltr" for phone numbers, emails and handles. */
  dir?: 'ltr' | 'rtl'
  placeholder?: string
  autoComplete?: string
  maxLength?: number
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  error,
  required,
  type = 'text',
  inputMode,
  dir,
  placeholder,
  autoComplete,
  maxLength,
}: TextFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        className={cn(styles.control, error && styles.invalid)}
        type={type}
        inputMode={inputMode}
        dir={dir}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  )
}

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  error?: string
  rows?: number
}

export function TextAreaField({ label, value, onChange, hint, error, rows = 4 }: TextAreaFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        className={cn(styles.control, styles.textarea, error && styles.invalid)}
        rows={rows}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  )
}

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  options: readonly SelectOption[]
  onChange: (value: string) => void
  hint?: string
  error?: string
}

export function SelectField({ label, value, options, onChange, hint, error }: SelectFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        className={cn(styles.control, styles.select, error && styles.invalid)}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

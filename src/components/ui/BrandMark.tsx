interface BrandMarkProps {
  size?: number
}

/** The MODARA mark: an orbit with a saffron planet. */
export function BrandMark({ size = 32 }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="64" height="64" rx="16" style={{ fill: 'var(--color-primary)' }} />
      <circle
        cx="32"
        cy="32"
        r="14"
        fill="none"
        strokeWidth="4"
        style={{ stroke: 'var(--color-primary-contrast)' }}
      />
      <circle cx="46" cy="32" r="5.5" style={{ fill: 'var(--color-accent)' }} />
    </svg>
  )
}

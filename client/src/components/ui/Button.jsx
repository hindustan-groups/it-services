/**
 * Button component — 3 variants: primary, secondary, outline
 * Features: ripple effect on click, scale press feedback, smooth hover transitions
 */
import { useRef } from 'react'

const variants = {
  primary: [
    'bg-brand-red text-white',
    'hover:bg-[#C01A1F] active:bg-[#A01520]',
    'border border-brand-red hover:border-[#C01A1F]',
  ].join(' '),

  secondary: [
    'bg-brand-blue text-white',
    'hover:bg-[#122D6B] active:bg-[#0E2255]',
    'border border-brand-blue hover:border-[#122D6B]',
  ].join(' '),

  outline: [
    'bg-transparent text-brand-blue',
    'border border-brand-blue',
    'hover:bg-brand-blue hover:text-white',
    'active:bg-[#122D6B]',
  ].join(' '),

  'outline-red': [
    'bg-transparent text-brand-red',
    'border border-brand-red',
    'hover:bg-brand-red hover:text-white',
    'active:bg-[#C01A1F]',
  ].join(' '),

  ghost: [
    'bg-transparent text-brand-blue',
    'hover:bg-brand-blue/8',
    'border border-transparent',
  ].join(' '),
}

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'|'outline-red'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.fullWidth=false]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.loading=false]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  leftIcon,
  rightIcon,
  type = 'button',
  as: Tag = 'button',
  onClick,
  ...props
}) {
  const btnRef = useRef(null)

  // ── Ripple effect ─────────────────────────────────────────────
  function createRipple(e) {
    const btn = btnRef.current
    if (!btn) return

    // Remove any old ripple
    const old = btn.querySelector('.btn-ripple')
    if (old) old.remove()

    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const isLightRipple = variant === 'primary' || variant === 'secondary'
    const rippleColor = isLightRipple ? 'rgba(255,255,255,0.32)' : 'rgba(26, 62, 140, 0.16)'

    const ripple = document.createElement('span')
    ripple.className = 'btn-ripple'
    Object.assign(ripple.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      borderRadius: '50%',
      background: rippleColor,
      transform: 'scale(0)',
      animation: 'ripple-expand 0.55s ease-out forwards',
      pointerEvents: 'none',
    })

    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
  }

  function handleClick(e) {
    if (!disabled && !loading) {
      createRipple(e)
    }
    onClick?.(e)
  }

  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-md',
    'relative overflow-hidden', // needed for ripple clipping
    'transition-all duration-200 ease-in-out',
    'cursor-pointer select-none',
    'active:scale-[0.96]', // press-down feel
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue',
    disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    fullWidth ? 'w-full' : '',
  ].join(' ')

  return (
    <>
      {/* Ripple keyframes injected once */}
      <style>{`
        @keyframes ripple-expand {
          to { transform: scale(1); opacity: 0; }
        }
      `}</style>

      <Tag
        ref={btnRef}
        type={Tag === 'button' ? type : undefined}
        disabled={Tag === 'button' ? disabled || loading : undefined}
        className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size]} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : leftIcon ? (
          <span className="shrink-0 h-4 w-4">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !loading && <span className="shrink-0 h-4 w-4">{rightIcon}</span>}
      </Tag>
    </>
  )
}

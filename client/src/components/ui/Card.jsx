/**
 * Card component — clean white card with subtle blue-tinted shadow.
 * hover variant adds lift effect for clickable cards.
 */

/**
 * @param {object} props
 * @param {boolean} [props.hoverable=false] — adds hover lift + shadow transition
 * @param {string} [props.className]
 * @param {keyof JSX.IntrinsicElements} [props.as='div']
 */
export default function Card({
  children,
  hoverable = false,
  className = '',
  as: Tag = 'div',
  ...props
}) {
  const isClickable = hoverable || props.onClick || props.to || props.href
  const base = 'bg-white rounded-lg border border-gray-100 block'
  const shadow = 'shadow-[0_2px_8px_0_rgba(26,62,140,0.08)]'
  const hover = hoverable
    ? 'hover:-translate-y-1 hover:shadow-[0_8px_24px_0_rgba(26,62,140,0.14)]'
    : ''
  const interactive = isClickable
    ? 'cursor-pointer active:scale-[0.982] active:translate-y-[1.5px] transition-all duration-150'
    : 'transition-all duration-300'

  return (
    <Tag className={`${base} ${shadow} ${hover} ${interactive} ${className}`} {...props}>
      {children}
    </Tag>
  )
}

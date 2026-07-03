/**
 * SectionHeading — consistent section title block used across all pages.
 * Includes optional eyebrow label, main heading, and subtext.
 */

/**
 * @param {object} props
 * @param {string} [props.eyebrow] — small red-accented label above heading
 * @param {string} props.title — main heading text
 * @param {string} [props.subtitle] — optional paragraph below heading
 * @param {'left'|'center'} [props.align='center']
 * @param {string} [props.className]
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
  light = false,
}) {
  const alignment = align === 'center' ? 'text-center' : 'text-left'
  const titleColor = light ? '!text-white' : 'text-brand-blue'
  const subtitleColor = light ? '!text-white/70' : 'text-text-muted'

  return (
    <div className={`${alignment} ${className}`}>
      {eyebrow && (
        <span className="inline-block mb-3 text-sm font-semibold tracking-widest uppercase text-brand-red">
          {eyebrow}
        </span>
      )}
      <h2 className={`font-heading text-3xl sm:text-4xl font-bold ${titleColor} leading-tight`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg ${subtitleColor} max-w-2xl leading-relaxed mx-auto`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GlobalClickRipple() {
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const handleClick = (e) => {
      // Don't show ripple if it was triggered by keyboard (e.clientX/Y are 0 or negative)
      if (e.clientX <= 0 && e.clientY <= 0) return

      // Don't trigger ripple inside inputs/textareas to avoid typing distraction
      const target = e.target
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const id = Date.now() + Math.random()
      const newRipple = {
        id,
        x: e.clientX,
        y: e.clientY,
      }
      setRipples((prev) => [...prev, newRipple].slice(-5)) // Keep at most 5 ripples in state
    }

    window.addEventListener('click', handleClick, { passive: true })
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-9999 overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{
              position: 'fixed',
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
              x: '-50%',
              y: '-50%',
              borderRadius: '50%',
              border: '2px solid rgba(227, 30, 36, 0.45)', // Translucent brand red
              backgroundColor: 'rgba(227, 30, 36, 0.05)',
              opacity: 0.85,
              scale: 0,
            }}
            animate={{
              width: 48,
              height: 48,
              opacity: 0,
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.1, 0.8, 0.3, 1], // Custom fast-out ease
            }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

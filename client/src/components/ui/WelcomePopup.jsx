import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, PhoneCall, ArrowRight, ShieldCheck, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if the user has already seen the popup in this session/device
    const hasSeen = localStorage.getItem('hp_welcome_seen')
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2500) // Show popup after 2.5 seconds
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('hp_welcome_seen', 'true') // Prevent showing it again
  }

  const handleAction = (path) => {
    setIsOpen(false)
    localStorage.setItem('hp_welcome_seen', 'true')
    navigate(path)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl relative w-full max-w-lg z-10 border border-slate-100 flex flex-col"
          >
            {/* Top Decorative Gradient Cover */}
            <div className="h-32 bg-gradient-to-r from-[#1A3E8C] via-[#102a66] to-[#0a1840] p-6 flex items-center relative overflow-hidden shrink-0">
              {/* Background Shapes */}
              <div className="absolute w-48 h-48 rounded-full bg-white/5 -top-12 -right-6 blur-lg pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full bg-blue-400/10 -bottom-8 -left-8 blur-md pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white leading-tight flex items-center gap-1.5 tracking-tight">
                    Hindustan Projects <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  </h3>
                  <p className="text-xs text-blue-200 font-medium">Building Quality, Exceeding Expectations</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer border border-white/15"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 space-y-6 text-slate-700">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  Plan Your Dream Space With India's Leading Project Experts!
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Whether you are planning a modern home construction, a premium commercial project, or high-end office interiors — we deliver class-apart quality with verified timelines and pricing.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { title: 'Free Consultancy', desc: 'Expert site inspection & advice', icon: Sparkles, color: 'text-amber-500 bg-amber-50' },
                  { title: 'Verified Quality', desc: 'Premium materials & execution', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleAction('/contact')}
                  className="flex-1 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-brand-blue/20 flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" /> Get Free Consultation
                </button>
                <button
                  onClick={() => handleAction('/services')}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-3.5 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-1 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Explore Services <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleClose}
                  className="text-[10px] font-semibold text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
                >
                  No thanks, I will browse first
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

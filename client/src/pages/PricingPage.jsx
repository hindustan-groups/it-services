import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ArrowRight,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  Clock,
  Code,
  Layers,
  ChevronDown,
  Server,
  Globe,
  Mail,
  Lock,
  RefreshCw,
  Settings,
  HelpCircle,
  Laptop,
  Smartphone,
  Cpu,
  Palette,
  TrendingUp,
  Award,
  CheckCircle2,
  FileText,
  DollarSign,
  UserCheck,
  Send,
  X,
  Star,
  CheckCircle,
  Shield,
  Rocket,
  Crown,
  Building2,
} from 'lucide-react'
import { Container, Button, SEO } from '@/components/ui'
import { breadcrumbSchema, faqSchema } from '@/components/ui/SEO'
import { useSiteSettings } from '@/hooks/useContent'
import { useContact } from '@/hooks/useContact'
import { useToast } from '@/components/ui/ToastProvider'

// ── 1. Website Development Packages ──────────────────────────────
const WEBSITE_PACKAGES = [
  {
    name: 'Starter',
    icon: Rocket,
    badge: 'Best for Small Business',
    isPopular: false,
    headerGradient: 'from-blue-600 via-indigo-600 to-blue-700',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    price: '₹7,999',
    priceSubtitle: 'Starting From',
    delivery: '5–7 Days',
    support: '7 Days Free Support',
    description: 'Perfect for startups and small businesses looking to launch a fast, modern website.',
    features: [
      'Up to 5 Pages',
      'Mobile Responsive Design',
      'Contact Form',
      'WhatsApp Integration',
      'Google Map',
      'Basic SEO Setup',
      'SSL Setup',
      'Social Media Links',
      'Delivery in 5–7 Days',
      '7 Days Free Support',
    ],
  },
  {
    name: 'Business',
    icon: Zap,
    badge: 'Most Popular',
    isPopular: true,
    headerGradient: 'from-brand-red via-rose-600 to-brand-red-dark',
    iconBg: 'bg-red-50 text-brand-red border-red-200',
    price: '₹14,999',
    priceSubtitle: 'Starting From',
    delivery: '7–12 Days',
    support: '30 Days Free Support',
    description: 'Our most popular package for growing businesses needing dynamic UI, blog & admin portal.',
    features: [
      'Up to 10 Pages',
      'Premium UI Design',
      'Admin Panel',
      'Gallery',
      'Blog',
      'WhatsApp Chat',
      'Google Analytics',
      'Basic Speed Optimization',
      'SEO Ready',
      'Delivery in 7–12 Days',
      '30 Days Free Support',
    ],
  },
  {
    name: 'Professional',
    icon: Crown,
    badge: 'Advanced & Scalable',
    isPopular: false,
    headerGradient: 'from-purple-600 via-violet-600 to-indigo-700',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
    price: '₹24,999',
    priceSubtitle: 'Starting From',
    delivery: '15–20 Days',
    support: '3 Months Support',
    description: 'Ideal for established businesses seeking dynamic features, custom dashboard & payments.',
    features: [
      'Unlimited Pages',
      'Dynamic Website',
      'Custom Dashboard',
      'Payment Gateway',
      'Advanced SEO',
      'Security Optimization',
      'Premium Design',
      'Performance Optimization',
      'Delivery in 15–20 Days',
      '3 Months Support',
    ],
  },
  {
    name: 'Enterprise',
    icon: Building2,
    badge: 'Custom Architecture',
    isPopular: false,
    headerGradient: 'from-slate-800 via-slate-900 to-black',
    iconBg: 'bg-slate-100 text-slate-900 border-slate-300',
    price: 'Custom Quote',
    priceSubtitle: 'Tailored for You',
    delivery: 'Custom Timeline',
    support: 'Dedicated Support',
    description: 'Complete ERP, CRM, HRMS, multi-user platforms & API integrations for large enterprises.',
    features: [
      'ERP',
      'CRM',
      'HRMS',
      'Inventory',
      'API Integrations',
      'Multi User',
      'Custom Dashboard',
      'Dedicated Support',
    ],
  },
]

// ── 2. Software Development ──────────────────────────────────────
const SOFTWARE_SERVICES = [
  { title: 'Billing Software', price: '₹19,999', icon: FileText, desc: 'Fast GST/Non-GST invoicing & POS software for retail, wholesale, and services.', color: 'from-blue-500 to-indigo-600' },
  { title: 'Inventory Software', price: '₹29,999', icon: Layers, desc: 'Real-time stock tracking, automated low-stock alerts, and multi-location management.', color: 'from-amber-500 to-orange-600' },
  { title: 'CRM Development', price: '₹49,999', icon: UserCheck, desc: 'Lead tracking pipeline, client interaction history, automated follow-ups & reporting.', color: 'from-emerald-500 to-teal-600' },
  { title: 'ERP Development', price: '₹99,999', icon: Cpu, desc: 'Complete enterprise resource planning for manufacturing, distribution, and logistics.', color: 'from-purple-500 to-violet-600' },
  { title: 'School Management System', price: 'Custom Quote', icon: Award, desc: 'Student database, online fee collection, attendance, exam portal, and parent app.', color: 'from-rose-500 to-pink-600' },
  { title: 'Hospital Management System', price: 'Custom Quote', icon: ShieldCheck, desc: 'OPD/IPD management, doctor scheduling, pharmacy billing & diagnostic lab reports.', color: 'from-sky-500 to-cyan-600' },
]

// ── 3. Mobile App Development ─────────────────────────────────────
const APP_PACKAGES = [
  { title: 'Basic App', price: '₹24,999', badge: 'Starter App', desc: 'Hybrid mobile app with essential screens, push notifications, and clean UI.', features: ['Cross-Platform (Android/iOS)', 'Basic Backend API', 'Push Notifications', 'Store Submission Help'] },
  { title: 'Business App', price: '₹49,999', badge: 'Most Demanded', desc: 'Feature-packed mobile application with user accounts & payment gateways.', features: ['User Accounts & Auth', 'Payment Gateway Integration', 'Admin Control Panel', 'Analytics & Reporting'] },
  { title: 'Professional App', price: '₹79,999', badge: 'Advanced Tech', desc: 'High-performance app with real-time tracking, chat, and offline capabilities.', features: ['Real-time Data Sync', 'In-App Live Chat', 'Location & Maps Integration', 'High Scalability'] },
  { title: 'Enterprise App', price: 'Custom Quote', badge: 'Bespoke', desc: 'Complex mobile ecosystems with custom microservices and enterprise security.', features: ['Microservices Backend', 'Custom Security Protocol', 'SLA & 24/7 Monitoring', 'Dedicated Dev Team'] },
]

// ── 4. Branding Services ──────────────────────────────────────────
const BRANDING_SERVICES = [
  { title: 'Logo Design', price: '₹999', icon: Palette },
  { title: 'Business Card', price: '₹499', icon: FileText },
  { title: 'Letterhead', price: '₹799', icon: FileText },
  { title: 'Company Profile', price: '₹4,999', icon: Globe },
  { title: 'Brochure Design', price: '₹2,999', icon: Layers },
  { title: 'ID Card Design', price: '₹999', icon: UserCheck },
]

// ── 5. Digital Marketing ──────────────────────────────────────────
const MARKETING_SERVICES = [
  { title: 'SEO', price: '₹4,999/month', badge: 'Organic Growth', desc: 'Rank #1 on Google with keyword research, technical SEO, and link building.' },
  { title: 'Google Ads', price: '₹5,999/month', badge: 'Instant Leads', desc: 'High-converting PPC search and display campaigns targeting high-intent buyers.' },
  { title: 'Meta Ads', price: '₹5,999/month', badge: 'Social Reach', desc: 'Targeted Instagram & Facebook ad campaigns with high-converting creative designs.' },
  { title: 'Social Media Management', price: '₹6,999/month', badge: 'Brand Presence', desc: 'Custom graphics, reels content calendar, page management & audience engagement.' },
]

// ── 6. Hosting & Maintenance Feature Cards ───────────────────────
const HOSTING_FEATURES = [
  { title: 'Domain Registration', desc: '.com, .in, .org domain registration & DNS management.', icon: Globe },
  { title: 'Shared Hosting', desc: 'Ultra-fast NVMe SSD cloud hosting with 99.9% uptime guarantee.', icon: Server },
  { title: 'Business Email', desc: 'Professional domain-based email accounts (you@yourcompany.com).', icon: Mail },
  { title: 'SSL Certificate', desc: '256-bit SSL encryption to secure site visitors & boost Google ranking.', icon: Lock },
  { title: 'Website Migration', desc: 'Zero downtime seamless site and database transfer services.', icon: RefreshCw },
  { title: 'Website Maintenance', desc: 'Regular software updates, security malware scans, and weekly backups.', icon: Settings },
  { title: 'AMC Plans', desc: 'Annual Maintenance Contracts for continuous technical support.', icon: ShieldCheck },
]

// ── 7. Why Choose Us Benefits ─────────────────────────────────────
const WHY_CHOOSE_US = [
  { title: 'Responsive Development', desc: 'Flawless performance across smartphones, tablets, and desktop displays.', icon: Laptop },
  { title: 'Affordable Pricing', desc: 'Transparent starting rates with zero hidden charges or surprise fees.', icon: DollarSign },
  { title: 'Modern Technologies', desc: 'Built with React, Next.js, Node.js, and high-performance frameworks.', icon: Code },
  { title: 'Fast Delivery', desc: 'Rapid turnaround with strict milestone deadlines and progress tracking.', icon: Zap },
  { title: 'Transparent Process', desc: 'Clear communication, 40% advance structure, and regular preview updates.', icon: CheckCircle2 },
  { title: 'Long-Term Support', desc: 'Dedicated post-launch technical assistance and maintenance options.', icon: Clock },
  { title: 'SEO Ready', desc: 'Optimized speed, meta tags, and structured data built directly into your site.', icon: TrendingUp },
  { title: 'Secure Development', desc: 'SSL encryption, sanitized inputs, and hardened code protection.', icon: Lock },
]

// ── 8. Development Process Steps ──────────────────────────────────
const PROCESS_STEPS = [
  { step: '01', title: 'Requirement Discussion', desc: 'Understanding your business goals, target audience, and feature list.' },
  { step: '02', title: 'Proposal & Quotation', desc: 'Transparent breakdown of scope, timeline, and competitive pricing.' },
  { step: '03', title: '40% Advance', desc: 'Initiating project milestones upon agreement confirmation.' },
  { step: '04', title: 'UI Design', desc: 'Designing modern interactive wireframes and visual mockups.' },
  { step: '05', title: 'Development', desc: 'Writing clean, optimized code for frontend and backend systems.' },
  { step: '06', title: 'Testing', desc: 'Comprehensive QA, cross-browser compatibility, and speed testing.' },
  { step: '07', title: 'Final Approval', desc: 'Client review, feedback adjustments, and final sign-off.' },
  { step: '08', title: 'Deployment', desc: 'Launching your site live on production servers with SSL.' },
  { step: '09', title: 'Support', desc: 'Providing ongoing post-delivery technical help and training.' },
]

// ── 9. FAQs Accordion Data ────────────────────────────────────────
const FAQS = [
  {
    question: 'How long does a website take?',
    answer:
      'Standard websites take between 5 to 12 days depending on the package selected. Starter websites are delivered in 5–7 days, Business packages in 7–12 days, and custom web applications or enterprise software in 15–20+ days.',
  },
  {
    question: 'Can I upgrade later?',
    answer:
      'Yes, absolutely! You can start with a base package like Starter and upgrade to Business or Professional at any time as your business grows. We ensure seamless upgrades with zero downtime and full content preservation.',
  },
  {
    question: 'Do you provide hosting?',
    answer:
      'Yes! We provide complete domain registration, high-speed NVMe SSD cloud hosting, SSL security certificates, and business email setups as part of our hosting and maintenance services.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept all major payment options including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and direct NEFT/RTGS bank transfers. We operate on a standard 40% advance to start development.',
  },
  {
    question: 'Will I receive support after delivery?',
    answer:
      'Yes! Every package comes with complimentary post-delivery support (ranging from 7 days to 3 months depending on the plan). We also offer Annual Maintenance Contracts (AMC) for ongoing maintenance.',
  },
]

export default function PricingPage() {
  const { data: settingsData } = useSiteSettings()
  const toast = useToast()
  const contactMutation = useContact()

  const cfg = settingsData?.data || {}
  const phone = cfg.phone || '+91 75970 00601'
  const whatsapp = cfg.whatsapp || cfg.phone || '+91 75970 00601'
  const cleanPhone = phone.replace(/[^0-9+]/g, '')
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '')

  // Modal quote state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('General Enquiry')
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Lock body scroll & listen for Escape key when modal is open
  useEffect(() => {
    if (isQuoteModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isQuoteModalOpen) {
        setIsQuoteModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isQuoteModalOpen])

  const openQuoteModal = (planName) => {
    setSelectedPlan(planName || 'General Pricing Quote')
    setIsQuoteModalOpen(true)
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    if (!quoteForm.name || !quoteForm.email || !quoteForm.phone) {
      toast.showError('Please fill in your name, email, and phone number.')
      return
    }

    setFormSubmitting(true)
    try {
      await contactMutation.mutateAsync({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        serviceInterested: selectedPlan,
        message: quoteForm.message || `Interested in ${selectedPlan} package pricing.`,
        recaptchaToken: 'pricing-quote-token',
      })
      toast.showSuccess('Thank you! Your quote request has been sent successfully. We will get back to you shortly.')
      setIsQuoteModalOpen(false)
      setQuoteForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      toast.showError('Failed to submit quote request. Please try again or reach out via WhatsApp.')
    } finally {
      setFormSubmitting(false)
    }
  }

  return (
    <>
      <SEO
        title="Pricing & Packages"
        description="Affordable IT Solutions for Startups, Local Businesses and Enterprises. Transparent pricing for Web Development, Software, Mobile Apps, Branding and Digital Marketing."
        path="/pricing"
        keywords="IT services pricing, website packages Bhilwara, software development cost, mobile app pricing India, SEO package cost, Hindustan Projects pricing"
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing & Packages', path: '/pricing' },
          ]),
          faqSchema(FAQS),
        ]}
      />

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-brand-blue/10 via-brand-red/5 to-bg-base border-b border-gray-100">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/15 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-red/15 rounded-full filter blur-3xl pointer-events-none -z-10" />

        <Container>
          <div className="max-w-4xl mx-auto text-center px-2">
            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-blue/20 shadow-sm text-brand-blue text-xs font-extrabold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-4 h-4 text-brand-red animate-spin" style={{ animationDuration: '4s' }} />
              <span>Transparent &amp; Affordable IT Packages</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-text-dark tracking-tight leading-[1.12]"
            >
              Pricing &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-600 to-brand-red-dark">Packages</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg sm:text-xl font-bold text-brand-blue"
            >
              Affordable IT Solutions for Startups, Local Businesses and Enterprises.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl mx-auto"
            >
              We provide transparent pricing, modern development and long-term support to help your business grow online.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => openQuoteModal('Hero CTA - Free Quote')}
                leftIcon={<Sparkles className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-lg shadow-brand-red/25 hover:shadow-xl hover:shadow-brand-red/35 transition-all"
              >
                Get Free Quote
              </Button>

              <Button
                variant="secondary"
                size="lg"
                as="a"
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Hindustan Projects! I would like to discuss project packages & pricing.')}`}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<MessageSquare className="w-5 h-5" />}
                className="w-full sm:w-auto !bg-[#25D366] hover:!bg-[#20ba5a] !border-[#25D366] shadow-md shadow-emerald-500/20"
              >
                WhatsApp Us
              </Button>
            </motion.div>

            {/* Trust Badges Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-gray-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-text-muted"
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Transparent Quotes</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Fast 5–7 Days Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-brand-blue shrink-0" />
                <span>Secure Development</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-brand-red shrink-0" />
                <span>Long-Term Support</span>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── SECTION NAVIGATION PILLS (Quick Scroll) ─────────────────────── */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs py-3 overflow-x-auto no-scrollbar">
        <Container className="flex items-center justify-start sm:justify-center gap-2 min-w-max px-4">
          <a
            href="#website-packages"
            className="px-3.5 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white text-xs font-bold transition-all duration-200"
          >
            Website Packages
          </a>
          <a
            href="#software-development"
            className="px-3.5 py-1.5 rounded-full bg-gray-100 text-text-dark hover:bg-brand-blue hover:text-white text-xs font-bold transition-all duration-200"
          >
            Software
          </a>
          <a
            href="#mobile-app-development"
            className="px-3.5 py-1.5 rounded-full bg-gray-100 text-text-dark hover:bg-brand-blue hover:text-white text-xs font-bold transition-all duration-200"
          >
            Mobile Apps
          </a>
          <a
            href="#branding-services"
            className="px-3.5 py-1.5 rounded-full bg-gray-100 text-text-dark hover:bg-brand-blue hover:text-white text-xs font-bold transition-all duration-200"
          >
            Branding
          </a>
          <a
            href="#digital-marketing"
            className="px-3.5 py-1.5 rounded-full bg-gray-100 text-text-dark hover:bg-brand-blue hover:text-white text-xs font-bold transition-all duration-200"
          >
            Marketing
          </a>
          <a
            href="#hosting-maintenance"
            className="px-3.5 py-1.5 rounded-full bg-gray-100 text-text-dark hover:bg-brand-blue hover:text-white text-xs font-bold transition-all duration-200"
          >
            Hosting
          </a>
          <a
            href="#development-process"
            className="px-3.5 py-1.5 rounded-full bg-gray-100 text-text-dark hover:bg-brand-blue hover:text-white text-xs font-bold transition-all duration-200"
          >
            Process
          </a>
          <a
            href="#faq-section"
            className="px-3.5 py-1.5 rounded-full bg-gray-100 text-text-dark hover:bg-brand-blue hover:text-white text-xs font-bold transition-all duration-200"
          >
            FAQ
          </a>
        </Container>
      </div>

      {/* ── SECTION 1: WEBSITE DEVELOPMENT PACKAGES ───────────────────── */}
      <section id="website-packages" className="py-16 lg:py-24 bg-bg-base scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 1
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-text-dark">
              Website Development Packages
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-3 leading-relaxed">
              High-performance, mobile-responsive website solutions built to scale your business and capture high-intent leads.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
            {WEBSITE_PACKAGES.map((pkg, idx) => {
              const IconComp = pkg.icon
              return (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`relative flex flex-col justify-between rounded-3xl transition-all duration-300 overflow-hidden ${
                    pkg.isPopular
                      ? 'bg-gradient-to-b from-white via-red-50/40 to-white border-2 border-brand-red shadow-[0_15px_50px_rgba(227,30,36,0.22)] ring-2 ring-brand-red/40 lg:-translate-y-3 z-10'
                      : 'bg-white border border-gray-200/90 hover:border-brand-blue/50 shadow-sm hover:shadow-2xl hover:-translate-y-1.5'
                  }`}
                >
                  {/* Top Colored Gradient Accent Line */}
                  <div className={`h-2.5 w-full bg-gradient-to-r ${pkg.headerGradient}`} />

                  {/* Floating Popular / Category Badge */}
                  {pkg.badge && (
                    <div
                      className={`absolute top-5 right-5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs ${
                        pkg.isPopular
                          ? 'bg-gradient-to-r from-brand-red to-rose-600 text-white'
                          : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                      }`}
                    >
                      {pkg.badge}
                    </div>
                  )}

                  <div className="p-6 sm:p-7">
                    {/* Header Icon + Name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${pkg.iconBg}`}>
                        <IconComp className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-black text-text-dark">
                          {pkg.name}
                        </h3>
                        <span className="text-[11px] font-bold text-emerald-600 block">
                          ✔ Verified Plan
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed min-h-[38px]">
                      {pkg.description}
                    </p>

                    {/* Price Block */}
                    <div className="my-5 pt-4 border-t border-gray-100">
                      <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider block">
                        {pkg.priceSubtitle}
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span
                          className={`font-heading text-3xl sm:text-4xl lg:text-4xl font-black tracking-tight ${
                            pkg.isPopular ? 'text-brand-red' : 'text-brand-blue'
                          }`}
                        >
                          {pkg.price}
                        </span>
                      </div>

                      {/* Delivery & Support Badges */}
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-text-muted">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                          <Zap className="w-3 h-3 text-amber-500" />
                          {pkg.delivery}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                          <Shield className="w-3 h-3 text-brand-blue" />
                          {pkg.support}
                        </span>
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <div className="border-t border-gray-100 pt-5 mb-2">
                      <span className="text-[11px] font-extrabold text-text-dark uppercase tracking-wider block mb-3">
                        Included Features:
                      </span>
                      <ul className="space-y-3">
                        {pkg.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-dark">
                            <span className="p-0.5 rounded-full bg-emerald-500 text-white mt-0.5 shrink-0 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span className="font-semibold">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom CTA Button */}
                  <div className="p-6 sm:p-7 pt-0 border-t border-gray-100/80 mt-auto">
                    <Button
                      variant={pkg.isPopular ? 'primary' : 'outline'}
                      fullWidth
                      onClick={() => openQuoteModal(`Website Package: ${pkg.name}`)}
                      className={pkg.isPopular ? 'shadow-lg shadow-brand-red/30' : ''}
                    >
                      Get Started
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── SECTION 2: SOFTWARE DEVELOPMENT ─────────────────────────────── */}
      <section id="software-development" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-bg-base border-t border-gray-100 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 2
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-text-dark">
              Software Development
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              Custom business software, billing platforms, CRM, and ERP systems designed to streamline daily operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOFTWARE_SERVICES.map((item, idx) => {
              const IconComp = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 hover:border-brand-blue/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h3 className="font-heading text-lg sm:text-xl font-bold text-text-dark group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">Starting From</span>
                      <span className="font-heading text-xl font-extrabold text-brand-red">{item.price}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openQuoteModal(`Software: ${item.title}`)}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Enquire
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── SECTION 3: MOBILE APP DEVELOPMENT ───────────────────────────── */}
      <section id="mobile-app-development" className="py-16 lg:py-24 bg-bg-base border-t border-gray-100 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 3
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-text-dark">
              Mobile App Development
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              High-performance Android and iOS mobile applications published on Google Play &amp; Apple App Store.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {APP_PACKAGES.map((app, idx) => (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-6 border border-gray-200/90 hover:border-brand-blue/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider mb-4">
                    {app.badge}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-text-dark">{app.title}</h3>
                  <div className="mt-3 mb-4">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">Starting From</span>
                    <span className="font-heading text-2xl lg:text-3xl font-black text-brand-blue">{app.price}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mb-5 min-h-[40px]">{app.desc}</p>

                  <ul className="space-y-2.5 border-t border-gray-100 pt-4 mb-6">
                    {app.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-text-dark font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => openQuoteModal(`Mobile App: ${app.title}`)}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SECTION 4: BRANDING SERVICES ────────────────────────────────── */}
      <section id="branding-services" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-bg-base border-t border-gray-100 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 4
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-text-dark">
              Branding Services
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              Craft a distinct corporate identity with professional graphic design and print-ready collaterals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {BRANDING_SERVICES.map((item, idx) => {
              const IconComp = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-gray-200/90 hover:border-brand-red/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-between group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-text-dark mb-2 group-hover:text-brand-red transition-colors">{item.title}</h3>
                  <div className="mt-auto">
                    <span className="text-[9px] text-text-muted uppercase block font-semibold">Starting From</span>
                    <span className="font-heading text-base font-extrabold text-brand-red">{item.price}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── SECTION 5: DIGITAL MARKETING ────────────────────────────────── */}
      <section id="digital-marketing" className="py-16 lg:py-24 bg-bg-base border-t border-gray-100 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 5
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-text-dark">
              Digital Marketing
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              Drive high-intent inquiries, boost sales conversion, and scale ROI across Google and Meta ad platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MARKETING_SERVICES.map((mkt, idx) => (
              <motion.div
                key={mkt.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-6 border border-gray-200/90 hover:border-brand-blue/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-[11px] font-bold uppercase tracking-wider mb-4">
                    {mkt.badge}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-text-dark">{mkt.title}</h3>
                  <div className="mt-3 mb-4">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">Starting From</span>
                    <span className="font-heading text-2xl lg:text-3xl font-black text-brand-blue">{mkt.price}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mb-6 min-h-[48px]">{mkt.desc}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => openQuoteModal(`Digital Marketing: ${mkt.title}`)}
                >
                  Start Campaign
                </Button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SECTION 6: HOSTING & MAINTENANCE ────────────────────────────── */}
      <section id="hosting-maintenance" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-bg-base border-t border-gray-100 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 6
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-text-dark">
              Hosting &amp; Maintenance
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              Enterprise cloud infrastructure, 99.9% uptime server management, and continuous technical support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOSTING_FEATURES.map((feat, idx) => {
              const IconComp = feat.icon
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-6 border border-gray-200/90 hover:border-brand-blue/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-text-dark group-hover:text-brand-blue transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-100 text-right">
                    <button
                      type="button"
                      onClick={() => openQuoteModal(`Hosting & Maintenance: ${feat.title}`)}
                      className="text-xs font-bold text-brand-blue hover:text-brand-red inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Inquire Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── SECTION 7: WHY CHOOSE HINDUSTAN PROJECTS IT SERVICES ────────── */}
      <section id="why-choose-us" className="py-16 lg:py-24 bg-bg-base border-t border-gray-100 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 7
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-text-dark">
              Why Choose Hindustan Projects IT Services
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              We combine technological innovation, regional market expertise, and long-term client partnership commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => {
              const IconComp = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-6 border border-gray-200/90 hover:border-brand-blue/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-text-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── SECTION 8: OUR DEVELOPMENT PROCESS ──────────────────────────── */}
      <section id="development-process" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-bg-base border-t border-gray-100 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 8
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-text-dark">
              Our Development Process
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              A structured 9-step timeline ensuring complete transparency, quality control, and timely milestone delivery.
            </p>
          </div>

          {/* DESKTOP TIMELINE (Horizontal) */}
          <div className="hidden lg:block relative my-12">
            {/* Timeline Horizontal Gradient Line */}
            <div className="absolute top-7 left-[4%] right-[4%] h-1 bg-gradient-to-r from-brand-blue via-brand-red to-brand-blue rounded-full -z-0" />

            <div className="grid grid-cols-9 gap-2 relative z-10">
              {PROCESS_STEPS.map((proc, idx) => (
                <motion.div
                  key={proc.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 rounded-full bg-white border-4 border-brand-blue text-brand-blue font-heading font-black text-sm flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:border-brand-red group-hover:text-brand-red transition-all duration-300">
                    {proc.step}
                  </div>
                  <h3 className="font-heading text-xs font-extrabold text-text-dark mt-4 line-clamp-2 min-h-[32px] group-hover:text-brand-blue transition-colors">
                    {proc.title}
                  </h3>
                  <p className="text-[11px] text-text-muted mt-1 leading-snug px-1">
                    {proc.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* MOBILE & TABLET TIMELINE (Vertical) */}
          <div className="lg:hidden relative pl-6 border-l-2 border-brand-red/40 space-y-8 my-6 ml-4">
            {PROCESS_STEPS.map((proc, idx) => (
              <motion.div
                key={proc.step}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative pl-6"
              >
                {/* Step Circle Pin */}
                <div className="absolute -left-[33px] top-0 w-9 h-9 rounded-full bg-white border-2 border-brand-red text-brand-red font-heading font-extrabold text-xs flex items-center justify-center shadow-md">
                  {proc.step}
                </div>
                <h3 className="font-heading text-base font-bold text-text-dark">
                  {proc.title}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {proc.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SECTION 9: FREQUENTLY ASKED QUESTIONS ───────────────────────── */}
      <section id="faq-section" className="py-16 lg:py-24 bg-bg-base border-t border-gray-100 scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-extrabold uppercase tracking-widest mb-2">
              Section 9
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-text-dark">
              Frequently Asked Questions
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-2">
              Clear answers to common questions about timelines, hosting, upgrades, and payment terms.
            </p>
          </div>

          {/* Accordion Component */}
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-heading font-bold text-base text-text-dark hover:text-brand-blue transition-colors focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-brand-blue shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-brand-red' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 pt-1 text-sm text-text-muted leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom Disclaimer Note */}
          <div className="mt-14 max-w-3xl mx-auto text-center p-5 rounded-2xl bg-brand-blue/5 border border-brand-blue/20 text-xs sm:text-sm text-text-muted shadow-xs">
            <span className="font-bold text-brand-blue">Note: </span>
            "All prices shown are starting prices. Final quotation depends on project requirements, features, integrations and delivery timeline."
          </div>
        </Container>
      </section>

      {/* ── FINAL CTA BANNER ────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-[#0a1936] via-[#122D6B] to-[#0a1936] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/25 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/25 rounded-full filter blur-3xl pointer-events-none" />
        
        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10 px-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-extrabold uppercase tracking-widest mb-4">
              Get Custom Proposal
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Ready to Start Your Project?
            </h2>
            <p className="text-white/80 text-base sm:text-lg mt-4 leading-relaxed max-w-xl mx-auto">
              Let's discuss your requirements and get a custom quotation tailored to your business.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => openQuoteModal('Final CTA Banner - Get Free Quote')}
                leftIcon={<Sparkles className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-xl shadow-brand-red/30"
              >
                Get Free Quote
              </Button>

              <Button
                variant="outline"
                size="lg"
                as="a"
                href={`tel:${cleanPhone}`}
                className="w-full sm:w-auto !text-white !border-white/80 hover:!bg-white hover:!text-brand-blue"
                leftIcon={<Phone className="w-5 h-5" />}
              >
                Call Now
              </Button>

              <Button
                variant="secondary"
                size="lg"
                as="a"
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Hindustan Projects! I want to discuss a new project.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto !bg-[#25D366] hover:!bg-[#20ba5a] !border-[#25D366] !text-white shadow-lg shadow-emerald-500/20"
                leftIcon={<MessageSquare className="w-5 h-5" />}
              >
                WhatsApp Now
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FREE QUOTE MODAL (Rendered via Portal outside PageTransition transform stack) ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isQuoteModalOpen && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Dark blur backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto border border-gray-100"
                >
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="mb-6">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider mb-2">
                      Selected: {selectedPlan}
                    </span>
                    <h3 className="font-heading text-2xl font-extrabold text-text-dark">
                      Request a Free Quote
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Fill in your details below and our technical expert will reach out within 2 hours.
                    </p>
                  </div>

                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="rahul@example.com"
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 99999 99999"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1">
                        Project Requirements / Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Briefly describe what you need (e.g. 5-page website, e-commerce, custom features)..."
                        value={quoteForm.message}
                        onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      loading={formSubmitting}
                      leftIcon={<Send className="w-4 h-4" />}
                      className="shadow-md shadow-brand-red/20"
                    >
                      Submit Quote Request
                    </Button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, ArrowRight, Code2, Tag } from 'lucide-react'
import { Container } from '@/components/ui'
import { useProjects } from '@/hooks/useProjects'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'

const CATEGORIES = ['All', 'Web', 'App', 'Marketing', 'Branding', 'Software']

const CATEGORY_COLORS = {
  Web: 'from-blue-500 to-cyan-400',
  App: 'from-amber-500 to-yellow-400',
  Marketing: 'from-orange-500 to-rose-400',
  Branding: 'from-pink-500 to-rose-400',
  Software: 'from-violet-500 to-purple-400',
}

const PLACEHOLDER_PROJECTS = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    clientName: 'Retail Client, Bhilwara',
    category: 'Web',
    isFeatured: true,
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    description:
      'A full-stack e-commerce platform with inventory management, payment integration, and an admin dashboard for a Bhilwara retail client.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&q=80&auto=format&fit=crop',
    result: '3× sales increase in 60 days',
  },
  {
    id: '7',
    title: 'Hindustan Logistics Mobile App',
    clientName: 'Transport Agency, Bhilwara',
    category: 'App',
    isFeatured: true,
    technologies: ['React Native', 'Firebase', 'Google Maps API'],
    description:
      'Real-time GPS tracking and booking mobile application for a regional logistics provider — live on iOS & Android.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&q=80&auto=format&fit=crop',
    result: '10k+ downloads in first month',
  },
  {
    id: '2',
    title: 'Digital Marketing Campaign',
    clientName: 'Fashion Brand, Jaipur',
    category: 'Marketing',
    isFeatured: true,
    technologies: ['Google Ads', 'Meta Ads', 'SEO'],
    description:
      'Multi-channel digital marketing campaign achieving 3× ROI within 3 months for a fast-growing Jaipur fashion brand.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80&auto=format&fit=crop',
    result: '3× ROI in 3 months',
  },
  {
    id: '3',
    title: 'Corporate Brand Identity',
    clientName: 'Manufacturing Co., Bhilwara',
    category: 'Branding',
    isFeatured: true,
    technologies: ['Figma', 'Adobe Illustrator'],
    description:
      'Complete brand identity design including logo system, brand guidelines, stationery, and marketing collateral for a mid-size manufacturer.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&q=80&auto=format&fit=crop',
    result: 'Brand perceived as industry leader',
  },
  {
    id: '4',
    title: 'ERP System',
    clientName: 'Textile Company, Bhilwara',
    category: 'Software',
    isFeatured: false,
    technologies: ['Node.js', 'React', 'MySQL'],
    description:
      'Custom ERP solution for textile manufacturing — production tracking, inventory management, billing, and reporting in one platform.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=80&auto=format&fit=crop',
    result: '40% operational cost reduction',
  },
  {
    id: '5',
    title: 'Restaurant Website & SEO',
    clientName: 'Local Restaurant, Bhilwara',
    category: 'Web',
    isFeatured: false,
    technologies: ['React', 'Tailwind', 'SEO'],
    description:
      'Responsive website with online menu, table booking, and local SEO to drive footfall for a well-known Bhilwara restaurant.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80&auto=format&fit=crop',
    result: '#1 on Google local results',
  },
  {
    id: '6',
    title: 'Social Media Growth',
    clientName: 'Real Estate Agency',
    category: 'Marketing',
    isFeatured: false,
    technologies: ['Instagram', 'Facebook', 'Canva'],
    description:
      'Organic social media strategy growing followers from 500 to 12k in 6 months and driving consistent inbound leads.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80&auto=format&fit=crop',
    result: '500 → 12k followers in 6 months',
  },
]

/* ── Project Detail Modal ───────────────────────────────────────── */
/* ── Project Detail Modal ───────────────────────────────────────── */
export function ProjectModal({ project, onClose }) {
  const gradColor = CATEGORY_COLORS[project.category] || 'from-brand-blue to-blue-400'
  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex min-h-full justify-center p-4 sm:p-6 md:p-10 text-center">
        {/* Backdrop (Click to close) */}
        <div className="fixed inset-0 -z-10 cursor-pointer" onClick={onClose} aria-hidden="true" />

        {/* Modal Content Box */}
        <motion.div
          className="my-auto inline-block w-full max-w-3xl text-left align-middle bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden z-10 border border-slate-100"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-white hover:bg-brand-red hover:border-transparent hover:rotate-90 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Image */}
          {project.thumbnailUrl ? (
            <div className="relative h-60 sm:h-72 md:h-80 overflow-hidden group/image">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Top and Bottom soft shadows for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />

              {/* Floating Badges */}
              <div className="absolute bottom-5 left-5 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradColor} shadow-md`}
                >
                  {project.category}
                </span>
                {project.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-brand-red shadow-md">
                    Featured
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div
              className={`w-full h-44 bg-gradient-to-br ${gradColor} flex items-center justify-center`}
            >
              <span className="font-heading text-5xl font-bold text-white/30">
                {project.title[0]}
              </span>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider block mb-1">
              Case Study Details
            </span>
            <h2
              id="modal-title"
              className="font-heading text-2xl sm:text-3xl font-bold text-brand-blue mb-1 leading-tight"
            >
              {project.title}
            </h2>
            <p className="text-xs text-text-muted mb-6 flex items-center gap-1.5 font-medium">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {project.clientName}
            </p>

            {/* Performance/Result Achievements */}
            {project.result && (
              <div className="flex items-center gap-3.5 p-4.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/55 border border-emerald-100 mb-6 shadow-sm shadow-emerald-500/[0.02]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest leading-none mb-1">
                    Outcome / Impact
                  </p>
                  <p className="text-sm font-bold text-emerald-950 leading-snug">
                    {project.result}
                  </p>
                </div>
              </div>
            )}

            {/* Two Column details grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div className="md:col-span-2 space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-slate-400" />
                  Project Overview
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">{project.description}</p>
              </div>

              {/* Sidebar specs card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div>
                  <span className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">
                    Client Profile
                  </span>
                  <span className="text-xs font-bold text-brand-blue leading-tight block">
                    {project.clientName}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">
                    Project Category
                  </span>
                  <span className="text-xs font-bold text-brand-blue block">
                    {project.category}
                  </span>
                </div>
                {project.technologies?.length > 0 && (
                  <div>
                    <span className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2">
                      Technologies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-brand-blue text-[10px] rounded-lg font-bold shadow-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.liveUrl && (
                  <div className="pt-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit Live Site
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body
  )
}

/* ── Project Card ───────────────────────────────────────────────── */
function ProjectCard({ project, onOpen }) {
  const gradColor = CATEGORY_COLORS[project.category] || 'from-brand-blue to-blue-400'
  return (
    <motion.div variants={fadeUp}>
      <article
        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer
          hover:border-transparent hover:shadow-[0_16px_40px_rgba(26,62,140,0.12)]
          hover:-translate-y-1.5 transition-all duration-300"
        onClick={() => onOpen(project)}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden h-52">
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradColor} flex items-center justify-center`}
            >
              <span className="font-heading text-5xl font-bold text-white/30">
                {project.title[0]}
              </span>
            </div>
          )}
          {/* Gradient overlay always */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Tech tags + description on hover */}
          <div className="absolute inset-0 bg-brand-blue/85 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 backdrop-blur-[2px]">
            <div className="flex flex-wrap gap-1 mb-2">
              {project.technologies?.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded backdrop-blur-sm font-semibold uppercase tracking-wider"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-white/85 font-medium line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Badges (always visible bottom-left) */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${gradColor} shadow-sm`}
            >
              {project.category}
            </span>
            {project.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-brand-red shadow-sm">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          <h3 className="font-heading text-base font-bold text-brand-blue mb-0.5 line-clamp-1 group-hover:text-brand-red transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-xs text-text-muted mb-3">{project.clientName}</p>

          {/* Result pill */}
          {project.result && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 mb-3 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[10px] font-semibold text-emerald-700">{project.result}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100/60 pt-3 mt-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-red group-hover:gap-2.5 transition-all duration-200 font-heading">
              <ArrowRight className="w-3.5 h-3.5" />
              View Case Study
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-brand-blue/90 hover:bg-brand-blue px-2.5 py-1.5 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </article>
    </motion.div>
  )
}

/* ── Portfolio Section ──────────────────────────────────────────── */
export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)

  const { data, isLoading } = useProjects()
  const allProjects = data?.data?.length ? data.data : isLoading ? [] : PLACEHOLDER_PROJECTS

  const filtered =
    activeCategory === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory)

  return (
    <section id="portfolio" className="py-20 bg-gray-50/50" aria-labelledby="portfolio-heading">
      <Container>
        {/* Section heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">
            Our Work
          </span>
          <h2
            id="portfolio-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mb-3"
          >
            Recent Projects
          </h2>
          <p className="text-text-muted max-w-md mx-auto text-sm">
            A selection of projects we've delivered for clients across Rajasthan and India.
          </p>
        </div>

        {/* Filter tabs */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-12"
          role="tablist"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border overflow-hidden active:scale-95 ${
                activeCategory === cat
                  ? 'text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                  : 'bg-white text-text-muted border-gray-200 hover:border-brand-blue/30 hover:text-brand-blue'
              }`}
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="activeCategoryTab"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-brand-blue -z-10"
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
                ))
              : filtered.map((p) => (
                  <ProjectCard key={p.id} project={p} onOpen={setSelectedProject} />
                ))}
          </motion.div>
        </AnimatePresence>

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-text-muted py-16 text-sm">
            No projects in this category yet.
          </p>
        )}
      </Container>

      {/* Project modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

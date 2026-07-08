import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Tag, Clock, Eye, Calendar, ChevronRight, BookOpen, Rss, AlertCircle, TrendingUp } from 'lucide-react'
import { Container, SEO } from '@/components/ui'
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog'
import { fadeUp, staggerContainer } from '@/utils/motion'

const BLOG_CATEGORIES = [
  'Web Development',
  'Digital Marketing',
  'IT Consulting',
  'Custom Software',
  'SEO & Branding',
  'Company News',
  'Our Process',
  'Local Growth',
]

function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

function BlogCard({ post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : ''

  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100/80 hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
        {/* Featured image */}
        <div className="relative h-48 bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 overflow-hidden shrink-0">
          {post.featuredImageUrl ? (
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-brand-blue/20" />
            </div>
          )}
          {/* Category badge */}
          <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-blue text-white shadow-sm">
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="font-heading font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium pt-3 border-t border-gray-100">
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Eye className="w-3.5 h-3.5" />
              {post.viewCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function FeaturedCard({ post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-64 lg:h-auto min-h-[280px] bg-gradient-to-br from-brand-blue to-[#0f2660] overflow-hidden">
            {post.featuredImageUrl ? (
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
            <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-brand-red text-white">
              ★ Featured
            </span>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col justify-center">
            <span className="inline-block text-xs font-bold text-brand-blue bg-brand-blue/8 border border-brand-blue/15 px-3 py-1 rounded-full mb-4 w-fit">
              {post.category}
            </span>
            <h2 className="font-heading font-bold text-gray-900 text-2xl leading-tight mb-3 group-hover:text-brand-blue transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-6">
              {date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {date}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {post.viewCount} views
              </span>
            </div>
            <span className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm group-hover:gap-3 transition-all">
              Read Article <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useBlogPosts({
    page,
    limit: 9,
    category: category || undefined,
    search: activeSearch || undefined,
  })

  const { data: catData } = useBlogCategories()
  const categories = catData?.data || []

  const posts = data?.data || []
  const pagination = data?.pagination || { pages: 1 }

  // Split featured from grid
  const featuredPost = !category && !activeSearch && page === 1
    ? posts.find((p) => p.isFeatured)
    : null
  const gridPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts

  const handleSearch = (e) => {
    e.preventDefault()
    setActiveSearch(search)
    setPage(1)
  }

  const handleCategory = (cat) => {
    setCategory(cat === category ? '' : cat)
    setPage(1)
    setActiveSearch('')
    setSearch('')
  }

  return (
    <>
      <SEO
        title="Blog — IT Insights & Digital Marketing Tips | Hindustan Projects"
        description="Read expert articles on web development, digital marketing, IT consulting, and business growth from the team at Hindustan Projects, Bhilwara."
        path="/blog"
        keywords="IT blog Bhilwara, web development tips India, digital marketing blog Rajasthan, IT consulting articles"
      />

      {/* Hero — Premium Full-Width Responsive Design */}
      <section className="relative overflow-hidden bg-[#040c1a] min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center">

        {/* ── Background: Mesh gradient ── */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,rgba(26,62,140,0.35),transparent),radial-gradient(ellipse_50%_50%_at_10%_80%,rgba(227,30,36,0.12),transparent)]" />

        {/* ── Background: Animated dot/grid pattern ── */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] animate-[grid_25s_linear_infinite]" />

        {/* ── Glowing orbs ── */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-brand-blue/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-brand-red/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-blue/8 rounded-full blur-[120px] pointer-events-none" />

        {/* ── Floating micro particles ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top: '15%', left: '8%',  size: 'w-1 h-1',     color: 'bg-white/25',      anim: 'animate-[float_6s_ease-in-out_infinite]' },
            { top: '60%', left: '12%', size: 'w-1.5 h-1.5', color: 'bg-brand-red/30',  anim: 'animate-[float_9s_ease-in-out_infinite_1s]' },
            { top: '25%', left: '55%', size: 'w-2 h-2',     color: 'bg-brand-blue/25', anim: 'animate-[float_7s_ease-in-out_infinite_0.5s]' },
            { top: '75%', left: '70%', size: 'w-1 h-1',     color: 'bg-white/15',      anim: 'animate-[float_8s_ease-in-out_infinite_2s]' },
            { top: '40%', left: '88%', size: 'w-1.5 h-1.5', color: 'bg-brand-red/20',  anim: 'animate-[float_5s_ease-in-out_infinite_1.5s]' },
          ].map((p, i) => (
            <div key={i} className={`absolute rounded-full ${p.size} ${p.color} ${p.anim}`}
              style={{ top: p.top, left: p.left }} />
          ))}
        </div>

        <Container className="relative z-10 py-28 sm:py-32 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── LEFT: Text Content ── */}
            <div className="flex flex-col items-start">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-red/30 bg-brand-red/10 backdrop-blur-sm mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
                </span>
                <span className="text-[11px] font-bold tracking-widest text-brand-red uppercase">
                  Expert Insights &amp; Tech Trends
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="font-heading text-[2.4rem] sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem] font-black text-white leading-[1.08] mb-5 tracking-tight"
              >
                Knowledge That
                <br />
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e31e24] via-[#ff6b35] to-[#e31e24] animate-gradient">
                    Powers Growth
                  </span>
                  {/* Underline squiggle */}
                  <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 320 10" preserveAspectRatio="none" fill="none">
                    <path d="M0 7 Q40 1 80 7 T160 7 T240 7 T320 7" stroke="#e31e24" strokeWidth="2.5" strokeOpacity="0.45" />
                  </svg>
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
              >
                Practical articles on{' '}
                <span className="text-white/90 font-semibold">web development</span>,{' '}
                <span className="text-white/90 font-semibold">digital marketing</span>, and{' '}
                <span className="text-white/90 font-semibold">IT consulting</span>{' '}
                — curated by Bhilwara&apos;s leading tech team.
              </motion.p>

              {/* Search bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleSearch}
                className="flex w-full max-w-lg gap-2 sm:gap-3"
              >
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40 group-focus-within:text-brand-red transition-colors duration-200" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles, topics..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white/8 backdrop-blur-md border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red/40 focus:bg-white/12 transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 px-5 sm:px-6 py-3.5 bg-gradient-to-br from-brand-red to-red-700 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </motion.form>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap items-center gap-5 mt-8"
              >
                {[
                  { icon: BookOpen, label: 'Articles', value: `${posts?.length || 0}+` },
                  { icon: Tag,      label: 'Categories', value: '8' },
                  { icon: Rss,      label: 'Weekly Updates', value: '✓' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-white/50">
                    <Icon className="w-3.5 h-3.5 text-white/30" />
                    <strong className="text-white/75 font-semibold">{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: Visual Panel (hidden on mobile, shown lg+) ── */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease: 'easeOut' }}
              className="hidden lg:flex items-center justify-center relative overflow-visible"
            >
              <div className="relative w-[420px] h-[460px] xl:w-[460px] xl:h-[500px]">

                {/* ── Outer slow-spinning ring ── */}
                <div className="absolute inset-0 rounded-full border border-white/6 animate-[spin_40s_linear_infinite]" />

                {/* ── Middle dashed orbit ring ── */}
                <div
                  className="absolute rounded-full border-2 border-dashed border-brand-blue/20 animate-[spin_22s_linear_infinite_reverse]"
                  style={{ inset: '38px' }}
                />

                {/* ── Inner glow ring ── */}
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: '76px',
                    background: 'radial-gradient(circle, rgba(26,62,140,0.18) 0%, transparent 70%)',
                    border: '1px solid rgba(26,62,140,0.25)',
                    boxShadow: '0 0 80px rgba(26,62,140,0.25), inset 0 0 40px rgba(26,62,140,0.1)',
                  }}
                />

                {/* ── Central Hub Card ── */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5 text-center shadow-2xl w-36"
                    style={{ boxShadow: '0 0 40px rgba(26,62,140,0.3)' }}>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white font-bold text-sm">Knowledge</p>
                    <p className="text-white/45 text-[10px] mt-0.5 tracking-wide">HUB</p>
                  </div>
                </div>

                {/* ── Category chips on orbit ring ── */}
                {[
                  { label: 'Web Dev',        angle: -90, color: 'from-blue-500/30 to-blue-600/20 border-blue-400/40 text-blue-200' },
                  { label: 'SEO',            angle: -30, color: 'from-green-500/30 to-green-600/20 border-green-400/40 text-green-200' },
                  { label: 'Marketing',      angle:  30, color: 'from-purple-500/30 to-purple-600/20 border-purple-400/40 text-purple-200' },
                  { label: 'IT Consulting',  angle:  90, color: 'from-amber-500/30 to-amber-600/20 border-amber-400/40 text-amber-200' },
                  { label: 'Software',       angle: 150, color: 'from-pink-500/30 to-pink-600/20 border-pink-400/40 text-pink-200' },
                  { label: 'Company News',   angle: 210, color: 'from-cyan-500/30 to-cyan-600/20 border-cyan-400/40 text-cyan-200' },
                ].map(({ label, angle, color }) => {
                  const rad = ((angle - 90) * Math.PI) / 180
                  const w = 420 / 2
                  const r = w - 40
                  const cx = w + Math.cos(rad) * r
                  const cy = w + Math.sin(rad) * r
                  return (
                    <div
                      key={label}
                      className={`absolute px-3 py-1.5 rounded-full border bg-gradient-to-r text-[11px] font-bold whitespace-nowrap backdrop-blur-sm shadow-md ${color}`}
                      style={{ left: cx, top: cy, transform: 'translate(-50%,-50%)' }}
                    >
                      {label}
                    </div>
                  )
                })}

                {/* ── Floating stat card — top right ── */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-6 xl:-right-10"
                >
                  <div className="bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/10 border border-green-400/25 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-none">98%</p>
                      <p className="text-white/50 text-[10px] mt-0.5">Reader Satisfaction</p>
                    </div>
                  </div>
                </motion.div>

                {/* ── Floating stat card — bottom left ── */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.8 }}
                  className="absolute -bottom-4 -left-6 xl:-left-10"
                >
                  <div className="bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-red/20 to-red-700/10 border border-brand-red/25 flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-none">10K+</p>
                      <p className="text-white/50 text-[10px] mt-0.5">Monthly Readers</p>
                    </div>
                  </div>
                </motion.div>

                {/* ── Floating stat card — bottom right ── */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute bottom-8 right-8"
                >
                  <div className="bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue/30 to-brand-blue-dark/20 border border-brand-blue/30 flex items-center justify-center shrink-0">
                      <Rss className="w-4 h-4 text-brand-blue-light" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-none">Weekly</p>
                      <p className="text-white/50 text-[10px] mt-0.5">New Articles</p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleCategory('')}
              className={`shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                !category
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
              }`}
            >
              All Posts
            </button>
            {BLOG_CATEGORIES.map((cat) => {
              const count = categories.find((c) => c.name === cat)?.count || 0
              if (count === 0) return null
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                    category === cat
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
                  }`}
                >
                  {cat} <span className="opacity-60 ml-0.5">({count})</span>
                </button>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-slate-50/30">
        <Container>
          {/* Active search indicator */}
          {activeSearch && (
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
              <Search className="w-4 h-4 text-gray-400" />
              Showing results for <strong>"{activeSearch}"</strong>
              <button
                onClick={() => { setActiveSearch(''); setSearch(''); setPage(1) }}
                className="text-brand-red text-xs font-semibold hover:underline ml-1"
              >
                Clear
              </button>
            </div>
          )}

          {isError ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="font-semibold text-red-700 text-lg mb-2">Failed to Load Articles</p>
              <p className="text-gray-500 text-sm mb-4">{error?.message || 'Something went wrong. Please try again.'}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all"
              >
                Reload Page
              </button>
            </div>
          ) : isLoading ? (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-gray-100 h-72 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-semibold text-gray-700 text-lg">No articles found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different category or search term.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Featured post */}
              {featuredPost && (
                <motion.div variants={fadeUp}>
                  <FeaturedCard post={featuredPost} />
                </motion.div>
              )}

              {/* Grid */}
              {gridPosts.length > 0 && (
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {gridPosts.map((post) => (
                    <motion.div key={post.id} variants={fadeUp}>
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 text-sm font-semibold rounded-xl transition-colors ${
                        page === p
                          ? 'bg-brand-blue text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </Container>
      </section>
    </>
  )
}

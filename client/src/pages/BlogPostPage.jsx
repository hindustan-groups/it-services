import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, Eye, Tag, ArrowLeft, MessageSquare,
  Send, CheckCircle, AlertCircle, Share2, ChevronRight,
  BookOpen, TrendingUp, Link2, ChevronUp,
} from 'lucide-react'
import { Container, SEO } from '@/components/ui'
import { useBlogPost, useBlogComments, useSubmitComment } from '@/hooks/useBlog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { fadeUp } from '@/utils/motion'
import DOMPurify from 'dompurify'
import { SITE } from '@/components/ui/SEO'

const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(100),
  email: z.string().email('Please enter a valid email.'),
  comment: z.string().min(5, 'Comment must be at least 5 characters.').max(2000, 'Too long.'),
  _hp: z.string().optional(),
})

const AVATAR_COLORS = [
  'from-brand-blue to-blue-700',
  'from-brand-red to-red-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-amber-500 to-amber-700',
  'from-pink-500 to-pink-700',
  'from-cyan-500 to-cyan-700',
]

// ── Reading Progress Bar ───────────────────────────────────────
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-brand-red via-orange-400 to-brand-red transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// ── Back To Top ────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!visible) return null
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-6 z-50 w-11 h-11 bg-brand-blue text-white rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center"
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </motion.button>
  )
}

// ── Share Buttons ──────────────────────────────────────────────
function ShareButtons({ title, slug, compact = false }) {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const LiIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
  const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
  const WaIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )

  const buttons = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, bg: 'bg-[#0077b5] hover:bg-[#006399]', Icon: LiIcon },
    { label: 'X / Twitter', href: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`, bg: 'bg-black hover:bg-gray-800', Icon: XIcon },
    { label: 'WhatsApp', href: `https://wa.me/?text=${text}%20${encoded}`, bg: 'bg-[#25D366] hover:bg-[#1db954]', Icon: WaIcon },
  ]

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {buttons.map(({ label, href, bg, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={`Share on ${label}`}
            className={`w-9 h-9 rounded-xl ${bg} text-white flex items-center justify-center hover:-translate-y-0.5 hover:shadow-lg transition-all`}>
            <Icon />
          </a>
        ))}
        <button onClick={copyLink} title="Copy link"
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center hover:-translate-y-0.5 transition-all">
          {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5" /> Share:
      </span>
      {buttons.map(({ label, href, bg, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${bg} text-white`}>
          <Icon /> {label}
        </a>
      ))}
      <button onClick={copyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:-translate-y-0.5">
        {copied
          ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>
          : <><Link2 className="w-3.5 h-3.5" /> Copy Link</>
        }
      </button>
    </div>
  )
}

// ── Related Card ───────────────────────────────────────────────
function RelatedCard({ post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
        <div className="relative h-44 bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 overflow-hidden shrink-0">
          {post.featuredImageUrl ? (
            <img src={post.featuredImageUrl} alt={post.title} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-brand-blue/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span className="absolute top-3 left-3 text-[10px] font-bold bg-brand-blue text-white px-2.5 py-1 rounded-full shadow-sm">
            {post.category}
          </span>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-brand-blue transition-colors line-clamp-2 flex-1">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-3 border-t border-gray-100 mt-auto">
            {date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>}
            {post.readTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} min</span>}
          </div>
        </div>
      </article>
    </Link>
  )
}

// ── Main Export ────────────────────────────────────────────────
export default function BlogPostPage() {
  const { slug } = useParams()
  const [commentSuccess, setCommentSuccess] = useState(false)
  const articleRef = useRef(null)

  const { data, isLoading, isError } = useBlogPost(slug)
  const { data: commentsData } = useBlogComments(slug)
  const submitMutation = useSubmitComment(slug)

  const post = data?.data
  const comments = commentsData?.data || []
  const relatedPosts = post?.relatedPosts || []

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(commentSchema),
  })

  const onCommentSubmit = async (formData) => {
    try {
      await submitMutation.mutateAsync(formData)
      setCommentSuccess(true)
      reset()
      setTimeout(() => setCommentSuccess(false), 8000)
    } catch { /* error shown via submitMutation.isError */ }
  }

  // ── Loading ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="h-[480px] sm:h-[540px] bg-gray-900 animate-pulse" />
        <div className="py-12">
          <Container>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 bg-white rounded-3xl p-10 space-y-4 shadow-sm">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${45 + (i * 7) % 50}%` }} />
                ))}
              </div>
              <div className="w-full lg:w-72 space-y-4">
                <div className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />
                <div className="h-44 bg-white rounded-2xl animate-pulse shadow-sm" />
                <div className="h-36 bg-white rounded-2xl animate-pulse shadow-sm" />
              </div>
            </div>
          </Container>
        </div>
      </div>
    )
  }

  // ── Error / Not found ─────────────────────────────────────
  if (isError || !post) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-bg-base flex items-center justify-center">
        <div className="text-center px-4 max-w-sm">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-gray-300" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-800 mb-3">Article Not Found</h1>
          <p className="text-gray-500 text-sm mb-7 leading-relaxed">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link to="/blog"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const metaTitle = post.metaTitle || post.title
  const metaDescription = post.metaDescription || post.excerpt
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImageUrl || `${SITE.url}/logo-with-bg.png`,
    author: { '@type': 'Organization', name: post.authorName || 'Hindustan Projects' },
    publisher: {
      '@type': 'Organization',
      name: 'Hindustan Projects',
      logo: { '@type': 'ImageObject', url: `${SITE.url}/logo-with-bg.png` },
    },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${post.slug}` },
  }

  return (
    <>
      <SEO
        title={`${metaTitle} | Hindustan Projects Blog`}
        description={metaDescription}
        path={`/blog/${post.slug}`}
        image={post.featuredImageUrl}
        schemas={[articleSchema]}
      />

      <ReadingProgressBar />
      <BackToTop />

      <div className="min-h-screen bg-[#f8f9fc]">

        {/* ════════════════════════════════════════════════════
            HERO — Full-width cover
        ════════════════════════════════════════════════════ */}
        {/* ── HERO — Premium Clean Dark Section ── */}
        <div className="relative w-full pt-16 pb-20 sm:pb-24 lg:pb-32 overflow-hidden bg-[#050e20]">
          
          {/* Glowing blue accent in background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(26,62,140,0.32),transparent)] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

          {/* Dot grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <Container className="relative z-10 pt-20">

            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-xs text-white/40 mb-8 flex-wrap"
            >
              <Link to="/" className="hover:text-white/75 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <Link to="/blog" className="hover:text-white/75 transition-colors">Blog</Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-white/30 truncate max-w-[180px] sm:max-w-sm">{post.title}</span>
            </motion.nav>

            <div className="max-w-3xl">
              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-[11px] font-bold text-brand-red bg-brand-red/15 border border-brand-red/25 px-3.5 py-1.5 rounded-full mb-5 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                {post.category}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-black !text-white leading-[1.15] mb-5 tracking-tight"
              >
                {post.title}
              </motion.h1>

              {/* Excerpt */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="text-white/60 text-base sm:text-lg leading-relaxed mb-7 max-w-2xl"
              >
                {post.excerpt}
              </motion.p>

              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-3"
              >
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/25 shadow-lg bg-white shrink-0">
                    <img src="/logo-with-bg.png" alt="Hindustan Projects" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-none">{post.authorName}</p>
                    <p className="text-white/45 text-[11px] mt-0.5">Hindustan Projects</p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-6 bg-white/15" />

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                  {publishDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {publishDate}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> {post.viewCount} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> {comments.length} comments
                  </span>
                </div>
              </motion.div>
            </div>
          </Container>
        </div>

        {/* ── FEATURED IMAGE CARD (Overlapping) ── */}
        {post.featuredImageUrl && (
          <div className="relative z-20 -mt-12 sm:-mt-20 lg:-mt-24">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="rounded-3xl overflow-hidden shadow-2xl border border-white/8 bg-white aspect-[21/9] w-full max-w-5xl mx-auto"
              >
                <img
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </Container>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            CONTENT — Article + Sidebar
        ════════════════════════════════════════════════════ */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">

              {/* Vertical share bar — xl only */}
              <div className="hidden xl:flex flex-col items-center gap-3 sticky top-28 shrink-0 pt-2" style={{ width: '40px' }}>
                <span
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Share
                </span>
                <div className="w-px h-8 bg-gray-200" />
                <ShareButtons title={post.title} slug={post.slug} compact={true} />
              </div>

              {/* ── ARTICLE ─────────────────────────────── */}
              <motion.article
                ref={articleRef}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex-1 min-w-0"
              >
                {/* Article body card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-12">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                    />
                  </div>

                  {/* Article footer */}
                  <div className="px-6 sm:px-10 lg:px-12 py-7 border-t border-gray-100 bg-gray-50/60 space-y-5">
                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {post.tags.map((tag) => (
                          <Link
                            key={tag}
                            to={`/blog?tag=${encodeURIComponent(tag)}`}
                            className="text-[11px] font-bold bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-500 px-3 py-1 rounded-full transition-all"
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Share + back link */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <ShareButtons title={post.title} slug={post.slug} />
                      <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm text-brand-blue font-semibold hover:gap-3 transition-all group shrink-0"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        All articles
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── COMMENTS ─────────────────────────── */}
                <div className="mt-10">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-10 h-10 rounded-2xl bg-brand-blue/8 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-gray-900 leading-none">
                        Discussion
                        <span className="ml-2 text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full align-middle">
                          {comments.length}
                        </span>
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">Join the conversation below</p>
                    </div>
                  </div>

                  {/* Comment list */}
                  {comments.length > 0 ? (
                    <div className="space-y-4 mb-8">
                      {comments.map((c, i) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}>
                              {c.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                                <span className="font-bold text-sm text-gray-900">{c.name}</span>
                                <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                                  {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">{c.comment}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center mb-8">
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-6 h-6 text-gray-200" />
                      </div>
                      <p className="font-semibold text-gray-500 text-sm">No comments yet</p>
                      <p className="text-gray-400 text-xs mt-1">Be the first to share your thoughts!</p>
                    </div>
                  )}

                  {/* Comment form */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-brand-blue/5 to-transparent">
                      <h3 className="font-heading font-bold text-gray-900 text-lg">Leave a Comment</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Comments are reviewed before appearing publicly.</p>
                    </div>
                    <div className="px-6 sm:px-8 py-7">
                      {commentSuccess ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-5"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-bold text-emerald-800 text-sm">Comment submitted!</p>
                            <p className="text-emerald-700 text-xs mt-0.5 leading-relaxed">
                              Awaiting moderation — will appear once approved.
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSubmit(onCommentSubmit)} className="space-y-5" noValidate>
                          {/* Honeypot */}
                          <input
                            type="text" {...register('_hp')}
                            className="absolute opacity-0 h-0 w-0 pointer-events-none"
                            tabIndex={-1} autoComplete="off" aria-hidden="true"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-bold text-gray-500 block mb-1.5 uppercase tracking-wider">
                                Your Name *
                              </label>
                              <input
                                type="text" {...register('name')} placeholder="John Doe"
                                className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all ${errors.name ? 'border-brand-red bg-red-50' : 'border-gray-200'}`}
                              />
                              {errors.name && (
                                <p className="text-xs text-brand-red mt-1.5 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />{errors.name.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-gray-500 block mb-1.5 uppercase tracking-wider">
                                Email Address *
                              </label>
                              <input
                                type="email" {...register('email')} placeholder="you@example.com"
                                className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all ${errors.email ? 'border-brand-red bg-red-50' : 'border-gray-200'}`}
                              />
                              {errors.email && (
                                <p className="text-xs text-brand-red mt-1.5 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />{errors.email.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-gray-500 block mb-1.5 uppercase tracking-wider">
                              Your Comment *
                            </label>
                            <textarea
                              rows={5} {...register('comment')}
                              placeholder="Share your thoughts, questions, or insights..."
                              className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none ${errors.comment ? 'border-brand-red bg-red-50' : 'border-gray-200'}`}
                            />
                            {errors.comment && (
                              <p className="text-xs text-brand-red mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{errors.comment.message}
                              </p>
                            )}
                          </div>

                          {submitMutation.isError && (
                            <div className="flex items-center gap-2.5 text-sm text-brand-red bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              {submitMutation.error?.message || 'Failed to submit. Please try again.'}
                            </div>
                          )}

                          <div className="flex items-center gap-4 pt-1">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white px-7 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-brand-blue/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                              {isSubmitting ? 'Submitting...' : 'Post Comment'}
                            </button>
                            <p className="text-[11px] text-gray-400">Your email will not be published.</p>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* ── SIDEBAR ──────────────────────────── */}
              <aside className="w-full lg:w-[268px] xl:w-[280px] shrink-0 space-y-5 lg:sticky lg:top-24">

                {/* Author */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-brand-blue/8 to-transparent pointer-events-none" />
                  <div className="relative">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">About the Author</p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md bg-white shrink-0">
                        <img src="/logo-with-bg.png" alt="Hindustan Projects" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{post.authorName}</p>
                        <p className="text-[11px] text-gray-400">Hindustan Projects</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      IT experts in Bhilwara, Rajasthan. Building digital solutions that drive real business growth.
                    </p>
                  </div>
                </div>

                {/* Article stats */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Article Details</p>
                  <div className="space-y-1">
                    {[
                      { icon: Calendar, label: 'Published', value: publishDate, show: !!publishDate },
                      { icon: Clock, label: 'Read Time', value: `${post.readTime} min`, show: true },
                      { icon: Eye, label: 'Views', value: post.viewCount, show: true },
                      { icon: MessageSquare, label: 'Comments', value: comments.length, show: true },
                    ].filter((i) => i.show).map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 text-xs flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-gray-400" /> {label}
                        </span>
                        <span className="font-semibold text-gray-800 text-xs">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          to={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="text-[11px] font-semibold bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 px-2.5 py-1 rounded-full transition-all"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="relative bg-gradient-to-br from-[#1a3e8c] via-[#1a3680] to-[#0f2660] rounded-2xl p-5 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-brand-red/15 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-sm mb-2 leading-snug text-white">Need IT Services?</h3>
                    <p className="text-white/60 text-xs leading-relaxed mb-5">
                      Web development, digital marketing and IT consulting from Bhilwara's trusted tech partner.
                    </p>
                    <Link
                      to="/contact"
                      className="block w-full text-center bg-brand-red hover:bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5"
                    >
                      Get a Free Quote
                    </Link>
                  </div>
                </div>

                {/* Browse more */}
                <Link
                  to="/blog"
                  className="flex items-center gap-2 text-sm text-brand-blue font-semibold hover:gap-3 transition-all group px-1"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Browse all articles
                </Link>
              </aside>
            </div>
          </Container>
        </section>

        {/* ════════════════════════════════════════════════════
            RELATED POSTS
        ════════════════════════════════════════════════════ */}
        {relatedPosts.length > 0 && (
          <section className="py-14 bg-white border-t border-gray-100">
            <Container>
              <div className="flex items-end justify-between mb-8 gap-4">
                <div>
                  <p className="text-xs font-bold text-brand-red uppercase tracking-widest mb-1">Keep Reading</p>
                  <h2 className="font-heading text-2xl sm:text-3xl font-black text-gray-900">Related Articles</h2>
                </div>
                <Link
                  to="/blog"
                  className="shrink-0 text-sm text-brand-blue font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="h-full"
                  >
                    <RelatedCard post={p} />
                  </motion.div>
                ))}
              </div>
            </Container>
          </section>
        )}

      </div>
    </>
  )
}

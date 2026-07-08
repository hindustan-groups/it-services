import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, Eye, Tag, ArrowLeft, MessageSquare,
  Send, CheckCircle, AlertCircle, Share2, ChevronRight, BookOpen,
} from 'lucide-react'
import { Container, SEO } from '@/components/ui'
import { useBlogPost, useBlogComments, useSubmitComment } from '@/hooks/useBlog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { fadeUp, staggerContainer } from '@/utils/motion'
import DOMPurify from 'dompurify'

const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(100),
  email: z.string().email('Please enter a valid email.'),
  comment: z.string().min(5, 'Comment must be at least 5 characters.').max(2000, 'Comment is too long.'),
  _hp: z.string().optional(),
})

function ShareButtons({ title, slug }) {
  const url = `${window.location.origin}/blog/${slug}`
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)

  const buttons = [
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      color: 'bg-[#0077b5] hover:bg-[#006399] text-white',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`,
      color: 'bg-black hover:bg-gray-800 text-white',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${text}%20${encoded}`,
      color: 'bg-[#25D366] hover:bg-[#20ba5a] text-white',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Share:
      </span>
      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${btn.color}`}
        >
          {btn.icon}
          {btn.label}
        </a>
      ))}
    </div>
  )
}

function RelatedCard({ post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="h-32 bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 overflow-hidden">
          {post.featuredImageUrl ? (
            <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-brand-blue/20" />
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wide">{post.category}</span>
          <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug mt-1 mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">{post.title}</h3>
          <p className="text-[11px] text-gray-400">{date} · {post.readTime} min read</p>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [commentSuccess, setCommentSuccess] = useState(false)

  const { data, isLoading, isError } = useBlogPost(slug)
  const { data: commentsData } = useBlogComments(slug)
  const submitMutation = useSubmitComment(slug)

  const post = data?.data
  const comments = commentsData?.data || []
  const relatedPosts = post?.relatedPosts || []

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(commentSchema) })

  const onCommentSubmit = async (formData) => {
    try {
      await submitMutation.mutateAsync(formData)
      setCommentSuccess(true)
      reset()
      setTimeout(() => setCommentSuccess(false), 8000)
    } catch {
      // error shown via submitMutation.isError
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-bg-base">
        <Container className="max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-100 rounded w-24" />
            <div className="h-10 bg-gray-100 rounded w-3/4" />
            <div className="h-5 bg-gray-100 rounded w-1/2" />
            <div className="h-72 bg-gray-100 rounded-2xl" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h1 className="font-heading text-2xl font-bold text-gray-800 mb-2">Article Not Found</h1>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const metaTitle = post.metaTitle || post.title
  const metaDescription = post.metaDescription || post.excerpt
  const publishDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  // JSON-LD Article structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImageUrl || `https://hindustanprojects.com/logo-with-bg.png`,
    author: { '@type': 'Organization', name: post.authorName || 'Hindustan Projects' },
    publisher: {
      '@type': 'Organization',
      name: 'Hindustan Projects',
      logo: { '@type': 'ImageObject', url: 'https://hindustanprojects.com/logo-with-bg.png' },
    },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://hindustanprojects.com/blog/${post.slug}` },
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

      <div className="min-h-screen pt-20 bg-bg-base">
        {/* Hero */}
        <div className="bg-[#050e20] pt-10 pb-12 border-b border-white/5">
          <Container className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-6">
              <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/blog" className="hover:text-white/70 transition-colors">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/60 truncate max-w-[200px]">{post.title}</span>
            </nav>

            <span className="inline-block text-xs font-bold text-brand-red bg-brand-red/10 border border-brand-red/20 px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-white/60 text-base leading-relaxed mb-6 max-w-2xl">{post.excerpt}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 font-medium">
              <span className="text-white/60 font-semibold">By {post.authorName}</span>
              {publishDate && (
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{publishDate}</span>
              )}
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime} min read</span>
              <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{post.viewCount} views</span>
              <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" />{comments.length} comments</span>
            </div>
          </Container>
        </div>

        {/* Featured image */}
        {post.featuredImageUrl && (
          <div className="relative -mb-8 z-10">
            <Container className="max-w-4xl">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 h-72 sm:h-96">
                <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </Container>
          </div>
        )}

        {/* Article content */}
        <section className={`py-12 ${post.featuredImageUrl ? 'pt-20' : ''}`}>
          <Container className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main content */}
              <motion.article
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-8"
              >
                <div
                  className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-strong:text-gray-900 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:leading-relaxed prose-h2:text-2xl prose-h3:text-xl"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                />

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="text-xs font-semibold bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 px-3 py-1 rounded-full transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Share */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ShareButtons title={post.title} slug={post.slug} />
                </div>

                {/* Comments */}
                <div className="mt-12">
                  <h2 className="font-heading text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand-blue" />
                    Comments ({comments.length})
                  </h2>

                  {/* Comment list */}
                  {comments.length > 0 ? (
                    <div className="space-y-4 mb-8">
                      {comments.map((c) => (
                        <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-sm shrink-0">
                              {c.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="font-semibold text-sm text-gray-900">{c.name}</span>
                                <span className="text-[11px] text-gray-400">
                                  {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">{c.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic mb-8">No approved comments yet. Be the first to comment!</p>
                  )}

                  {/* Comment form */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-heading font-bold text-gray-900 mb-5">Leave a Comment</h3>

                    {commentSuccess ? (
                      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-emerald-800 text-sm">Comment submitted!</p>
                          <p className="text-emerald-700 text-xs mt-0.5">Your comment is awaiting moderation and will appear once approved by our team.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit(onCommentSubmit)} className="space-y-4" noValidate>
                        {/* Honeypot */}
                        <input type="text" {...register('_hp')} className="absolute opacity-0 h-0 w-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase tracking-wide">Name *</label>
                            <input
                              type="text"
                              {...register('name')}
                              placeholder="Your name"
                              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all ${errors.name ? 'border-brand-red' : 'border-gray-200'}`}
                            />
                            {errors.name && <p className="text-xs text-brand-red mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name.message}</p>}
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase tracking-wide">Email *</label>
                            <input
                              type="email"
                              {...register('email')}
                              placeholder="your@email.com"
                              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all ${errors.email ? 'border-brand-red' : 'border-gray-200'}`}
                            />
                            {errors.email && <p className="text-xs text-brand-red mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase tracking-wide">Comment *</label>
                          <textarea
                            rows={4}
                            {...register('comment')}
                            placeholder="Share your thoughts..."
                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all resize-none ${errors.comment ? 'border-brand-red' : 'border-gray-200'}`}
                          />
                          {errors.comment && <p className="text-xs text-brand-red mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.comment.message}</p>}
                        </div>

                        {submitMutation.isError && (
                          <div className="flex items-center gap-2 text-sm text-brand-red bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {submitMutation.error?.message || 'Failed to submit comment.'}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all disabled:opacity-60"
                        >
                          <Send className="w-4 h-4" />
                          {isSubmitting ? 'Submitting…' : 'Post Comment'}
                        </button>
                        <p className="text-[11px] text-gray-400">Your email will not be published. Comments are moderated before appearing.</p>
                      </form>
                    )}
                  </div>
                </div>
              </motion.article>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Author */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {post.authorName?.[0]?.toUpperCase() || 'H'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{post.authorName}</p>
                      <p className="text-xs text-gray-500">Hindustan Projects</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">IT services experts based in Bhilwara, Rajasthan. Helping businesses grow digitally since 2019.</p>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-brand-blue to-[#0f2660] rounded-2xl p-5 text-white">
                  <h3 className="font-heading font-bold text-base mb-2">Need IT Services?</h3>
                  <p className="text-white/70 text-xs leading-relaxed mb-4">Get expert web development, digital marketing, and IT consulting from Bhilwara's trusted IT partner.</p>
                  <Link to="/contact" className="inline-block w-full text-center bg-brand-red hover:bg-brand-red/90 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">
                    Get a Free Quote
                  </Link>
                </div>

                {/* Back to blog */}
                <Link to="/blog" className="flex items-center gap-2 text-sm text-brand-blue font-semibold hover:gap-3 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back to all articles
                </Link>
              </aside>
            </div>
          </Container>
        </section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-white border-t border-gray-100">
            <Container>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedPosts.map((p) => <RelatedCard key={p.id} post={p} />)}
              </div>
            </Container>
          </section>
        )}
      </div>
    </>
  )
}

import { useLegalPage } from '@/hooks/useContent'
import { Container, SEO } from '@/components/ui'
import { Calendar, ShieldAlert } from 'lucide-react'

export default function RefundPolicyPage() {
  const { data: page, isLoading, error } = useLegalPage('REFUND_POLICY')

  return (
    <>
      <SEO 
        title={page?.title || 'Refund Policy'} 
        description="Refund policy and cancellation terms for projects with Hindustan Projects."
      />

      <div className="bg-gray-50/50 min-h-screen pt-28 pb-16">
        {/* Header */}
        <section className="relative py-12 bg-[#050e20] text-white overflow-hidden mb-12">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
          <Container className="relative text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-brand-red-light bg-brand-red/10 border border-brand-red/20 uppercase tracking-widest">
              Legal Document
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {page?.title || 'Refund Policy'}
            </h1>
            
            {page?.lastUpdated && (
              <p className="flex items-center justify-center gap-2 text-xs text-white/50">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last Updated: {new Date(page.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </p>
            )}
          </Container>
        </section>

        {/* Content */}
        <Container>
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-4/5" />
              </div>
            ) : error ? (
              <div className="text-center py-10 space-y-3">
                <ShieldAlert className="w-12 h-12 text-brand-red mx-auto" />
                <p className="font-semibold text-gray-700">Failed to load policy</p>
                <p className="text-xs text-gray-400">Make sure the API server is online.</p>
              </div>
            ) : (
              <div 
                className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-brand-blue prose-p:leading-relaxed prose-li:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            )}
          </div>
        </Container>
      </div>
    </>
  )
}

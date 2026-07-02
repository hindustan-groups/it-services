import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const FIELDS = [
  { key: 'phone',      label: 'Phone Number',    placeholder: '+91 99999 99999' },
  { key: 'whatsapp',   label: 'WhatsApp Number', placeholder: '+91 99999 99999' },
  { key: 'email',      label: 'Email Address',   placeholder: 'info@hindustanprojects.com' },
  { key: 'address',    label: 'Office Address',  placeholder: 'Bhilwara, Rajasthan 311001, India' },
  { key: 'linkedin',   label: 'LinkedIn URL',    placeholder: 'https://linkedin.com/company/...' },
  { key: 'instagram',  label: 'Instagram URL',   placeholder: 'https://instagram.com/...' },
  { key: 'facebook',   label: 'Facebook URL',    placeholder: 'https://facebook.com/...' },
  { key: 'tagline',    label: 'Hero Tagline',    placeholder: 'Building Digital Solutions...' },
]

export default function AdminSiteSettingsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting, isSubmitSuccessful } } = useForm()

  useEffect(() => {
    if (data?.data) reset(data.data)
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: d => api.patch('/admin/settings', d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-settings'] }),
  })

  const onSubmit = d => mutation.mutate(d)

  return (
    <>
      <SEO title="Site Settings" noIndex />
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Contact info, social links, and tagline — shown across the website.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">{f.label}</label>
                  <input
                    {...register(f.key)}
                    placeholder={f.placeholder}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue
                      transition-colors"
                  />
                </div>
              ))}

              {mutation.isSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Settings saved successfully.
                </div>
              )}
              {mutation.isError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Failed to save settings.
                </div>
              )}

              <button type="submit" disabled={isSubmitting || mutation.isPending}
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-medium
                  py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 mt-2">
                {mutation.isPending ? 'Saving…' : 'Save Settings'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Type,
  Settings,
  Globe,
  Send,
  Share2,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'
import { useSiteSettings } from '@/hooks/useContent'
import ImageUploader from '@/components/ui/ImageUploader'

const LinkedinIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const InstagramIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const FacebookIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const YoutubeIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
)

const FIELD_GROUPS = [
  {
    label: 'Contact Details',
    fields: [
      { key: 'phone', label: 'Phone Number', placeholder: '+91 99999 99999', Icon: Phone },
      {
        key: 'whatsapp',
        label: 'WhatsApp Number',
        placeholder: '+91 99999 99999',
        Icon: MessageCircle,
      },
      {
        key: 'whatsappMessage',
        label: 'WhatsApp Welcome Message',
        placeholder: 'Hi! I visited your website and want to discuss a project.',
        Icon: MessageCircle,
        isTextarea: true,
      },
      {
        key: 'email',
        label: 'Email Address',
        placeholder: 'info@hindustanprojects.com',
        Icon: Mail,
      },
      {
        key: 'address',
        label: 'Office Address',
        placeholder: 'Bhilwara, Rajasthan 311001, India',
        Icon: MapPin,
        isTextarea: true,
      },
      {
        key: 'googleMapUrl',
        label: 'Google Maps Embed src URL (Copy only src="..." URL from Share -> Embed Map)',
        placeholder: 'https://www.google.com/maps/embed?pb=...',
        Icon: MapPin,
        isTextarea: true,
      },
    ],
  },
  {
    label: 'Social Media Links',
    fields: [
      {
        key: 'linkedin',
        label: 'LinkedIn URL',
        placeholder: 'https://linkedin.com/company/...',
        Icon: LinkedinIcon,
      },
      {
        key: 'instagram',
        label: 'Instagram URL',
        placeholder: 'https://instagram.com/...',
        Icon: InstagramIcon,
      },
      {
        key: 'facebook',
        label: 'Facebook URL',
        placeholder: 'https://facebook.com/...',
        Icon: FacebookIcon,
      },
      {
        key: 'youtube',
        label: 'YouTube Channel URL',
        placeholder: 'https://youtube.com/@...',
        Icon: YoutubeIcon,
      },
    ],
  },
  {
    label: 'Website Branding & Images',
    fields: [
      {
        key: 'tagline',
        label: 'Hero Tagline',
        placeholder: 'Building Digital Solutions...',
        Icon: Type,
        isTextarea: true,
      },
      {
        key: 'hero_image_url',
        label: 'Hero Section Avatar Image (Leave blank to use default corporate portrait)',
        isImage: true,
        Icon: Globe,
      },
      {
        key: 'why_choose_us_image_url',
        label: 'Why Choose Us Section Image (Leave blank to use default corporate layout)',
        isImage: true,
        Icon: Globe,
      },
      {
        key: 'about_hero_laptop_image',
        label: 'About Page Hero Laptop Mockup (Desktop View Screen)',
        isImage: true,
        Icon: Globe,
      },
      {
        key: 'about_hero_phone_image',
        label: 'About Page Hero Phone Mockup (Mobile View Screen)',
        isImage: true,
        Icon: Globe,
      },
    ],
  },
  {
    label: '3D Device Showcase Custom Previews (Optional)',
    fields: [
      {
        key: 'showcase_web_image',
        label: 'Desktop Monitor Mockup Image (Leave blank to use default interactive live UI)',
        isImage: true,
        Icon: Globe,
      },
      {
        key: 'showcase_saas_image',
        label: 'Laptop MacBook Mockup Image (Leave blank to use default interactive live UI)',
        isImage: true,
        Icon: Globe,
      },
      {
        key: 'showcase_mobile_image',
        label: 'iPhone Mobile Mockup Image (Leave blank to use default interactive live UI)',
        isImage: true,
        Icon: Globe,
      },
    ],
  },
  {
    label: 'Company Statistics (Number only)',
    fields: [
      { key: 'stat_projects', label: 'Projects Delivered', placeholder: '50', Icon: Type },
      { key: 'stat_clients', label: 'Happy Clients', placeholder: '40', Icon: Type },
      { key: 'stat_experience', label: 'Years Experience', placeholder: '5', Icon: Type },
      { key: 'stat_cities', label: 'Cities Served', placeholder: '3', Icon: Type },
    ],
  },
]

const inputCls =
  'w-full pl-9 pr-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all'
const textareaCls =
  'w-full pl-9 pr-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all min-h-[70px] resize-y'

export default function AdminSiteSettingsPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useSiteSettings()

  // Bind values dynamically so react-hook-form populates immediately when query finishes
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    values: data?.data || {},
  })

  // Watch fields in real-time for live preview
  const watched = watch()

  const mutation = useMutation({
    mutationFn: (d) => api.patch('/admin/settings', d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site-settings'] }),
  })

  const onSubmit = (d) => mutation.mutate(d)

  return (
    <>
      <SEO title="Site Settings" noIndex />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Site Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage contact info, social links, and tagline shown across the public website.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
                  <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                  <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
            <div className="lg:col-span-5 h-[400px] bg-gray-50 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── Left side: Form Settings ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-5">
              {FIELD_GROUPS.map((group) => (
                <div
                  key={group.label}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Group Header */}
                  <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {group.label}
                    </p>
                  </div>

                  {/* Fields */}
                  <div className="p-5 space-y-4.5">
                    {group.fields.map((f) => (
                      <div key={f.key}>
                        {f.isImage ? (
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 block">
                              {f.label}
                            </label>
                            <ImageUploader
                              value={watched[f.key]}
                              onChange={(url) => setValue(f.key, url, { shouldDirty: true })}
                              label=""
                            />
                          </div>
                        ) : (
                          <>
                            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                              {f.label}
                            </label>
                            <div className="relative">
                              <f.Icon className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                              {f.isTextarea ? (
                                <textarea
                                  {...register(f.key)}
                                  placeholder={f.placeholder}
                                  className={textareaCls}
                                />
                              ) : (
                                <input
                                  {...register(f.key)}
                                  placeholder={f.placeholder}
                                  className={inputCls}
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Status Messages */}
              {mutation.isSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Settings saved successfully.
                </div>
              )}
              {mutation.isError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Failed to save settings.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="w-full bg-brand-blue text-white font-semibold py-3 rounded-xl text-sm hover:shadow-md hover:-translate-y-[1px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Saving…' : 'Save Settings'}
              </button>
            </form>

            {/* ── Right side: Real-Time Live Preview ── */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
              {/* Preview Title */}
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>Live Web Preview</span>
              </div>

              {/* Mock Footer Layout */}
              <div className="border border-gray-100 rounded-2xl shadow-lg overflow-hidden bg-white">
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Mock Footer Section
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div
                  className="p-6 text-white text-left"
                  style={{ background: 'linear-gradient(135deg, #1A3E8C 0%, #0f2660 100%)' }}
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src="/apple-touch-icon.png"
                          alt="Logo"
                          className="w-6 h-6 object-contain bg-white/10 rounded border border-white/20 p-0.5"
                        />
                        <span className="font-heading font-black text-base tracking-tight text-white">
                          Hindustan Projects
                        </span>
                      </div>
                      <p className="text-xs text-white/60 italic leading-relaxed font-light font-sans max-w-sm">
                        "
                        {watched.tagline || 'Building Digital Solutions That Drive Business Growth'}
                        "
                      </p>
                    </div>

                    <hr className="border-white/10" />

                    {/* Contacts */}
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 text-xs text-white/70">
                        <MapPin className="w-3.5 h-3.5 text-white/50 shrink-0 mt-0.5" />
                        <span className="leading-tight">
                          {watched.address || 'Office Address...'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-white/70">
                        <Phone className="w-3.5 h-3.5 text-white/50 shrink-0" />
                        <span>{watched.phone || 'Phone number...'}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-white/70">
                        <Mail className="w-3.5 h-3.5 text-white/50 shrink-0" />
                        <span className="underline decoration-white/20">
                          {watched.email || 'Email address...'}
                        </span>
                      </div>
                    </div>

                    <hr className="border-white/10" />

                    {/* Socials */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer">
                          <LinkedinIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer">
                          <InstagramIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer">
                          <FacebookIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30 font-medium">
                        © {new Date().getFullYear()} Hindustan Projects
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock WhatsApp Chat widget */}
              <div className="border border-gray-100 rounded-2xl shadow-lg overflow-hidden bg-[#E5DDD5]">
                {/* Header */}
                <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shrink-0 shadow">
                  <div className="relative w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 font-heading font-black text-xs text-brand-red">
                    Hi
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-400 border border-[#075E54]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">Hindustan Projects</p>
                    <p className="text-[9px] text-white/70 mt-0.5 leading-none">
                      Typically replies instantly
                    </p>
                  </div>
                </div>

                {/* Message Log */}
                <div className="p-4 space-y-3 font-sans text-xs">
                  {/* Greeting bubble */}
                  <div className="bg-white rounded-r-xl rounded-bl-xl p-2.5 max-w-[85%] shadow-sm relative text-gray-800 leading-normal">
                    <p className="font-semibold text-[10px] text-[#075E54] mb-0.5">Support Desk</p>
                    <p>
                      Hello! Welcome to Hindustan Projects. How can we help you build your digital
                      product today?
                    </p>
                    <span className="text-[8px] text-gray-400 float-right mt-1">10:00 AM</span>
                  </div>

                  {/* Template message draft bubble */}
                  <div className="bg-[#DCF8C6] rounded-l-xl rounded-br-xl p-2.5 max-w-[85%] ml-auto shadow-sm relative text-gray-800 leading-normal border border-[#DCF8C6]">
                    <div className="text-[9px] text-green-700/80 font-bold border-b border-green-200 pb-1 mb-1.5 flex items-center gap-1">
                      <Send className="w-2.5 h-2.5" /> Client WhatsApp Message Draft
                    </div>
                    <p className="italic text-gray-700 whitespace-pre-line font-mono text-[11px] bg-white/40 p-1.5 rounded border border-green-200/30">
                      {watched.whatsappMessage ||
                        'Hi! I visited your website and want to discuss a project.'}
                    </p>
                    <span className="text-[8px] text-green-600/70 float-right mt-1.5">
                      Draft template
                    </span>
                  </div>
                </div>

                {/* Widget Footer info */}
                <div className="bg-white/95 border-t border-gray-100 px-4 py-2.5 flex items-center justify-between text-[10px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>
                      Target Number:{' '}
                      <strong className="font-semibold text-gray-700">
                        {watched.whatsapp || 'Not set'}
                      </strong>
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded font-medium text-[9px]">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

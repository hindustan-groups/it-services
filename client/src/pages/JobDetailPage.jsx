import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Upload,
  AlertCircle,
  FileText,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import { Container, Button, SEO } from '@/components/ui'
import { SITE } from '@/components/ui/SEO'
import { useJobDetail, useApplyJob } from '@/hooks/useCareers'

const JOB_TYPE_LABELS = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
}

const JOB_TYPE_COLORS = {
  FULL_TIME: 'bg-indigo-50 text-indigo-600 border-indigo-150',
  PART_TIME: 'bg-orange-50 text-orange-600 border-orange-150',
  INTERNSHIP: 'bg-emerald-50 text-emerald-600 border-emerald-150',
  CONTRACT: 'bg-amber-50 text-amber-600 border-amber-150',
}

const applySchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(10, 'Valid contact number is required'),
  coverLetter: z.string().optional(),
  _hp: z.string().optional(),
})

export default function JobDetailPage() {
  const { slug } = useParams()
  const { data, isLoading, error } = useJobDetail(slug)
  const applyMutation = useApplyJob(slug)

  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [apiError, setApiError] = useState('')
  const [localLockout, setLocalLockout] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
      _hp: '',
    },
  })

  const job = data?.data

  useEffect(() => {
    if (job?.slug) {
      const lastSubmit = localStorage.getItem(`last_submit_careers_${job.slug}`)
      if (lastSubmit) {
        const timeDiff = Date.now() - parseInt(lastSubmit, 10)
        const oneDay = 24 * 60 * 60 * 1000
        if (timeDiff < oneDay) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLocalLockout(true)
        }
      }
    }
  }, [job?.slug])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFileError('')
    if (!selectedFile) {
      setFile(null)
      return
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const ext = selectedFile.name.split('.').pop().toLowerCase()

    if (!allowedTypes.includes(selectedFile.type) && !['pdf', 'doc', 'docx'].includes(ext)) {
      setFileError('Only PDF and Word documents (.doc, .docx) are allowed.')
      setFile(null)
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError('File size must be under 5MB.')
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const onSubmit = useCallback(async (formData) => {
    setApiError('')

    // Double-check lockout
    const lastSubmit = localStorage.getItem(`last_submit_careers_${job.slug}`)
    if (lastSubmit && Date.now() - parseInt(lastSubmit, 10) < 24 * 60 * 60 * 1000) {
      setApiError('You have already applied for this role within the last 24 hours.')
      return
    }

    if (!file) {
      setFileError('Please upload your resume.')
      return
    }

    let recaptchaToken = 'dev-token'
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
    if (siteKey && typeof window.grecaptcha !== 'undefined') {
      try {
        recaptchaToken = await new Promise((resolve, reject) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(siteKey, { action: 'careers_apply' })
              .then(resolve)
              .catch(reject)
          })
        })
      } catch (err) {
        console.error('[reCAPTCHA] Failed to get token:', err)
      }
    }

    const payload = new FormData()
    payload.append('fullName', formData.fullName)
    payload.append('email', formData.email)
    payload.append('phone', formData.phone)
    if (formData.coverLetter) {
      payload.append('coverLetter', formData.coverLetter)
    }
    payload.append('resume', file)
    payload.append('recaptchaToken', recaptchaToken)
    payload.append('_hp', formData._hp || '')

    try {
      await applyMutation.mutateAsync(payload)
      // eslint-disable-next-line react-hooks/purity
      localStorage.setItem(`last_submit_careers_${job.slug}`, Date.now().toString())
      setLocalLockout(true)
      reset()
      setFile(null)
    } catch (err) {
      setApiError(err.message || 'Failed to submit application. Please try again.')
    }
  }, [job, file, applyMutation, reset])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] bg-gray-50/50">
        <div className="w-8 h-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="bg-gray-50/50 py-20 text-center min-h-[500px] flex items-center justify-center">
        <Container>
          <div className="max-w-md mx-auto space-y-5 bg-white border border-gray-200 rounded-2xl p-8 shadow-md">
            <h2 className="font-heading text-xl font-bold text-brand-blue">Job Posting Expired</h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              The careers posting you are looking for has expired or is no longer accepting
              responses.
            </p>
            <Link to="/careers" className="inline-block mt-2">
              <Button variant="danger" size="sm">
                Back to Careers
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const isGeneral = job.slug === 'general-application'

  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    validThrough: job.deadline || undefined,
    employmentType: job.jobType || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: SITE.name,
      sameAs: SITE.url,
      logo: SITE.logo,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.state,
        postalCode: SITE.address.postalCode,
        addressCountry: SITE.address.country,
      },
    },
    applicantLocationRequirements: { '@type': 'Country', name: 'India' },
    jobLocationType: 'TELECOMMUTE',
  }

  return (
    <>
      <SEO
        title={`${job.title} | Careers at Hindustan Projects`}
        description={job.description?.slice(0, 155) || `Apply for ${job.title} at Hindustan Projects, Bhilwara. Join our growing IT team.`}
        path={`/careers/${job.slug}`}
        keywords={`${job.title} job Bhilwara, IT careers Rajasthan, ${job.department} jobs India`}
        schemas={[jobPostingSchema]}
      />

      <div className="bg-gray-50/50 pt-20 pb-10 sm:pt-24 sm:pb-12 lg:pt-16 lg:pb-16 min-h-screen text-slate-700 relative overflow-hidden">
        <Container className="relative">
          {/* Back link */}
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-brand-blue mb-8 transition-colors duration-150 group"
          >
            <ArrowLeft className="w-4 h-4 text-brand-red group-hover:-translate-x-1 transition-transform" />{' '}
            Back to Careers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left side: Job details */}
            <div className="lg:col-span-2 space-y-8 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="space-y-4 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded border ${JOB_TYPE_COLORS[job.jobType]}`}
                  >
                    {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-150 border border-gray-200 px-3 py-1 rounded">
                    {job.department}
                  </span>
                </div>
                <h1 className="font-heading text-2xl sm:text-4xl font-bold text-brand-blue tracking-tight">
                  {job.title}
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-brand-red shrink-0" />
                    <span>{job.experienceRequired}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600 col-span-2 sm:col-span-1">
                    <Calendar className="w-4 h-4 text-brand-red shrink-0" />
                    <span>
                      Posted:{' '}
                      {new Date(job.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-bold text-brand-blue flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-red animate-pulse" /> Role Overview
                </h2>
                <p className="text-gray-650 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities?.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h2 className="font-heading text-lg font-bold text-brand-blue">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex gap-3 text-gray-650 text-sm leading-relaxed">
                        <span className="text-brand-red font-bold shrink-0 text-lg leading-none">
                          •
                        </span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h2 className="font-heading text-lg font-bold text-brand-blue">
                    What We Are Looking For
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex gap-3 text-gray-650 text-sm leading-relaxed">
                        <span className="text-brand-red font-bold shrink-0 text-sm leading-normal">
                          ✓
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right side: Apply form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-brand-blue" />

                {applyMutation.isSuccess ? (
                  <div className="text-center py-10 space-y-5">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-500">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-bold text-brand-blue">
                        Application Sent!
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed px-2">
                        Thank you for applying. We have sent a confirmation email to your inbox. Our
                        HR team will review your resume within 7 business days.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => applyMutation.reset()}
                      className="w-full mt-4 cursor-pointer active:scale-95"
                    >
                      Apply Again
                    </Button>
                  </div>
                ) : localLockout ? (
                  <div className="text-center py-10 space-y-5">
                    <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-500">
                      <AlertCircle className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-lg font-bold text-brand-blue">
                        Submission Locked
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed px-2">
                        You have already applied for this position in the last 24 hours. To prevent
                        duplicates and spam, please wait before submitting another resume.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h3 className="font-heading text-base font-bold text-brand-blue uppercase tracking-wider mb-2 border-b border-gray-100 pb-3">
                      {isGeneral ? 'General Application' : 'Apply Now'}
                    </h3>

                    {apiError && (
                      <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-500">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{apiError}</span>
                      </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder="e.g. Aditya Sharma"
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none transition-all placeholder-gray-400"
                      />
                      {errors.fullName && (
                        <p className="text-[10px] text-red-500">{errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="e.g. aditya@example.com"
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none transition-all placeholder-gray-400"
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none transition-all placeholder-gray-400"
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Resume Upload */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Upload Resume (PDF, DOC, DOCX - Max 5MB)
                      </label>
                      <div
                        className={`relative border border-dashed rounded-lg bg-gray-50/50 p-4 transition-all text-center ${
                          file
                            ? 'border-emerald-500/50 bg-emerald-500/[0.02]'
                            : 'border-gray-200 hover:border-brand-blue/40'
                        }`}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-1.5">
                          <Upload
                            className={`w-5 h-5 mx-auto ${file ? 'text-emerald-500 animate-bounce' : 'text-gray-400'}`}
                          />
                          {file ? (
                            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold max-w-full truncate px-2">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{file.name}</span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400 leading-normal">
                              Click or drag file to attach
                            </p>
                          )}
                        </div>
                      </div>
                      {fileError && <p className="text-[10px] text-red-400">{fileError}</p>}
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Cover Letter / Notes (Optional)
                      </label>
                      <textarea
                        rows="3"
                        {...register('coverLetter')}
                        placeholder="Tell us briefly why you would like to join..."
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none transition-all placeholder-gray-400 resize-none"
                      />
                    </div>

                    {/* Honeypot field */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                      <input
                        type="text"
                        tabIndex="-1"
                        autoComplete="off"
                        placeholder="Do not fill this"
                        {...register('_hp')}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={applyMutation.isPending}
                      className="w-full mt-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                    >
                      {applyMutation.isPending ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

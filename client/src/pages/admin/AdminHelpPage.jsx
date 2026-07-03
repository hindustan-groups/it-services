/**
 * AdminHelpPage — Help & Documentation guide for non-technical staff.
 * Features collapsible accordions and deployment info cards.
 */
import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Users,
  MessageSquare,
  Key,
  AlertTriangle,
  Cpu,
  Globe,
  Database,
  HardDrive,
  Mail,
  Phone,
  ExternalLink,
  UserCheck,
  FileText,
} from 'lucide-react'
import { SEO } from '@/components/ui'

export default function AdminHelpPage() {
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section))
  }

  const sections = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      subtitle: 'Understand stats cards and metrics',
      icon: LayoutDashboard,
      steps: [
        {
          num: '1',
          title: 'Total Leads',
          desc: 'Shows the number of inquiries submitted through the contact forms. Check the Leads page to view them.',
        },
        {
          num: '2',
          title: 'Total Projects',
          desc: 'The number of portfolio entries currently saved in your database.',
        },
        {
          num: '3',
          title: 'Total Services',
          desc: 'Displays how many different services are currently active and presented to clients.',
        },
      ],
    },
    {
      id: 'services',
      title: 'Managing Services',
      subtitle: 'Add, edit, remove or reorder services',
      icon: Briefcase,
      steps: [
        {
          num: '1',
          title: 'Access Services',
          desc: 'Click "Services" in the sidebar menu to view all listed services.',
        },
        {
          num: '2',
          title: 'Add a Service',
          desc: 'Click the blue "+ Add Service" button, fill in the Title, unique URL Slug, select an Icon, add a short summary, and enter the main description.',
        },
        {
          num: '3',
          title: 'Edit or Delete',
          desc: 'Click the blue Pencil icon on any row to edit, or the red Trash icon to remove a service permanently.',
        },
        {
          num: '4',
          title: 'Control Sorting',
          desc: 'Set the "Display Order" number (e.g. 1, 2, 3) inside the form. Lower numbers will be displayed first on the website.',
        },
      ],
    },
    {
      id: 'projects',
      title: 'Managing Projects & Portfolio',
      subtitle: 'Showcase work, add live demo links and featured tags',
      icon: FolderKanban,
      steps: [
        {
          num: '1',
          title: 'Access Projects',
          desc: 'Click "Projects" in the sidebar menu to view your portfolio case studies.',
        },
        {
          num: '2',
          title: 'Fill Project Details',
          desc: 'Click "+ Add Project", enter Title, Client Name, select Category (Web, App, etc.), and list used technologies separated by commas.',
        },
        {
          num: '3',
          title: 'Add Live Project Link',
          desc: 'Paste the project website address in the "Live Project URL" field. Visitors can click "Live Demo" on the card to visit it instantly.',
        },
        {
          num: '4',
          title: 'Upload Thumbnails',
          desc: 'Use the Image Uploader to attach a project screenshot. Recommended: PNG or JPG files under 5MB for fast loading.',
        },
        {
          num: '5',
          title: 'Set as Featured',
          desc: 'Check the "Featured project" box to make it highlight at the top of the website home page.',
        },
      ],
    },
    {
      id: 'team',
      title: 'Managing Team Members',
      subtitle: 'Manage staff profiles on the About page',
      icon: Users,
      steps: [
        {
          num: '1',
          title: 'Access Team',
          desc: 'Click "Team" in the sidebar to view existing staff member profiles.',
        },
        {
          num: '2',
          title: 'Create Profile',
          desc: 'Click "+ Add Member", fill in Name, Role, a short bio, and paste their LinkedIn URL.',
        },
        {
          num: '3',
          title: 'Upload Photo',
          desc: 'Add a clean portrait photo. Recommended size: square JPG or PNG, under 2MB.',
        },
        {
          num: '4',
          title: 'Sort Team List',
          desc: 'Use the "Order" input inside the profile form to control the sequence on the About page (lower numbers show first).',
        },
      ],
    },
    {
      id: 'leads',
      title: 'Managing Leads & Inquiries',
      subtitle: 'Respond to client forms and update tracking status',
      icon: MessageSquare,
      steps: [
        {
          num: '1',
          title: 'Check Inbound Messages',
          desc: 'Click "Leads" in the sidebar. If new messages have arrived, a red "new" badge will highlight.',
        },
        {
          num: '2',
          title: 'Read Messages',
          desc: "Click on any lead card row to expand it. You will see the client's phone, email, and detailed text.",
        },
        {
          num: '3',
          title: 'Update Status',
          desc: 'Use the status dropdown to mark a lead as New, Contacted, or Closed. This helps your team track follow-up progress.',
        },
      ],
    },
    {
      id: 'careers',
      title: 'Managing Careers & Jobs',
      subtitle: 'Post new roles and manage applicant resumes',
      icon: UserCheck,
      steps: [
        {
          num: '1',
          title: 'Open Careers Dashboard',
          desc: 'Click "Careers" in the sidebar menu. You will see two tabs: Job Postings and Applications.',
        },
        {
          num: '2',
          title: 'Create a Job Posting',
          desc: 'On the Job Postings tab, click "+ Add Job Posting". Fill in details like Title, unique Slug, location, and type (Full-time, Internship, etc.). Write responsibilities and requirements (one per line) in their fields.',
        },
        {
          num: '3',
          title: 'Toggle Posting Visibility',
          desc: 'Toggle the status button to Active (green) to publish the job on the public /careers page. Turn it to Draft (gray) to hide it.',
        },
        {
          num: '4',
          title: 'Review Job Applications',
          desc: 'Click the Applications tab to view candidate profiles. Click "Details" on any row to read their cover letter. Click the "CV" badge to download/preview their resume.',
        },
        {
          num: '5',
          title: 'Update Applicant Status',
          desc: 'Use the status dropdown to mark candidates as New, Shortlisted, Rejected, or Hired to track your recruitment workflow.',
        },
      ],
    },
    {
      id: 'credentials',
      title: 'Login & Password Security',
      subtitle: 'Change admin email, update password, and recover accounts',
      icon: Key,
      steps: [
        {
          num: '1',
          title: 'Open Settings',
          desc: 'Click "Account" under the Settings category in the sidebar.',
        },
        {
          num: '2',
          title: 'Update Email',
          desc: 'Type your new email address in the Email Form, verify using your current password, and click Save.',
        },
        {
          num: '3',
          title: 'Change Password',
          desc: 'Type your current password, type the new password, confirm it, and click Save. Make sure to choose a strong password.',
        },
        {
          num: '4',
          title: 'Lost Password',
          desc: 'If you ever lose access to your administrator email or password, contact the developer immediately. Passwords cannot be recovered directly from this panel for safety.',
        },
      ],
    },
    {
      id: 'legal',
      title: 'Managing Legal Pages',
      subtitle: 'Edit Privacy Policy, Terms of Service, and Refund Policy texts',
      icon: FileText,
      steps: [
        {
          num: '1',
          title: 'Open Legal Editor',
          desc: 'Click "Legal Pages" in the sidebar menu. You will see tabs for Privacy Policy, Terms of Service, and Refund Policy.',
        },
        {
          num: '2',
          title: 'Write and Format',
          desc: 'Use the WYSIWYG editor toolbar to format headers, bold text, insert list items, and create clickable hyperlinks.',
        },
        {
          num: '3',
          title: 'Review for Compliance',
          desc: 'Changes go live instantly. Ensure all edits are reviewed by a legal professional for local compliance before saving.',
        },
        {
          num: '4',
          title: 'Save Progress',
          desc: 'Click "Save Changes" at the bottom of the page. A success message will appear and the change log will record the timestamp and updater.',
        },
      ],
    },
    {
      id: 'notes',
      title: 'Important Best Practices',
      subtitle: 'General guidelines for maintaining a premium website',
      icon: AlertTriangle,
      steps: [
        {
          num: '1',
          title: 'Credential Confidentiality',
          desc: 'Never share your administrator login email or password. Any action taken in this panel changes the live site.',
        },
        {
          num: '2',
          title: 'Compress Images',
          desc: 'Always resize/compress your portfolio images before uploading. Uploading massive camera files slows down load times for visitors.',
        },
        {
          num: '3',
          title: 'Proofread Content',
          desc: 'Double-check text descriptions and phone numbers for typos before saving. Changes go live on the public site immediately.',
        },
      ],
    },
  ]

  return (
    <>
      <SEO title="Help & Guide" noIndex />
      <div className="space-y-6 max-w-4xl">
        {/* Page Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Help & Documentation</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Simple guide to help non-technical staff manage site contents.
            </p>
          </div>
        </div>

        {/* Collapsible Accordion Group */}
        <div className="space-y-3">
          {sections.map((sec) => {
            const Icon = sec.icon
            const isOpen = openSection === sec.id
            return (
              <div
                key={sec.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-brand-blue/35 shadow-md shadow-brand-blue/3'
                    : 'border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left select-none focus:outline-none"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isOpen ? 'bg-brand-blue text-white' : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading text-sm font-bold text-gray-900">{sec.title}</h3>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{sec.subtitle}</p>
                    </div>
                  </div>
                  <div
                    className={`p-1 rounded-lg hover:bg-gray-50 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-blue' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Collapsible Body Content */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-50 bg-gray-50/20">
                    <div className="space-y-4 pt-3">
                      {sec.steps.map((st) => (
                        <div key={st.num} className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-brand-blue/8 border border-brand-blue/15 text-brand-blue font-bold text-xs flex items-center justify-center shrink-0">
                            {st.num}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 leading-normal">
                              {st.title}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1">{st.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* System Deployment Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-gray-900">
                System & Deployment Information
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Technical specifications and storage platforms for this website.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-gray-50/60 border border-gray-100 rounded-xl flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                <Globe className="w-4.5 h-4.5 text-brand-blue font-semibold shrink-0" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">
                  Frontend Client
                </span>
                <span className="text-xs font-bold text-gray-800">
                  React + Vite (HTML5 / Tailwind)
                </span>
              </div>
            </div>
            <div className="p-3.5 bg-gray-50/60 border border-gray-100 rounded-xl flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                <Cpu className="w-4.5 h-4.5 text-brand-blue shrink-0" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">
                  Backend Server API
                </span>
                <span className="text-xs font-bold text-gray-800">Node.js Express Server</span>
              </div>
            </div>
            <div className="p-3.5 bg-gray-50/60 border border-gray-100 rounded-xl flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                <Database className="w-4.5 h-4.5 text-brand-blue shrink-0" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">
                  Database Layer
                </span>
                <span className="text-xs font-bold text-gray-800">PostgreSQL (Hosted on Neon)</span>
              </div>
            </div>
            <div className="p-3.5 bg-gray-50/60 border border-gray-100 rounded-xl flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                <HardDrive className="w-4.5 h-4.5 text-brand-blue shrink-0" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">
                  Media Storage CDN
                </span>
                <span className="text-xs font-bold text-gray-800">
                  Cloudinary (Image Hosting CDN)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Contact Footer Note */}
        <div className="bg-brand-blue/3 border border-brand-blue/8 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-heading text-sm font-bold text-brand-blue">
              Need more help? Contact developer
            </h4>
            <p className="text-xs text-brand-blue/70">
              For support, code modifications, or database inquiries, contact us directly.
            </p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <a
              href="mailto:dilsedilshan1@gmail.com"
              className="flex items-center gap-1.5 bg-white border border-brand-blue/15 text-brand-blue hover:bg-brand-blue/5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-brand-blue" />
              Email Developer
            </a>
            <a
              href="https://wa.me/917742467106"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp Dev
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

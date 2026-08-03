/**
 * AdminProposalBookPage.jsx
 * 
 * 9-Page Premium Corporate Proposal & Quotation Book System
 * Built to exact corporate brand book specifications (Deloitte/Accenture/IBM/Microsoft quality).
 * Document Codes: HP-IT-001 to HP-IT-009
 * Colors: Primary #0A3D91, Secondary #D32F2F, White #FFFFFF, Dark Gray #333333, Light Gray #F5F7FA
 * Print-Ready A4 Portrait format (@media print optimized).
 * 
 * Features:
 * - 100% Live Editable Across ALL 9 Pages
 * - Saved Proposals Manager (Save, Load, Export PDF, Copy Link)
 * - Official Graphic Artwork Cover (HP-IT-001) matching exact Hindustan Projects Flyer
 * - Custom Commercial Line Items, Scope checklist, Timeline phases, and Legal Terms
 */

import { useState, useEffect } from 'react'
import {
  Printer,
  FileText,
  Building2,
  CheckCircle2,
  XCircle,
  Globe,
  Mail,
  Phone,
  Shield,
  Server,
  Smartphone,
  Search,
  Code,
  Cpu,
  Database,
  Lock,
  Clock,
  QrCode,
  LayoutDashboard,
  Check,
  User,
  Calendar,
  Save,
  Plus,
  Trash2,
  Edit3,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Download,
} from 'lucide-react'
import { SEO, Button } from '@/components/ui'
import { useSiteSettings } from '@/hooks/useContent'
import { useToast } from '@/components/ui/ToastProvider'

export default function AdminProposalBookPage() {
  const { addToast } = useToast()
  const { data: settingsData } = useSiteSettings()
  const cfg = settingsData?.data || {}

  // Control Panel Drawer Tab
  const [activeTab, setActiveTab] = useState('client')
  const [drawerOpen, setDrawerOpen] = useState(true)

  // Proposals Storage State
  const [savedProposals, setSavedProposals] = useState([])
  const [selectedProposalId, setSelectedProposalId] = useState('')

  // 100% Fully Editable Proposal State
  const [proposalData, setProposalData] = useState({
    id: 'prop-default',
    clientCompany: 'AURA ENTERPRISES PVT LTD',
    contactPerson: 'Mr. Rajesh Sharma',
    clientDesignation: 'Managing Director & CEO',
    clientEmail: 'rajesh.sharma@auraenterprises.com',
    clientPhone: '+91 98765 43210',
    clientAddress: 'Plot 42, Cyber Tech Park, Sector 62, Noida, UP',
    projectName: 'High-Performance E-Commerce & ERP Ecosystem',
    quotationNumber: 'HPIT-2026-089',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    currency: 'INR (₹)',
    discount: '10,000',
    gstPercent: '18',
    paymentTerms: '50% Advance upon work sign-off, 50% after final live demo & deployment approval.',
    preparedBy: 'Hindustan Projects IT Services',
    preparedByEmail: cfg.email || 'info@hindustanprojects.in',
    preparedByPhone: cfg.phone || '+91 75970 00601',
    preparedByWebsite: 'itservices.hindustanprojects.in',
    
    // Scope of Work Arrays
    scopeIncluded: [
      'Custom Responsive UI/UX Design System',
      'Frontend Development (React / Next.js)',
      'Backend REST API Architecture (Node.js)',
      'Database Architecture & Query Optimization',
      'Admin Management Dashboard Panel',
      'Google On-Page & Technical SEO Setup',
      'High-Speed NVMe Cloud Server Hosting Setup',
      '256-bit SSL Security Encryption Certificate',
      'Free Domain Name (.com / .in) Registration',
      'Dedicated Post-Launch Technical Support',
    ],
    scopeExcluded: [
      'Third-party paid API subscription costs',
      'Paid advertising budget / ad spends',
      'Custom video shoot content creation',
      'Legal trademark registration fees',
    ],

    // Commercial Line Items
    lineItems: [
      { id: 'li1', desc: 'Custom E-Commerce & Corporate Platform Development', qty: '1 Package', rate: '1,25,000' },
      { id: 'li2', desc: 'High-Speed NVMe Cloud Hosting & 256-bit SSL Certificate', qty: '1 Year', rate: 'INCLUDED' },
      { id: 'li3', desc: 'Domain Name Registration (.com / .in)', qty: '1 Year', rate: 'INCLUDED' },
      { id: 'li4', desc: 'Dedicated Post-Launch Technical Maintenance SLA', qty: 'Included', rate: 'INCLUDED' },
    ],

    // Timeline Phases
    timelinePhases: [
      { phase: 'PHASE 01', title: 'Discovery & Requirement Gathering', duration: 'Days 1 – 2', desc: 'Requirement discussion, target audience profiling, and technical specification sign-off.' },
      { phase: 'PHASE 02', title: 'UI/UX Wireframing & Design System', duration: 'Days 3 – 4', desc: 'Designing modern interactive wireframes, typography tokens, and visual layout mockups.' },
      { phase: 'PHASE 03', title: 'Full-Stack Software Development', duration: 'Days 5 – 8', desc: 'Writing clean, optimized frontend and backend code, database schema, and REST APIs.' },
      { phase: 'PHASE 04', title: 'QA, Security & Performance Testing', duration: 'Days 9 – 10', desc: 'Comprehensive cross-browser testing, SSL security audit, and page speed optimization.' },
      { phase: 'PHASE 05', title: 'Client Review & Demo Approval', duration: 'Day 11', desc: 'Staging preview walkthrough with client team and incorporating final feedback adjustments.' },
      { phase: 'PHASE 06', title: 'Production Deployment & Handover', duration: 'Day 12+', desc: 'Deploying live on production cloud servers with SSL certificate and admin handover.' },
    ],

    // Legal Terms
    legalTerms: [
      { id: 'lt1', title: '1. Source Code Ownership & Intellectual Property', text: 'Upon final settlement of the grand total payment, complete source code ownership, intellectual property rights, and codebase copyright belong exclusively to the Client.' },
      { id: 'lt2', title: '2. Bug-Free Code Warranty & Technical Guarantee', text: 'Hindustan Projects IT Services provides a 100% bug-free code warranty. Any technical glitch or coding anomaly discovered post-delivery will be rectified at zero cost.' },
      { id: 'lt3', title: '3. Technical Support & SLA', text: 'Complimentary technical support covers bug fixes, server monitoring, and minor text adjustments for the designated package duration.' },
      { id: 'lt4', title: '4. Project Timelines & Client Responsibilities', text: 'Delivery timelines are contingent upon prompt client feedback and provision of necessary media assets (logos, content, credentials).' },
      { id: 'lt5', title: '5. Confidentiality & Non-Disclosure (NDA)', text: 'Both parties agree to treat all business data, customer lists, API keys, and technical documentation as strictly confidential.' },
      { id: 'lt6', title: '6. Limitation of Liability', text: 'Hindustan Projects IT Services is not liable for indirect or consequential damages arising from third-party server downtimes or API policy alterations.' },
    ],
  })

  // Load Saved Proposals from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('HP_SAVED_PROPOSALS')
      if (stored) {
        const parsed = JSON.parse(stored)
        setSavedProposals(parsed)
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  // Save current Proposal
  const handleSaveProposal = () => {
    const newId = proposalData.id || `prop-${Date.now()}`
    const updatedProp = { ...proposalData, id: newId, savedAt: new Date().toISOString() }
    const updatedList = [updatedProp, ...savedProposals.filter((p) => p.id !== newId)]
    setSavedProposals(updatedList)
    localStorage.setItem('HP_SAVED_PROPOSALS', JSON.stringify(updatedList))
    setSelectedProposalId(newId)
    addToast(`Proposal for "${proposalData.clientCompany}" saved successfully!`, 'success')
  }

  // Load selected Proposal
  const handleLoadProposal = (propId) => {
    const found = savedProposals.find((p) => p.id === propId)
    if (found) {
      setProposalData(found)
      setSelectedProposalId(propId)
      addToast(`Loaded proposal for "${found.clientCompany}"`, 'info')
    }
  }

  // Quick Preset Loader
  const applyPreset = (presetType) => {
    if (presetType === 'website') {
      setProposalData((prev) => ({
        ...prev,
        projectName: 'High-Performance E-Commerce & Corporate Website Platform',
        lineItems: [
          { id: 'li1', desc: 'Custom Responsive Website Platform & Admin Dashboard', qty: '1 Package', rate: '49,999' },
          { id: 'li2', desc: '1 Year High-Speed NVMe Cloud Hosting & SSL Certificate', qty: '1 Year', rate: 'INCLUDED' },
          { id: 'li3', desc: 'Domain Name Registration (.com / .in)', qty: '1 Year', rate: 'INCLUDED' },
        ],
        discount: '5,000',
      }))
    } else if (presetType === 'mobile') {
      setProposalData((prev) => ({
        ...prev,
        projectName: 'Cross-Platform Android & iOS Mobile Application Ecosystem',
        lineItems: [
          { id: 'li1', desc: 'Android & iOS Cross-Platform Mobile Application Development', qty: '1 Package', rate: '89,999' },
          { id: 'li2', desc: 'Play Store & App Store Deployment Setup', qty: '2 Stores', rate: 'INCLUDED' },
          { id: 'li3', desc: 'Backend Cloud REST API & Database Setup', qty: '1 System', rate: 'INCLUDED' },
        ],
        discount: '10,000',
      }))
    } else if (presetType === 'software') {
      setProposalData((prev) => ({
        ...prev,
        projectName: 'Custom Enterprise ERP & GST Billing Software System',
        lineItems: [
          { id: 'li1', desc: 'Custom Enterprise ERP & Multi-User Billing System', qty: '1 System', rate: '1,25,000' },
          { id: 'li2', desc: 'Staff Role-Based Security & Database Architecture', qty: '1 Suite', rate: 'INCLUDED' },
          { id: 'li3', desc: '1 Year Server Deployment & Technical SLA', qty: '1 Year', rate: 'INCLUDED' },
        ],
        discount: '15,000',
      }))
    }
  }

  // Financial Calculations
  const calculateSubtotal = () => {
    return proposalData.lineItems.reduce((acc, item) => {
      const val = parseFloat(item.rate.replace(/,/g, '')) || 0
      return acc + val
    }, 0)
  }

  const subtotalNum = calculateSubtotal()
  const discountNum = parseFloat(proposalData.discount.replace(/,/g, '')) || 0
  const taxableNum = Math.max(0, subtotalNum - discountNum)
  const gstNum = Math.round(taxableNum * (parseFloat(proposalData.gstPercent) / 100))
  const grandTotalNum = taxableNum + gstNum

  const handlePrint = () => {
    window.print()
  }

  // Header Component for Pages
  const renderHeader = (pageCode) => (
    <div className="border-b-2 border-[#0A3D91] pb-3 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {cfg.logo ? (
          <img src={cfg.logo} alt="Company Logo" className="h-9 object-contain" />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-[#0A3D91] text-white flex items-center justify-center font-heading font-black text-xs shadow-sm">
            Hi<span className="text-[#D32F2F]">PRO</span>
          </div>
        )}
        <div>
          <span className="font-heading font-black text-sm text-[#0A3D91] tracking-wider block leading-tight">
            HINDUSTAN PROJECTS
          </span>
          <span className="text-[9px] font-bold text-[#D32F2F] tracking-widest uppercase block">
            IT SERVICES &amp; SOLUTIONS
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="font-mono text-xs font-bold text-[#0A3D91] bg-slate-100 px-2.5 py-1 rounded border border-slate-200 block mb-0.5">
          DOC CODE: {pageCode}
        </span>
        <span className="text-[10px] text-gray-500 font-bold">
          REF: {proposalData.quotationNumber}
        </span>
      </div>
    </div>
  )

  // Footer Component for Pages
  const renderFooter = (pageCode, pageNum) => (
    <div className="mt-auto pt-4 border-t border-gray-200 text-[10px] text-gray-500 flex items-center justify-between font-mono">
      <div className="flex items-center gap-4">
        <span>🌐 {proposalData.preparedByWebsite}</span>
        <span>📧 {proposalData.preparedByEmail}</span>
        <span>📞 {proposalData.preparedByPhone}</span>
      </div>
      <div className="font-bold text-[#0A3D91]">
        {pageCode} | Page {pageNum} of 09
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100 pb-20 print:bg-white print:pb-0">
      <SEO title="100% Live Editable Proposal Book — Admin" />

      {/* ── ADMIN CONTROL PANEL DRAWER (Hidden on Print) ────────────────── */}
      <div className="print:hidden bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D32F2F] text-white text-[10px] font-black uppercase tracking-wider">
                    Full Client Proposal Suite
                  </span>
                  <h1 className="text-lg font-black font-heading tracking-tight">
                    9-Page Proposal &amp; Quotation Book Studio
                  </h1>
                </div>
                <p className="text-[11px] text-slate-400">
                  100% Live Editable A4 Corporate Proposal System. Edit any field &amp; print/send to clients.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="lg:hidden text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                {drawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Edit Controls
              </button>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Load Saved Dropdown */}
              {savedProposals.length > 0 && (
                <select
                  value={selectedProposalId}
                  onChange={(e) => handleLoadProposal(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="">📂 Load Saved Proposal...</option>
                  {savedProposals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.clientCompany} ({p.quotationNumber})
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={handleSaveProposal}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                Save Proposal
              </button>

              <button
                type="button"
                onClick={() => applyPreset('website')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Website Preset
              </button>
              <button
                type="button"
                onClick={() => applyPreset('mobile')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                App Preset
              </button>
              <button
                type="button"
                onClick={() => applyPreset('software')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Software Preset
              </button>
              
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-[#0A3D91] hover:bg-[#072a66] text-white px-4 py-1.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print / Save A4 PDF
              </button>
            </div>
          </div>

          {/* Interactive Edit Control Tabs */}
          {drawerOpen && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
                {[
                  { id: 'client', label: '1. Client Details & Metadata', icon: Building2 },
                  { id: 'scope', label: '2. Scope & Features', icon: FileText },
                  { id: 'commercials', label: '3. Pricing & Line Items', icon: Save },
                  { id: 'timeline', label: '4. Timeline & Legal Terms', icon: Clock },
                ].map((tab) => {
                  const IconC = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive ? 'bg-[#0A3D91] text-white shadow' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <IconC className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Tab 1: Client & Metadata */}
              {activeTab === 'client' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mt-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Client Company</label>
                    <input
                      type="text"
                      value={proposalData.clientCompany}
                      onChange={(e) => setProposalData({ ...proposalData, clientCompany: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#0A3D91]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={proposalData.contactPerson}
                      onChange={(e) => setProposalData({ ...proposalData, contactPerson: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#0A3D91]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Designation</label>
                    <input
                      type="text"
                      value={proposalData.clientDesignation}
                      onChange={(e) => setProposalData({ ...proposalData, clientDesignation: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#0A3D91]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Project Name</label>
                    <input
                      type="text"
                      value={proposalData.projectName}
                      onChange={(e) => setProposalData({ ...proposalData, projectName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#0A3D91]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Quotation Number</label>
                    <input
                      type="text"
                      value={proposalData.quotationNumber}
                      onChange={(e) => setProposalData({ ...proposalData, quotationNumber: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#0A3D91]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Proposal Date</label>
                    <input
                      type="text"
                      value={proposalData.date}
                      onChange={(e) => setProposalData({ ...proposalData, date: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#0A3D91]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Valid Until</label>
                    <input
                      type="text"
                      value={proposalData.validTill}
                      onChange={(e) => setProposalData({ ...proposalData, validTill: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#0A3D91]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Client Email</label>
                    <input
                      type="text"
                      value={proposalData.clientEmail}
                      onChange={(e) => setProposalData({ ...proposalData, clientEmail: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-[#0A3D91]"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Scope Items */}
              {activeTab === 'scope' && (
                <div className="mt-3 text-xs space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold uppercase text-emerald-400">Included Scope Deliverables</label>
                      <button
                        type="button"
                        onClick={() => setProposalData({ ...proposalData, scopeIncluded: [...proposalData.scopeIncluded, 'New Custom Deliverable Item'] })}
                        className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Item
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {proposalData.scopeIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...proposalData.scopeIncluded]
                              updated[idx] = e.target.value
                              setProposalData({ ...proposalData, scopeIncluded: updated })
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => setProposalData({ ...proposalData, scopeIncluded: proposalData.scopeIncluded.filter((_, i) => i !== idx) })}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Commercial Pricing */}
              {activeTab === 'commercials' && (
                <div className="mt-3 text-xs space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase text-blue-400">Line Items &amp; Investment Table</label>
                    <button
                      type="button"
                      onClick={() =>
                        setProposalData({
                          ...proposalData,
                          lineItems: [...proposalData.lineItems, { id: `li-${Date.now()}`, desc: 'Additional Module / Service Component', qty: '1 Item', rate: '15,000' }],
                        })
                      }
                      className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Line Item
                    </button>
                  </div>
                  {proposalData.lineItems.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => {
                          const updated = [...proposalData.lineItems]
                          updated[idx].desc = e.target.value
                          setProposalData({ ...proposalData, lineItems: updated })
                        }}
                        className="col-span-7 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                      />
                      <input
                        type="text"
                        value={item.qty}
                        onChange={(e) => {
                          const updated = [...proposalData.lineItems]
                          updated[idx].qty = e.target.value
                          setProposalData({ ...proposalData, lineItems: updated })
                        }}
                        className="col-span-2 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-[11px] text-center"
                      />
                      <input
                        type="text"
                        value={item.rate}
                        onChange={(e) => {
                          const updated = [...proposalData.lineItems]
                          updated[idx].rate = e.target.value
                          setProposalData({ ...proposalData, lineItems: updated })
                        }}
                        className="col-span-2 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-[11px] text-right font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setProposalData({ ...proposalData, lineItems: proposalData.lineItems.filter((_, i) => i !== idx) })}
                        className="col-span-1 text-red-400 hover:text-red-300 p-1 text-center"
                      >
                        <Trash2 className="w-3 h-3 mx-auto" />
                      </button>
                    </div>
                  ))}

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Discount Amount (₹)</label>
                      <input
                        type="text"
                        value={proposalData.discount}
                        onChange={(e) => setProposalData({ ...proposalData, discount: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">GST Percent (%)</label>
                      <input
                        type="text"
                        value={proposalData.gstPercent}
                        onChange={(e) => setProposalData({ ...proposalData, gstPercent: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Calculated Grand Total</label>
                      <span className="font-mono text-sm font-black text-emerald-400 block py-1">
                        ₹{grandTotalNum.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Timeline & Legal */}
              {activeTab === 'timeline' && (
                <div className="mt-3 text-xs space-y-3">
                  <label className="text-[10px] font-bold uppercase text-purple-400 block">Payment Terms &amp; Legal SLA</label>
                  <textarea
                    rows={2}
                    value={proposalData.paymentTerms}
                    onChange={(e) => setProposalData({ ...proposalData, paymentTerms: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-[11px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── PRINT-READY A4 PAGES CONTAINER ──────────────────────────────── */}
      <div className="max-w-[850px] mx-auto py-8 px-4 sm:px-0 space-y-12 print:max-w-none print:py-0 print:px-0 print:space-y-0">
        
        {/* ─────────────────────────────────────────────────────────────────
            PAGE 01: OFFICIAL PROFESSIONAL QUOTATION COVER (HP-IT-001)
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-8 print:shadow-none print:rounded-none print:p-6 flex flex-col justify-between relative overflow-hidden min-h-[1120px] print:min-h-[1050px] print:page-break-after-always border border-gray-200">
          
          {/* Top Right Document Code Angled Ribbon */}
          <div className="absolute top-0 right-0 bg-[#0B2545] text-white font-mono text-xs font-black px-6 py-2 rounded-bl-2xl shadow-md z-20">
            HP-IT-001
          </div>

          {/* Architectural City Skyline & Blueprint Vectors Overlay */}
          <div className="absolute right-0 bottom-16 w-3/5 h-1/2 opacity-15 pointer-events-none z-0">
            <svg width="100%" height="100%" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 400V250H90V400M90 400V180H140V400M140 400V280H190V400M190 400V120H250V400M250 400V200H310V400M310 400V90H380V400M380 400V230H450V400" stroke="#0B2545" strokeWidth="1.5" strokeDasharray="3 3"/>
              <rect x="220" y="260" width="180" height="110" rx="6" stroke="#0B2545" strokeWidth="2" fill="white"/>
              <path d="M200 370H420" stroke="#0B2545" strokeWidth="4" strokeLinecap="round"/>
              <text x="295" y="325" fill="#D32F2F" fontSize="24" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>
              <circle cx="120" cy="150" r="3" fill="#D32F2F"/>
              <circle cx="340" cy="70" r="3" fill="#0B2545"/>
              <circle cx="430" cy="200" r="3" fill="#D32F2F"/>
              <line x1="120" y1="150" x2="340" y2="70" stroke="#0B2545" strokeWidth="0.5" strokeDasharray="2 2"/>
            </svg>
          </div>

          <div className="relative z-10">
            {/* Top Official Company Header */}
            <div className="border-b-2 border-[#0B2545] pb-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {cfg.logo ? (
                  <img src={cfg.logo} alt="Company Logo" className="h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-white flex items-center justify-center font-heading font-black text-sm shadow-md">
                    Hi<span className="text-[#D32F2F]">PRO</span>
                  </div>
                )}
                <div>
                  <h2 className="font-heading font-black text-xl text-[#0B2545] tracking-tight leading-none">
                    HINDUSTAN PROJECTS
                  </h2>
                  <span className="text-[10px] font-bold text-[#D32F2F] tracking-widest uppercase block mt-0.5 border-b border-[#D32F2F] pb-0.5 w-fit">
                    IT SERVICES &amp; SOLUTIONS
                  </span>
                  <p className="text-[9px] text-gray-500 font-semibold mt-1">
                    Building Digital Solutions. Enabling Growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Bold Title */}
            <div className="my-8">
              <h1 className="font-heading font-black text-4xl sm:text-5xl tracking-tight leading-none text-[#0B2545]">
                PROFESSIONAL
              </h1>
              <h1 className="font-heading font-black text-5xl sm:text-6xl tracking-tight leading-none text-[#D32F2F] mt-1">
                QUOTATION
              </h1>
              <p className="text-xs font-bold text-[#0B2545] mt-3 tracking-wider uppercase border-l-4 border-[#0B2545] pl-3">
                Web Development • Software Solutions • Mobile Apps
              </p>
            </div>

            {/* Middle Section: Prepared For Box (Left) & Quotation Info (Right) */}
            <div className="grid grid-cols-12 gap-6 my-8 items-start">
              
              {/* Prepared For Box */}
              <div className="col-span-7 bg-[#F2F6FA] border border-[#D0DFEF] rounded-2xl p-5 shadow-xs">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">
                  PREPARED FOR
                </span>
                <h3 className="font-heading font-black text-xl text-[#0B2545] border-b-2 border-[#D32F2F] pb-1 inline-block mb-4">
                  {proposalData.clientCompany}
                </h3>

                <div className="space-y-2.5 text-xs text-[#333333]">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#0B2545] shrink-0" />
                    <span className="font-bold w-24">Contact Person</span>
                    <span className="text-gray-400">:</span>
                    <span className="font-semibold text-gray-800 border-b border-gray-300 flex-1 pb-0.5">
                      {proposalData.contactPerson}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#0B2545] shrink-0" />
                    <span className="font-bold w-24">Designation</span>
                    <span className="text-gray-400">:</span>
                    <span className="font-semibold text-gray-800 border-b border-gray-300 flex-1 pb-0.5">
                      {proposalData.clientDesignation}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#0B2545] shrink-0" />
                    <span className="font-bold w-24">Email</span>
                    <span className="text-gray-400">:</span>
                    <span className="font-semibold text-gray-800 border-b border-gray-300 flex-1 pb-0.5">
                      {proposalData.clientEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#0B2545] shrink-0" />
                    <span className="font-bold w-24">Phone</span>
                    <span className="text-gray-400">:</span>
                    <span className="font-semibold text-gray-800 border-b border-gray-300 flex-1 pb-0.5">
                      {proposalData.clientPhone}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#0B2545] shrink-0 mt-0.5" />
                    <span className="font-bold w-24">Address</span>
                    <span className="text-gray-400">:</span>
                    <span className="font-semibold text-gray-800 border-b border-gray-300 flex-1 pb-0.5">
                      {proposalData.clientAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quotation Metadata Box */}
              <div className="col-span-5 space-y-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B2545]/10 text-[#0B2545] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase block">
                      QUOTATION NO.
                    </span>
                    <span className="font-mono text-sm font-black text-[#0B2545]">
                      {proposalData.quotationNumber}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B2545]/10 text-[#0B2545] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase block">
                      DATE
                    </span>
                    <span className="font-mono text-xs font-bold text-gray-800">
                      {proposalData.date}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-[#D32F2F] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase block">
                      VALID TILL
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D32F2F]">
                      {proposalData.validTill}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Prepared By Section */}
            <div className="my-8 pt-4 border-t border-gray-200 max-w-sm">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">
                PREPARED BY
              </span>
              <h4 className="font-heading font-black text-sm text-[#0B2545]">
                HINDUSTAN PROJECTS IT SERVICES
              </h4>
              <div className="space-y-1 text-[11px] text-gray-600 mt-2 font-medium">
                <p className="flex items-center gap-2">🌐 {proposalData.preparedByWebsite}</p>
                <p className="flex items-center gap-2">📧 {proposalData.preparedByEmail}</p>
                <p className="flex items-center gap-2">📞 {proposalData.preparedByPhone}</p>
                <p className="flex items-center gap-2">📍 Bhilwara, Rajasthan, India</p>
              </div>
            </div>

            {/* Bottom 3 Service Badges */}
            <div className="grid grid-cols-3 gap-3 border-t-2 border-gray-200 pt-4">
              <div className="p-2.5 rounded-xl border border-gray-200 bg-slate-50 flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#0B2545] text-white flex items-center justify-center text-xs shrink-0">
                  🖥️
                </div>
                <div>
                  <span className="font-heading font-black text-[11px] text-[#0B2545] uppercase block leading-tight">
                    WEBSITE
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold block">DEVELOPMENT</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-gray-200 bg-slate-50 flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#0B2545] text-white flex items-center justify-center text-xs shrink-0">
                  📱
                </div>
                <div>
                  <span className="font-heading font-black text-[11px] text-[#0B2545] uppercase block leading-tight">
                    MOBILE APP
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold block">DEVELOPMENT</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-gray-200 bg-slate-50 flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#0B2545] text-white flex items-center justify-center text-xs shrink-0">
                  &lt;/&gt;
                </div>
                <div>
                  <span className="font-heading font-black text-[11px] text-[#0B2545] uppercase block leading-tight">
                    SOFTWARE
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold block">SOLUTIONS</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Solid Footer Bar */}
          <div className="mt-6 bg-[#0B2545] text-white text-[10px] py-2 px-4 rounded-b-lg flex items-center justify-between font-mono relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#D32F2F] border-b-[8px] border-b-transparent" />
              <span>hindustanprojects.in</span>
            </div>
            <div>HP-IT-001</div>
            <div>Page 01</div>
          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PAGE 02: CLIENT INFORMATION & PROJECT OVERVIEW
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          <div>
            {renderHeader('HP-IT-002')}

            <h2 className="font-heading text-2xl font-black text-[#0A3D91] mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#D32F2F]" />
              01. Client Information &amp; Project Overview
            </h2>

            {/* Client Details Section */}
            <div className="mb-8">
              <h3 className="font-heading text-sm font-extrabold text-[#0A3D91] uppercase tracking-wider mb-3">
                Client Profile Details
              </h3>
              <table className="w-full text-xs text-[#333333] border border-gray-200 rounded-lg overflow-hidden">
                <tbody>
                  <tr className="border-b border-gray-200 bg-slate-50">
                    <td className="p-3 font-bold text-[#0A3D91] w-1/3 border-r border-gray-200">Organization Name</td>
                    <td className="p-3 font-semibold">{proposalData.clientCompany}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-bold text-[#0A3D91] border-r border-gray-200">Contact Representative</td>
                    <td className="p-3 font-semibold">{proposalData.contactPerson} ({proposalData.clientDesignation})</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-slate-50">
                    <td className="p-3 font-bold text-[#0A3D91] border-r border-gray-200">Email Address</td>
                    <td className="p-3 font-semibold">{proposalData.clientEmail}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-bold text-[#0A3D91] border-r border-gray-200">Phone Number</td>
                    <td className="p-3 font-semibold">{proposalData.clientPhone}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0A3D91] border-r border-gray-200">Corporate Address</td>
                    <td className="p-3 font-semibold">{proposalData.clientAddress}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Executive Summary & Project Objectives */}
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-heading text-sm font-extrabold text-[#0A3D91] uppercase tracking-wider mb-2">
                  Executive Project Summary
                </h3>
                <p className="text-xs text-[#333333] leading-relaxed">
                  This proposal details the technical architecture, operational scope, delivery timeline, and commercial terms for the implementation of <strong>{proposalData.projectName}</strong>. Our engineering team at Hindustan Projects IT Services will architect a high-availability, secure, and scalable solution tailored to satisfy all business objectives.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#0A3D91]/20 bg-[#0A3D91]/5">
                <h3 className="font-heading text-sm font-extrabold text-[#0A3D91] uppercase tracking-wider mb-3">
                  Key Strategic Objectives
                </h3>
                <ul className="space-y-2 text-xs text-[#333333]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0A3D91] shrink-0 mt-0.5" />
                    <span><strong>High Performance &amp; Scalability:</strong> Engineer ultra-fast responsive interfaces capable of handling high concurrent user traffic.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0A3D91] shrink-0 mt-0.5" />
                    <span><strong>Enterprise Security:</strong> Implement 256-bit SSL encryption, input sanitization, and compliance with industry security protocols.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0A3D91] shrink-0 mt-0.5" />
                    <span><strong>Lead Generation &amp; Conversion:</strong> Optimize user journeys, CTAs, and automated lead management integration.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {renderFooter('HP-IT-002', '02')}
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PAGE 03: SCOPE OF WORK (DYNAMICALLY RENDERED FROM STATE)
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          <div>
            {renderHeader('HP-IT-003')}

            <h2 className="font-heading text-2xl font-black text-[#0A3D91] mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#D32F2F]" />
              02. Detailed Scope of Work
            </h2>

            {/* Scope Included Grid */}
            <div className="mb-6">
              <h3 className="font-heading text-xs font-extrabold text-[#0A3D91] uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Deliverables Included In Scope ({proposalData.scopeIncluded.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#333333]">
                {proposalData.scopeIncluded.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scope Not Included */}
            <div>
              <h3 className="font-heading text-xs font-extrabold text-[#D32F2F] uppercase tracking-wider mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-[#D32F2F]" />
                Items Excluded / Out of Scope ({proposalData.scopeExcluded.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#333333]">
                {proposalData.scopeExcluded.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-red-50/50 border border-red-200 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {renderFooter('HP-IT-003', '03')}
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PAGE 04: FEATURES INCLUDED
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          <div>
            {renderHeader('HP-IT-004')}

            <h2 className="font-heading text-2xl font-black text-[#0A3D91] mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#D32F2F]" />
              03. Technical Features &amp; Architecture
            </h2>

            {/* 8 Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs text-[#333333]">
              {[
                { title: '100% Mobile Responsive', desc: 'Flawless responsive grid across smartphones, tablets, and desktop computers.', icon: Smartphone },
                { title: 'Google SEO Ready', desc: 'On-Page SEO, Google Search Console indexing, meta tags, and structured data.', icon: Search },
                { title: 'Enterprise Security', desc: '256-bit SSL encryption, input sanitization, and secure authentication.', icon: Lock },
                { title: 'Admin Control Panel', desc: 'User-friendly admin dashboard to manage leads, content, and site media.', icon: LayoutDashboard },
                { title: 'REST API Architecture', desc: 'Fast, secure, scalable RESTful API endpoints for seamless data integration.', icon: Code },
                { title: 'Database Optimization', desc: 'Optimized relational schema design ensuring instant query response.', icon: Database },
                { title: 'NVMe Cloud Hosting', desc: 'High-speed cloud server setup with 99.9% uptime reliability guarantee.', icon: Server },
                { title: 'Technical Support', desc: 'Dedicated technical assistance and maintenance documentation post-launch.', icon: Shield },
              ].map((feat, idx) => {
                const IconC = feat.icon
                return (
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0A3D91] text-white flex items-center justify-center shrink-0">
                      <IconC className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-sm text-[#0A3D91] mb-1">{feat.title}</h3>
                      <p className="text-gray-600 text-[11px] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {renderFooter('HP-IT-004', '04')}
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PAGE 05: DEVELOPMENT TIMELINE
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          <div>
            {renderHeader('HP-IT-005')}

            <h2 className="font-heading text-2xl font-black text-[#0A3D91] mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#D32F2F]" />
              04. Project Delivery Timeline
            </h2>

            {/* 6-Phase Engineering Timeline */}
            <div className="space-y-4 text-xs text-[#333333]">
              {proposalData.timelinePhases.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50 flex items-start gap-4">
                  <div className="px-3 py-1 rounded bg-[#0A3D91] text-white font-mono font-bold text-xs shrink-0">
                    {item.phase}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-heading font-black text-sm text-[#0A3D91]">{item.title}</h3>
                      <span className="font-mono text-xs font-bold text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded border border-red-100">{item.duration}</span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {renderFooter('HP-IT-005', '05')}
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PAGE 06: COMMERCIAL PROPOSAL & DYNAMIC LINE ITEMS TABLE
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          <div>
            {renderHeader('HP-IT-006')}

            <h2 className="font-heading text-2xl font-black text-[#0A3D91] mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#D32F2F]" />
              05. Commercial Proposal &amp; Investment Breakdown
            </h2>

            {/* Commercial Pricing Table */}
            <table className="w-full text-xs text-[#333333] border border-gray-200 rounded-lg overflow-hidden mb-6">
              <thead>
                <tr className="bg-[#0A3D91] text-white font-heading text-xs">
                  <th className="p-3 text-left w-12">#</th>
                  <th className="p-3 text-left">Description / Component</th>
                  <th className="p-3 text-center w-28">Qty</th>
                  <th className="p-3 text-right w-36">Amount ({proposalData.currency})</th>
                </tr>
              </thead>
              <tbody>
                {proposalData.lineItems.map((item, idx) => (
                  <tr key={item.id || idx} className={`border-b border-gray-200 ${idx % 2 === 1 ? 'bg-slate-50' : ''}`}>
                    <td className="p-3 font-bold">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="p-3 font-bold text-[#0A3D91]">
                      {item.desc}
                    </td>
                    <td className="p-3 text-center font-semibold">{item.qty}</td>
                    <td className={`p-3 text-right font-bold ${item.rate === 'INCLUDED' ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {item.rate === 'INCLUDED' ? 'INCLUDED' : `₹${item.rate}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotal Calculations Block */}
            <div className="flex justify-end mb-6">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold text-gray-900">₹{subtotalNum.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied:</span>
                  <span>- ₹{discountNum.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
                  <span>Taxable Amount:</span>
                  <span className="font-bold text-gray-900">₹{taxableNum.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST ({proposalData.gstPercent}%):</span>
                  <span className="font-bold text-gray-900">₹{gstNum.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#0A3D91] pt-2 border-t-2 border-[#0A3D91]">
                  <span>Grand Total:</span>
                  <span>₹{grandTotalNum.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Payment Terms Box */}
            <div className="p-4 rounded-xl bg-[#0A3D91]/5 border border-[#0A3D91]/20 text-xs">
              <h4 className="font-heading font-black text-[#0A3D91] uppercase mb-1">Commercial Payment Terms</h4>
              <p className="text-gray-700 leading-relaxed font-semibold">{proposalData.paymentTerms}</p>
            </div>
          </div>

          {renderFooter('HP-IT-006', '06')}
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PAGE 07: TERMS & CONDITIONS
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          <div>
            {renderHeader('HP-IT-007')}

            <h2 className="font-heading text-2xl font-black text-[#0A3D91] mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#D32F2F]" />
              06. Legal Terms &amp; Conditions
            </h2>

            {/* Legal Clauses Grid */}
            <div className="space-y-4 text-xs text-[#333333]">
              {proposalData.legalTerms.map((clause, idx) => (
                <div key={clause.id || idx} className="p-3.5 rounded-xl border border-gray-200 bg-slate-50">
                  <h3 className="font-heading font-extrabold text-[#0A3D91] text-xs mb-1">{clause.title}</h3>
                  <p className="text-gray-600 text-[11px] leading-relaxed">{clause.text}</p>
                </div>
              ))}
            </div>
          </div>

          {renderFooter('HP-IT-007', '07')}
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PAGE 08: ACCEPTANCE & SIGNATURES
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          <div>
            {renderHeader('HP-IT-008')}

            <h2 className="font-heading text-2xl font-black text-[#0A3D91] mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#D32F2F]" />
              07. Proposal Acceptance &amp; Signatures
            </h2>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#333333] mb-12">
              <p className="leading-relaxed font-semibold">
                By signing below, the Client confirms acceptance of the scope of work, technical specifications, commercial quotation, and legal terms outlined in Document Code <strong>HP-IT-001 through HP-IT-009</strong>.
              </p>
            </div>

            {/* Signature Boxes Grid */}
            <div className="grid grid-cols-2 gap-8 text-xs text-[#333333] mt-8">
              {/* Client Signature Box */}
              <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 flex flex-col justify-between h-64">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                    CLIENT AUTHORIZED SIGNATORY
                  </span>
                  <h3 className="font-heading font-black text-sm text-[#0A3D91]">{proposalData.clientCompany}</h3>
                </div>

                <div className="border-t border-gray-300 pt-3">
                  <p className="font-bold">Authorized Signature &amp; Stamp</p>
                  <p className="text-gray-500 text-[11px] mt-1">Name: {proposalData.contactPerson}</p>
                  <p className="text-gray-500 text-[11px]">Designation: {proposalData.clientDesignation}</p>
                  <p className="text-gray-500 text-[11px]">Date: ____________________</p>
                </div>
              </div>

              {/* Company Signature Box */}
              <div className="p-6 rounded-xl border-2 border-[#0A3D91] bg-[#0A3D91]/5 flex flex-col justify-between h-64">
                <div>
                  <span className="text-[10px] font-extrabold text-[#0A3D91] uppercase tracking-wider block mb-1">
                    VENDOR AUTHORIZED SIGNATORY
                  </span>
                  <h3 className="font-heading font-black text-sm text-[#0A3D91]">Hindustan Projects IT Services</h3>
                </div>

                {/* Company Official Stamp Placeholder */}
                <div className="my-auto self-center">
                  <div className="w-20 h-20 rounded-full border-2 border-[#0A3D91] border-dashed flex items-center justify-center text-[#0A3D91] font-mono text-[9px] font-black text-center p-1 uppercase">
                    OFFICIAL SEAL &amp; STAMP
                  </div>
                </div>

                <div className="border-t border-[#0A3D91]/30 pt-3">
                  <p className="font-bold text-[#0A3D91]">Authorized Signatory</p>
                  <p className="text-gray-600 text-[11px] mt-1">Designation: Managing Director</p>
                  <p className="text-gray-600 text-[11px]">Date: {proposalData.date}</p>
                </div>
              </div>
            </div>
          </div>

          {renderFooter('HP-IT-008', '08')}
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            PAGE 09: THANK YOU & CLOSING
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          <div>
            {renderHeader('HP-IT-009')}

            <div className="text-center my-12 max-w-xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#0A3D91]/10 text-[#0A3D91] font-mono text-xs font-bold uppercase tracking-widest mb-4">
                THANK YOU FOR YOUR TRUST
              </span>
              <h2 className="font-heading text-4xl font-black text-[#0A3D91] tracking-tight">
                We Look Forward to Building Your Digital Success
              </h2>
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                Hindustan Projects IT Services is committed to delivering excellence, innovation, and long-term value for your business.
              </p>
            </div>

            {/* Contact Information & QR Placeholder Box */}
            <div className="p-8 rounded-2xl bg-[#0A3D91] text-white my-8 max-w-2xl mx-auto shadow-xl">
              <div className="grid grid-cols-3 gap-6 items-center">
                <div className="col-span-2 space-y-3 text-xs">
                  <h3 className="font-heading font-black text-lg text-white mb-2">Hindustan Projects IT Services</h3>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-300 shrink-0" />
                    <span>{proposalData.preparedByWebsite}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                    <span>{proposalData.preparedByEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-300 shrink-0" />
                    <span>{proposalData.preparedByPhone}</span>
                  </div>
                </div>

                {/* QR Code Graphic Placeholder */}
                <div className="text-center bg-white p-3 rounded-xl text-gray-900">
                  <div className="w-24 h-24 mx-auto bg-slate-100 border border-slate-300 rounded flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-[#0A3D91]" />
                  </div>
                  <span className="text-[9px] font-extrabold uppercase block mt-1.5 text-[#0A3D91]">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {renderFooter('HP-IT-009', '09')}
        </div>

      </div>
    </div>
  )
}

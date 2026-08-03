/**
 * AdminProposalBookPage.jsx
 * 
 * 9-Page Premium Corporate Proposal & Quotation Book System
 * Built to exact corporate brand book specifications (Deloitte/Accenture/IBM/Microsoft quality).
 * Document Codes: HP-IT-001 to HP-IT-009
 * Colors: Primary #0A3D91, Secondary #D32F2F, White #FFFFFF, Dark Gray #333333, Light Gray #F5F7FA
 * Print-Ready A4 Portrait format (@media print optimized).
 */

import { useState } from 'react'
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
} from 'lucide-react'
import { SEO } from '@/components/ui'
import { useSiteSettings } from '@/hooks/useContent'

export default function AdminProposalBookPage() {
  const { data: settingsData } = useSiteSettings()
  const cfg = settingsData?.data || {}

  // Editable Form State for Proposal Book Placeholders
  const [proposalData, setProposalData] = useState({
    clientCompany: '[CLIENT COMPANY NAME]',
    contactPerson: '[CONTACT PERSON NAME]',
    clientEmail: 'client@company.com',
    clientPhone: '+91 98765 43210',
    clientAddress: '123 Business Tower, Corporate Hub, New Delhi',
    projectName: '[ENTERPRISE IT SOLUTION PROJECT]',
    quotationNumber: 'HP-QT-2026-089',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    currency: 'INR (₹)',
    subtotal: '1,50,000',
    discount: '15,000',
    gstPercent: '18',
    paymentTerms: '50% Advance to start development, 50% upon final live demo & approval.',
    preparedBy: 'Hindustan Projects IT Services',
    preparedByEmail: cfg.email || 'info@hindustanprojects.in',
    preparedByPhone: cfg.phone || '+91 75970 00601',
    preparedByWebsite: 'www.itservices.hindustanprojects.in',
  })

  // Quick preset loader
  const applyPreset = (presetType) => {
    if (presetType === 'website') {
      setProposalData((prev) => ({
        ...prev,
        projectName: 'High-Performance E-Commerce & Corporate Website Platform',
        subtotal: '49,999',
        discount: '5,000',
      }))
    } else if (presetType === 'mobile') {
      setProposalData((prev) => ({
        ...prev,
        projectName: 'Cross-Platform Android & iOS Mobile Application Ecosystem',
        subtotal: '89,999',
        discount: '10,000',
      }))
    } else if (presetType === 'software') {
      setProposalData((prev) => ({
        ...prev,
        projectName: 'Custom Enterprise ERP & GST Billing Software System',
        subtotal: '1,25,000',
        discount: '15,000',
      }))
    }
  }

  // Calculate financials
  const subtotalNum = parseFloat(proposalData.subtotal.replace(/,/g, '')) || 0
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
        <div className="w-8 h-8 rounded-lg bg-[#0A3D91] text-white flex items-center justify-center font-black text-xs">
          HP
        </div>
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
    <div className="mt-auto pt-4 border-t border-gray-200 text-[10px] text-gray-500 flex items-center justify-between">
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
      <SEO title="Proposal Book Generator — Admin" />

      {/* ── ADMIN CONTROL PANEL (Hidden on Print) ────────────────────────── */}
      <div className="print:hidden bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D32F2F] text-white text-[10px] font-black uppercase tracking-wider">
                  Official Corporate Book
                </span>
                <h1 className="text-xl font-black font-heading tracking-tight">
                  9-Page Proposal &amp; Quotation Book Generator
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Print-ready A4 corporate proposal document adhering to IBM, Microsoft &amp; Accenture brand guidelines.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => applyPreset('website')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Website Preset
              </button>
              <button
                type="button"
                onClick={() => applyPreset('mobile')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                App Preset
              </button>
              <button
                type="button"
                onClick={() => applyPreset('software')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Software Preset
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-[#0A3D91] hover:bg-[#072a66] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print / Save A4 PDF
              </button>
            </div>
          </div>

          {/* Quick Input Controls Grid */}
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Client Company</label>
              <input
                type="text"
                value={proposalData.clientCompany}
                onChange={(e) => setProposalData({ ...proposalData, clientCompany: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#0A3D91]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Contact Person</label>
              <input
                type="text"
                value={proposalData.contactPerson}
                onChange={(e) => setProposalData({ ...proposalData, contactPerson: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#0A3D91]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Project Name</label>
              <input
                type="text"
                value={proposalData.projectName}
                onChange={(e) => setProposalData({ ...proposalData, projectName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#0A3D91]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Subtotal Amount (₹)</label>
              <input
                type="text"
                value={proposalData.subtotal}
                onChange={(e) => setProposalData({ ...proposalData, subtotal: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#0A3D91]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── PRINT-READY A4 PAGES CONTAINER ──────────────────────────────── */}
      <div className="max-w-[850px] mx-auto py-8 px-4 sm:px-0 space-y-12 print:max-w-none print:py-0 print:px-0 print:space-y-0">
        
        {/* ─────────────────────────────────────────────────────────────────
            PAGE 01: PREMIUM COVER
            ───────────────────────────────────────────────────────────────── */}
        <div className="a4-page bg-white shadow-2xl rounded-sm p-10 print:shadow-none print:rounded-none print:p-8 flex flex-col justify-between relative overflow-hidden min-h-[1120px] print:min-h-[1050px] print:page-break-after-always">
          {/* Blueprint Engineering Vector Line Background Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0A3D91" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div>
            {renderHeader('HP-IT-001')}

            {/* Cover Main Title Block */}
            <div className="mt-12 mb-10">
              <span className="inline-block px-3 py-1 rounded bg-[#0A3D91]/10 text-[#0A3D91] font-mono text-xs font-bold uppercase tracking-widest mb-4">
                OFFICIAL BUSINESS PROPOSAL &amp; QUOTATION
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#0A3D91] tracking-tight leading-[1.15]">
                TECHNICAL PROPOSAL &amp; COMMERCIAL QUOTATION BOOK
              </h1>
              <p className="text-lg font-bold text-[#D32F2F] mt-3 tracking-wide border-l-4 border-[#D32F2F] pl-4">
                {proposalData.projectName}
              </p>
            </div>

            {/* Corporate Blueprint Banner Box */}
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 my-8">
              <div className="grid grid-cols-2 gap-6 text-xs text-[#333333]">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                    PREPARED FOR (CLIENT)
                  </span>
                  <h3 className="font-heading text-lg font-black text-[#0A3D91]">
                    {proposalData.clientCompany}
                  </h3>
                  <p className="font-semibold text-gray-700 mt-0.5">Attn: {proposalData.contactPerson}</p>
                  <p className="text-gray-500 text-[11px] mt-1">{proposalData.clientAddress}</p>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                    PREPARED BY (VENDOR)
                  </span>
                  <h3 className="font-heading text-lg font-black text-[#0A3D91]">
                    Hindustan Projects IT Services
                  </h3>
                  <p className="font-semibold text-gray-700 mt-0.5">Enterprise Solution Architecture Team</p>
                  <p className="text-gray-500 text-[11px] mt-1">IT Services &amp; Digital Engineering Division</p>
                </div>
              </div>
            </div>

            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-[#0A3D91] text-white text-xs font-semibold my-8">
              <div>
                <span className="text-[10px] text-blue-200 block uppercase">Quotation Number</span>
                <span className="font-mono text-sm font-bold">{proposalData.quotationNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block uppercase">Proposal Date</span>
                <span className="font-mono text-sm font-bold">{proposalData.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block uppercase">Valid Until</span>
                <span className="font-mono text-sm font-bold text-red-300">{proposalData.validTill}</span>
              </div>
            </div>
          </div>

          {renderFooter('HP-IT-001', '01')}
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
                    <td className="p-3 font-semibold">{proposalData.contactPerson}</td>
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
            PAGE 03: SCOPE OF WORK
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
                Deliverables Included In Scope
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#333333]">
                {[
                  'Custom Responsive UI/UX Design System',
                  'Frontend Development (React / Next.js)',
                  'Backend REST API Architecture (Node.js)',
                  'Database Setup & Optimization',
                  'Admin Management Dashboard Panel',
                  'Google On-Page & Technical SEO Setup',
                  'High-Speed NVMe Cloud Hosting Setup',
                  '256-bit SSL Security Certificate',
                  'Domain Registration Assistance',
                  'Post-Launch Technical Support',
                ].map((item, idx) => (
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
                Items Excluded / Out of Scope
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#333333]">
                {[
                  'Third-party paid API subscription costs',
                  'Paid ad campaign ad spends',
                  'Custom video shoot content creation',
                  'Legal trademark registration fees',
                ].map((item, idx) => (
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
              {[
                { phase: 'PHASE 01', title: 'Discovery & Requirement Gathering', duration: 'Days 1 – 2', desc: 'Requirement discussion, target audience profiling, and technical specification sign-off.' },
                { phase: 'PHASE 02', title: 'UI/UX Wireframing & Design System', duration: 'Days 3 – 4', desc: 'Designing modern interactive wireframes, typography tokens, and visual layout mockups.' },
                { phase: 'PHASE 03', title: 'Full-Stack Software Development', duration: 'Days 5 – 8', desc: 'Writing clean, optimized frontend and backend code, database schema, and REST APIs.' },
                { phase: 'PHASE 04', title: 'QA, Security & Performance Testing', duration: 'Days 9 – 10', desc: 'Comprehensive cross-browser testing, SSL security audit, and page speed optimization.' },
                { phase: 'PHASE 05', title: 'Client Review & Demo Approval', duration: 'Day 11', desc: 'Staging preview walkthrough with client team and incorporating final feedback adjustments.' },
                { phase: 'PHASE 06', title: 'Production Deployment & Handover', duration: 'Day 12+', desc: 'Deploying live on production cloud servers with SSL certificate and admin handover.' },
              ].map((item, idx) => (
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
            PAGE 06: COMMERCIAL PROPOSAL & PRICING TABLE
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
                  <th className="p-3 text-center w-24">Qty</th>
                  <th className="p-3 text-right w-36">Amount ({proposalData.currency})</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-bold">01</td>
                  <td className="p-3 font-bold text-[#0A3D91]">
                    {proposalData.projectName}
                    <span className="block text-[10px] font-normal text-gray-500 mt-0.5">Complete custom development, UI design, database setup &amp; admin panel.</span>
                  </td>
                  <td className="p-3 text-center font-semibold">1 Package</td>
                  <td className="p-3 text-right font-bold">₹{proposalData.subtotal}</td>
                </tr>
                <tr className="border-b border-gray-200 bg-slate-50">
                  <td className="p-3 font-bold">02</td>
                  <td className="p-3 font-bold text-[#0A3D91]">
                    High-Speed NVMe Cloud Hosting &amp; SSL Certificate
                    <span className="block text-[10px] font-normal text-gray-500 mt-0.5">1 Year High-Speed NVMe Cloud Server Hosting + 256-bit SSL Certificate.</span>
                  </td>
                  <td className="p-3 text-center font-semibold">1 Year</td>
                  <td className="p-3 text-right font-bold text-emerald-600">INCLUDED</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-bold">03</td>
                  <td className="p-3 font-bold text-[#0A3D91]">
                    Domain Name Registration (.com / .in)
                    <span className="block text-[10px] font-normal text-gray-500 mt-0.5">1 Year Domain Registration &amp; DNS Setup.</span>
                  </td>
                  <td className="p-3 text-center font-semibold">1 Year</td>
                  <td className="p-3 text-right font-bold text-emerald-600">INCLUDED</td>
                </tr>
                <tr className="border-b border-gray-200 bg-slate-50">
                  <td className="p-3 font-bold">04</td>
                  <td className="p-3 font-bold text-[#0A3D91]">
                    Post-Launch Technical Support
                    <span className="block text-[10px] font-normal text-gray-500 mt-0.5">Free Dedicated Post-Delivery Support &amp; Maintenance.</span>
                  </td>
                  <td className="p-3 text-center font-semibold">Included</td>
                  <td className="p-3 text-right font-bold text-emerald-600">INCLUDED</td>
                </tr>
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
              {[
                { title: '1. Source Code Ownership & Intellectual Property', text: 'Upon final settlement of the grand total payment, complete source code ownership, intellectual property rights, and codebase copyright belong exclusively to the Client.' },
                { title: '2. Bug-Free Code Warranty & Technical Guarantee', text: 'Hindustan Projects IT Services provides a 100% bug-free code warranty. Any technical glitch or coding anomaly discovered post-delivery will be rectified at zero cost.' },
                { title: '3. Technical Support & SLA', text: 'Complimentary technical support covers bug fixes, server monitoring, and minor text adjustments for the designated package duration.' },
                { title: '4. Project Timelines & Client Responsibilities', text: 'Delivery timelines are contingent upon prompt client feedback and provision of necessary media assets (logos, content, credentials).' },
                { title: '5. Confidentiality & Non-Disclosure (NDA)', text: 'Both parties agree to treat all business data, customer lists, API keys, and technical documentation as strictly confidential.' },
                { title: '6. Limitation of Liability', text: 'Hindustan Projects IT Services is not liable for indirect or consequential damages arising from third-party server downtimes or API policy alterations.' },
              ].map((clause, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-slate-50">
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

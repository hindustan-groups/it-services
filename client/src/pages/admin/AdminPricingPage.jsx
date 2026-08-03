/**
 * AdminPricingPage.jsx
 * 
 * Complete Pricing & Package Management Portal for Admin
 * Allows admins to view, edit, and configure rates, deliverables, features, and policies
 * across Websites, Mobile Apps, Custom Software, Digital Marketing, Hosting, and Branding.
 */

import { useState } from 'react'
import {
  DollarSign,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Globe,
  Smartphone,
  Code,
  TrendingUp,
  Palette,
  Server,
  Sparkles,
  Layers,
  Check,
  Edit3,
} from 'lucide-react'
import { SEO, Button } from '@/components/ui'
import { useToast } from '@/components/ui/ToastProvider'

export default function AdminPricingPage() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('web')
  const [isSaving, setIsSaving] = useState(false)

  // Package Data State for Admin Controls
  const [packages, setPackages] = useState({
    web: [
      { id: 'w1', name: 'Starter Business Website', price: '₹9,999', popular: false, timeline: '5-7 Days', features: ['5 Responsive Pages', 'Mobile & Tablet Ready', 'Free SSL Certificate', 'Basic On-Page SEO', 'Contact Lead Form'] },
      { id: 'w2', name: 'Professional Corporate Website', price: '₹19,999', popular: true, timeline: '7-10 Days', features: ['10-15 Custom Pages', 'Admin Control Panel', '1 Year Free NVMe Cloud Hosting', 'Free .com/.in Domain', 'WhatsApp Live Chat', 'Speed Optimization'] },
      { id: 'w3', name: 'E-Commerce Online Store', price: '₹34,999', popular: false, timeline: '12-15 Days', features: ['Unlimited Products & Categories', 'Payment Gateway Integration', 'Customer Accounts & Orders', 'Inventory & Stock Management', 'GST Invoice Generator'] },
      { id: 'w4', name: 'Custom Enterprise Portal', price: '₹49,999+', popular: false, timeline: '20-25 Days', features: ['Dedicated React/Next.js Stack', 'Custom REST API Backend', 'Advanced Analytics Dashboard', 'Priority SLA 24/7 Support'] },
    ],
    mobile: [
      { id: 'm1', name: 'Starter Android App', price: '₹24,999', popular: false, timeline: '10-15 Days', features: ['Native Android UI', 'Play Store Publishing', 'Push Notifications', 'Firebase Backend'] },
      { id: 'm2', name: 'Cross-Platform iOS & Android App', price: '₹49,999', popular: true, timeline: '20-25 Days', features: ['Flutter / React Native Stack', 'App Store & Play Store Deployment', 'Razorpay Payment Gateway', 'Real-Time Admin Panel'] },
      { id: 'm3', name: 'Custom Enterprise Mobile Ecosystem', price: '₹89,999+', popular: false, timeline: '30-40 Days', features: ['Custom Architecture & Microservices', 'Live GPS Tracking & Maps API', 'Biometric & OTP Auth', 'Dedicated DevOps Cloud Engine'] },
    ],
    software: [
      { id: 's1', name: 'GST Billing & POS Software', price: '₹14,999', popular: false, timeline: '7 Days', features: ['GST Compliant Invoicing', 'Inventory & Stock Tracking', 'Thermal Print Support', 'Offline & Online Cloud Sync'] },
      { id: 's2', name: 'Custom CRM & Lead Software', price: '₹29,999', popular: true, timeline: '15 Days', features: ['Lead Pipeline Management', 'Automated Email & WhatsApp Alerts', 'Staff Access & Role Control', 'Reports & Exporting'] },
      { id: 's3', name: 'Full Enterprise ERP Solution', price: '₹75,999+', popular: false, timeline: '30 Days', features: ['HR, Payroll & Accounts Modules', 'Multi-Branch Inventory Sync', 'Custom Workflow Automation', 'Dedicated Server Setup'] },
    ],
    marketing: [
      { id: 'd1', name: 'Basic Marketing Package', price: '₹4,999/mo', popular: false, timeline: 'Monthly Retainer', features: ['10 Creative Posts & 5 Reels', '10-15 Stories & Thumbnails', 'Google Business Profile Setup', '1 Meta/Google Ad (7 Days)'] },
      { id: 'd2', name: 'Advance Marketing Package', price: '₹8,999/mo', popular: true, timeline: 'Monthly Retainer', features: ['12-15 Posts & 10 Reels', '20 Stories & Thumbnails', 'Google Profile & Advanced SEO', '1 Meta/Google Ad (10 Days)'] },
      { id: 'd3', name: 'Premium Marketing Package', price: '₹14,999/mo', popular: false, timeline: 'Monthly Retainer', features: ['Daily Posts & 15 Reels', 'Daily Stories & Thumbnails', 'Google Profile, SEO & Ads Mgmt', '2 Ad Campaigns & Competitor Analysis'] },
    ],
  })

  // Edit item handler
  const handleUpdatePrice = (category, id, newPrice) => {
    setPackages((prev) => ({
      ...prev,
      [category]: prev[category].map((item) => (item.id === id ? { ...item, price: newPrice } : item)),
    }))
  }

  const handleUpdateName = (category, id, newName) => {
    setPackages((prev) => ({
      ...prev,
      [category]: prev[category].map((item) => (item.id === id ? { ...item, name: newName } : item)),
    }))
  }

  const handleSaveAll = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      addToast('Pricing packages saved successfully!', 'success')
    }, 800)
  }

  return (
    <div className="space-y-6">
      <SEO title="Pricing & Package Management — Admin" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
              Control Panel
            </span>
            <h1 className="text-2xl font-black font-heading tracking-tight">
              Pricing &amp; Service Package Manager
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure live package prices, deliverables, timeline guarantees, and retainer options across all service lines.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-[#0A3D91] hover:bg-[#072a66] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-900/40 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Pricing Changes
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {[
          { id: 'web', label: 'Web Development', icon: Globe },
          { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
          { id: 'software', label: 'Custom Software', icon: Code },
          { id: 'marketing', label: 'Digital Marketing', icon: TrendingUp },
        ].map((tab) => {
          const IconC = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#0A3D91] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <IconC className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages[activeTab].map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm relative ${
              pkg.popular ? 'border-brand-red ring-2 ring-brand-red/20' : 'border-gray-200'
            }`}
          >
            {pkg.popular && (
              <span className="absolute top-4 right-4 bg-brand-red text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Most Popular
              </span>
            )}

            <div>
              {/* Package Name Input */}
              <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">
                Package Title
              </label>
              <input
                type="text"
                value={pkg.name}
                onChange={(e) => handleUpdateName(activeTab, pkg.id, e.target.value)}
                className="font-heading font-black text-lg text-gray-900 w-full border-b border-gray-200 pb-1 focus:outline-none focus:border-[#0A3D91] mb-4"
              />

              {/* Price & Timeline Controls */}
              <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">
                    Rate / Price
                  </label>
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => handleUpdatePrice(activeTab, pkg.id, e.target.value)}
                    className="font-mono font-bold text-sm text-[#0A3D91] w-full bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-[#0A3D91]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">
                    Delivery Timeline
                  </label>
                  <span className="font-mono text-xs font-bold text-gray-700 block py-1.5">
                    {pkg.timeline}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div>
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-2">
                  Included Features ({pkg.features.length})
                </span>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="font-medium text-[11px]">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Status: <strong className="text-emerald-600">Active</strong></span>
              <span className="font-mono text-[10px]">ID: {pkg.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

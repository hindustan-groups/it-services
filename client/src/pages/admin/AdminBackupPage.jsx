/**
 * AdminBackupPage — Download database backup as JSON
 * SUPER_ADMIN only.
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Download,
  Database,
  CheckSquare,
  Square,
  Loader2,
  ShieldAlert,
  Info,
  FileJson,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Package,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

// ── Table row ─────────────────────────────────────────────────
function TableRow({ tableKey, label, count, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(tableKey)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left
        ${
          selected
            ? 'border-brand-blue/40 bg-brand-blue/5'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        }`}
    >
      <span className="shrink-0 text-brand-blue">
        {selected ? (
          <CheckSquare className="w-4.5 h-4.5" />
        ) : (
          <Square className="w-4.5 h-4.5 text-gray-300" />
        )}
      </span>
      <span
        className={`flex-1 text-sm font-medium ${selected ? 'text-brand-blue' : 'text-gray-700'}`}
      >
        {label}
      </span>
      <span
        className={`text-xs font-mono px-2 py-0.5 rounded-full font-semibold
        ${selected ? 'bg-brand-blue/10 text-brand-blue' : 'bg-gray-100 text-gray-500'}`}
      >
        {count} records
      </span>
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function AdminBackupPage() {
  const [selected, setSelected] = useState(new Set())
  const [downloading, setDownloading] = useState(false)
  const [lastDownload, setLastDownload] = useState(null)
  const [dlError, setDlError] = useState(null)
  const [format, setFormat] = useState('json')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['backup-tables'],
    queryFn: () => api.get('/admin/backup/tables').then((r) => r.data),
    onSuccess: (tables) => {
      // Auto-select all on first load
      setSelected(new Set(tables.map((t) => t.key)))
    },
  })

  // Auto-select all when data loads
  const tables = data || []
  const allSelected = tables.length > 0 && tables.every((t) => selected.has(t.key))
  const someSelected = selected.size > 0

  const toggleTable = (key) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(tables.map((t) => t.key)))
    }
  }

  const totalRecords = tables
    .filter((t) => selected.has(t.key))
    .reduce((acc, t) => acc + t.count, 0)

  const handleDownload = async () => {
    if (selected.size === 0) return
    setDownloading(true)
    setDlError(null)
    try {
      const tableParam = [...selected].join(',')
      // Use fetch directly to handle file download
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || '/api'}/admin/backup?tables=${tableParam}&format=${format}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Backup failed')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const fileExtensions = { json: 'json', sql: 'sql', html: 'html' }
      const ext = fileExtensions[format] || 'json'
      a.download = `hindustan-projects-backup-${new Date().toISOString().slice(0, 10)}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setLastDownload(new Date())
    } catch (err) {
      setDlError(err.message || 'Download failed. Try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <SEO title="Data Backup" noIndex />
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">Data Backup</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Export your website data as a JSON file.
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-blue
              px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-blue/30 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-800 mb-0.5">About Backups</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Backup is downloaded as a <strong>.json</strong> file to your computer. Sensitive
              credentials (API keys, passwords) are <strong>never included</strong>. Download
              regularly — once a week is recommended.
            </p>
          </div>
        </div>

        {/* Security notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>SUPER_ADMIN only.</strong> Keep backup files secure — they contain contact
            leads, team details, and other business data. Do not share backup files publicly.
          </p>
        </div>

        {/* Table selector */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <h2 className="font-heading text-base font-semibold text-gray-800">
                Select Tables to Export
              </h2>
            </div>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-semibold text-brand-blue hover:underline transition-colors"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="p-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))
            ) : isError ? (
              <div className="text-center py-8 text-sm text-red-500 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Failed to load table info. Is the server running?
              </div>
            ) : (
              tables.map((t) => (
                <TableRow
                  key={t.key}
                  tableKey={t.key}
                  label={t.label}
                  count={t.count}
                  selected={selected.has(t.key)}
                  onToggle={toggleTable}
                />
              ))
            )}
          </div>
        </div>

        {/* Summary + download */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
          {/* Summary row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FileJson className="w-4 h-4 text-brand-blue" />
                <span className="font-semibold text-gray-800">{selected.size}</span>
                <span>tables selected</span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{totalRecords.toLocaleString()}</span>
                <span> total records</span>
              </div>
            </div>
            {lastDownload && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Last downloaded: {lastDownload.toLocaleTimeString()}
              </div>
            )}
          </div>
 
          {/* Format Selector */}
          <div className="space-y-2 border-t border-gray-150 pt-4">
            <label className="text-xs font-semibold text-gray-700 block">Export Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'json', label: 'JSON Data', desc: 'Standard restore format' },
                { id: 'sql', label: 'SQL Script', desc: 'PostgreSQL restore dump' },
                { id: 'html', label: 'HTML Report', desc: 'Offline interactive reader' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`px-3 py-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5
                    ${
                      format === f.id
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-bold shadow-sm'
                        : 'border-gray-250 bg-white hover:border-gray-350 text-gray-700'
                    }`}
                >
                  <span className="text-xs">{f.label}</span>
                  <span className="text-[9px] text-gray-400 font-normal mt-0.5">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {dlError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {dlError}
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={downloading || !someSelected || isLoading}
            className="w-full bg-brand-blue text-white font-semibold py-3 rounded-xl text-sm
              hover:bg-brand-blue-dark hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5
              transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
              flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Preparing Download…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download Backup ({selected.size} tables)
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            File:{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[11px]">
              hindustan-projects-backup-{new Date().toISOString().slice(0, 10)}.{format}
            </code>
          </p>
        </div>
      </div>
    </>
  )
}

/**
 * AdminNotesPage — Colorful sticky notes management
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Pin, Search, Tag } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const COLORS = [
  {
    id: 'yellow',
    label: 'Yellow',
    bg: 'bg-yellow-50 border-yellow-200 text-yellow-950',
    dot: 'bg-yellow-400',
    buttonCls: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
  },
  {
    id: 'blue',
    label: 'Blue',
    bg: 'bg-sky-50 border-sky-200 text-sky-950',
    dot: 'bg-sky-400',
    buttonCls: 'bg-sky-100 hover:bg-sky-250 border-sky-300',
  },
  {
    id: 'green',
    label: 'Green',
    bg: 'bg-emerald-50 border-emerald-250 text-emerald-950',
    dot: 'bg-emerald-450',
    buttonCls: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300',
  },
  {
    id: 'pink',
    label: 'Pink',
    bg: 'bg-rose-50 border-rose-200 text-rose-950',
    dot: 'bg-rose-450',
    buttonCls: 'bg-rose-100 hover:bg-rose-200 border-rose-300',
  },
  {
    id: 'purple',
    label: 'Purple',
    bg: 'bg-purple-50 border-purple-200 text-purple-950',
    dot: 'bg-purple-400',
    buttonCls: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
  },
]

export default function AdminNotesPage() {
  const [editing, setEditing] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedColor, setSelectedColor] = useState('yellow')

  // Inline add states
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [isExpanding, setIsExpanding] = useState(false)

  const qc = useQueryClient()

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['admin-notes'],
    queryFn: () => api.get('/admin/notes').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/notes', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-notes'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setNoteTitle('')
      setNoteContent('')
      setIsExpanding(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/admin/notes/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-notes'] })
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/notes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-notes'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!noteContent.trim()) return
    createMutation.mutate({
      title: noteTitle.trim() || 'Untitled Note',
      content: noteContent.trim(),
      color: selectedColor,
    })
  }

  const handleTogglePin = (note) => {
    updateMutation.mutate({ id: note.id, isPinned: !note.isPinned })
  }

  const handleColorChange = (note, color) => {
    updateMutation.mutate({ id: note.id, color })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate(id)
    }
  }

  const filteredNotes = notes.filter((n) => {
    return (
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const getNoteColorClasses = (colorId) => {
    const c = COLORS.find((c) => c.id === colorId)
    return c ? c.bg : 'bg-yellow-50 border-yellow-250 text-yellow-950'
  }

  return (
    <>
      <SEO title="Quick Notes" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">
              Internal Sticky Notepad
            </h1>
            <p className="text-sm text-gray-500">
              Jot down tasks, instructions, credentials or general reminders.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            />
          </div>
        </div>

        {/* Note Creater Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 max-w-xl transition-all">
          <form onSubmit={handleCreateSubmit} className="space-y-3">
            {isExpanding && (
              <input
                type="text"
                placeholder="Note Title (optional)"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none transition-all font-bold"
              />
            )}
            <textarea
              placeholder="Take a note, write a link or credential..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              onFocus={() => setIsExpanding(true)}
              rows={isExpanding ? 3 : 1}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none transition-all resize-none"
            />
            {isExpanding && (
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                {/* Color Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-1">
                    Color:
                  </span>
                  {COLORS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(col.id)}
                      className={`w-5 h-5 rounded-full border transition-all ${
                        selectedColor === col.id
                          ? 'ring-2 ring-brand-blue ring-offset-2 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor:
                          col.id === 'yellow'
                            ? '#fef08a'
                            : col.id === 'blue'
                              ? '#bae6fd'
                              : col.id === 'green'
                                ? '#a7f3d0'
                                : col.id === 'pink'
                                  ? '#fecdd3'
                                  : '#e9d5ff',
                      }}
                      title={col.label}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanding(false)
                      setNoteTitle('')
                      setNoteContent('')
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || !noteContent.trim()}
                    className="inline-flex items-center gap-1 bg-brand-blue text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:shadow-md transition-all disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Note
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-44 rounded-2xl border border-gray-150 bg-gray-55 animate-pulse"
              />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-150 rounded-2xl">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm font-medium">No sticky notes found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredNotes.map((note) => {
              const isNoteEditing = editing?.id === note.id
              return (
                <div
                  key={note.id}
                  className={`rounded-2xl border p-4.5 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative group min-h-[160px] ${getNoteColorClasses(
                    note.color
                  )}`}
                >
                  <div>
                    {/* Header: Title + Pin button */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      {isNoteEditing ? (
                        <input
                          type="text"
                          defaultValue={note.title}
                          onBlur={(e) =>
                            updateMutation.mutate({ id: note.id, title: e.target.value })
                          }
                          className="w-full bg-white/50 border-b border-gray-400 focus:outline-none font-bold text-sm px-1 py-0.5 rounded"
                          autoFocus
                        />
                      ) : (
                        <h4 className="font-bold text-sm leading-snug line-clamp-1 flex-1">
                          {note.title || 'Untitled'}
                        </h4>
                      )}
                      <button
                        onClick={() => handleTogglePin(note)}
                        className={`transition-colors p-1 rounded hover:bg-black/5 shrink-0 ${
                          note.isPinned
                            ? 'text-brand-red scale-110 rotate-12'
                            : 'text-gray-400 hover:text-gray-700'
                        }`}
                        title={note.isPinned ? 'Unpin note' : 'Pin note'}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Content */}
                    {isNoteEditing ? (
                      <textarea
                        defaultValue={note.content}
                        onBlur={(e) =>
                          updateMutation.mutate({ id: note.id, content: e.target.value })
                        }
                        className="w-full bg-white/50 border border-gray-400 focus:outline-none text-xs p-1.5 rounded resize-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                        {note.content}
                      </p>
                    )}
                  </div>

                  {/* Footer options */}
                  <div className="mt-4 pt-3.5 border-t border-black/5 flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <span>
                      {new Date(note.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {/* Color selector & Delete buttons on hover */}
                    <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Color Palette dropdown / hover list */}
                      <div className="flex items-center gap-0.5 bg-black/5 p-0.5 rounded-lg">
                        {COLORS.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => handleColorChange(note, col.id)}
                            className={`w-3 h-3 rounded-full border border-black/10 transition-transform hover:scale-125 ${
                              note.color === col.id ? 'ring-1 ring-black/35 scale-110' : ''
                            }`}
                            style={{
                              backgroundColor:
                                col.id === 'yellow'
                                  ? '#fef08a'
                                  : col.id === 'blue'
                                    ? '#bae6fd'
                                    : col.id === 'green'
                                      ? '#a7f3d0'
                                      : col.id === 'pink'
                                        ? '#fecdd3'
                                        : '#e9d5ff',
                            }}
                            title={col.label}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setEditing(isNoteEditing ? null : note)}
                        className="text-gray-600 hover:text-black p-1 hover:bg-black/5 rounded transition-all"
                        title="Edit Note"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-gray-600 hover:text-red-600 p-1 hover:bg-black/5 rounded transition-all"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

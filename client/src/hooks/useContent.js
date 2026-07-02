import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: () => api.get('/faqs'),
    staleTime: 10 * 60 * 1000,
  })
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: () => api.get('/settings'),
    staleTime: 10 * 60 * 1000,
  })
}

export function useMilestones() {
  return useQuery({
    queryKey: ['milestones'],
    queryFn: () => api.get('/milestones'),
    staleTime: 10 * 60 * 1000,
  })
}

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: () => api.get('/partners'),
    staleTime: 10 * 60 * 1000,
  })
}

// ── Legal Pages Hooks ──────────────────────────────────────────
export function useLegalPage(pageType) {
  return useQuery({
    queryKey: ['legal-page', pageType],
    queryFn: () => api.get(`/legal/${pageType}`).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminLegalPages() {
  return useQuery({
    queryKey: ['admin-legal-pages'],
    queryFn: () => api.get('/admin/legal').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateLegalPage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ pageType, title, content }) => 
      api.put(`/admin/legal/${pageType}`, { title, content }).then(r => r.data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['admin-legal-pages'] })
      qc.invalidateQueries({ queryKey: ['legal-page', variables.pageType] })
    }
  })
}

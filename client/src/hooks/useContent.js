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

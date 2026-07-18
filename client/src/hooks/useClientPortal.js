/**
 * useClientPortal.js — React Query hooks for the Client Portal
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'

export function useClientMe() {
  return useQuery({
    queryKey: ['client-me'],
    queryFn: () => api.get('/client/me').then((r) => r.data),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useClientProjects() {
  return useQuery({
    queryKey: ['client-projects'],
    queryFn: () => api.get('/client/projects').then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  })
}

export function useClientProject(id) {
  return useQuery({
    queryKey: ['client-project', id],
    queryFn: () => api.get(`/client/projects/${id}`).then((r) => r.data),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  })
}

export function useClientLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (credentials) => api.post('/client/login', credentials),
    onSuccess: (res) => {
      qc.setQueryData(['client-me'], res.data)
      qc.invalidateQueries({ queryKey: ['client-projects'] })
    },
  })
}

export function useClientSetupPassword() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/client/setup-password', data),
    onSuccess: (res) => {
      qc.setQueryData(['client-me'], res.data)
      qc.invalidateQueries({ queryKey: ['client-projects'] })
    },
  })
}

export function useClientLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/client/logout', {}),
    onSuccess: () => {
      qc.setQueryData(['client-me'], null)
      qc.clear()
    },
  })
}

export function useClientTickets() {
  return useQuery({
    queryKey: ['client-tickets'],
    queryFn: () => api.get('/client/tickets').then((r) => r.data),
    staleTime: 1 * 60 * 1000,
  })
}

export function useClientTicket(id) {
  return useQuery({
    queryKey: ['client-ticket', id],
    queryFn: () => api.get(`/client/tickets/${id}`).then((r) => r.data),
    enabled: !!id,
    staleTime: 30 * 1000,
  })
}

export function useClientCreateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/client/tickets', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client-tickets'] })
    },
  })
}

export function useClientReplyTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ticketId, message }) =>
      api.post(`/client/tickets/${ticketId}/messages`, { message }).then((r) => r.data),
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['client-ticket', variables.ticketId] })
      qc.invalidateQueries({ queryKey: ['client-tickets'] })
    },
  })
}

export function useClientBilling() {
  return useQuery({
    queryKey: ['client-billing'],
    queryFn: () => api.get('/client/billing').then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  })
}

export function useClientPayMilestone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.post(`/client/billing/${id}/pay`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client-billing'] })
      qc.invalidateQueries({ queryKey: ['client-projects'] })
    },
  })
}

export function useClientSubmitFeedback() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, rating, text, companyName, role }) =>
      api.post(`/client/projects/${projectId}/feedback`, { rating, text, companyName, role }).then((r) => r.data),
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['client-projects'] })
      qc.invalidateQueries({ queryKey: ['client-project', variables.projectId] })
    },
  })
}


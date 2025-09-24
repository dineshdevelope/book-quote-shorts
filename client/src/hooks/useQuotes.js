import { useQuery } from '@tanstack/react-query'
import { quoteAPI } from '../services/api'

export const useQuotes = () => {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const response = await quoteAPI.getAll()
      console.log('API Response:', response)
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data.data)) {
        return response.data
      } else if (Array.isArray(response.data)) {
        return { data: response.data, total: response.data.length }
      } else {
        return { data: [], total: 0 }
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}
import { useState } from 'react'
import { Plus, Trash2, Edit3, BarChart3 } from 'lucide-react'
import { useQuotes } from '../hooks/useQuotes'
import { quoteAPI } from '../services/api'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const Admin = () => {
  const { data: quotesData } = useQuotes()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    quote: '',
    bookTitle: '',
    author: '',
    category: 'fiction',
    bgColor: '#3b82f6'
  })
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Only allow admin access
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Submitting form data:', formData)
    
    try {
      await quoteAPI.create(formData)
      toast.success('Quote created successfully!')
      setShowForm(false)
      setFormData({
        quote: '',
        bookTitle: '',
        author: '',
        category: 'fiction',
        bgColor: '#3b82f6'
      })
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    } catch (error) {
      toast.error('Failed to create quote')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return
    
    try {
      await quoteAPI.delete(id)
      toast.success('Quote deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    } catch (error) {
      toast.error('Failed to delete quote')
    }
  }

  // FIX: Proper array check and safe data access
  const quotes = Array.isArray(quotesData?.data) ? quotesData.data : []
  const totalQuotes = quotesData?.total || quotes.length
  const totalLikes = Array.isArray(quotes) ? quotes.reduce((sum, quote) => sum + (quote.likes || 0), 0) : 0
  const mostLiked = Array.isArray(quotes) && quotes.length > 0 ? Math.max(...quotes.map(q => q.likes || 0)) : 0
  const categoriesCount = Array.isArray(quotes) ? new Set(quotes.map(q => q.category).filter(Boolean)).size : 0

  if (!quotesData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8 pt-10 sm:pt-15">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">Manage book quotes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Quote</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-effect p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Quotes</h3>
          <p className="text-3xl font-bold">{totalQuotes}</p>
        </div>
        <div className="glass-effect p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Likes</h3>
          <p className="text-3xl font-bold">{totalLikes}</p>
        </div>
        <div className="glass-effect p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Most Liked</h3>
          <p className="text-3xl font-bold">{mostLiked}</p>
        </div>
        <div className="glass-effect p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <p className="text-3xl font-bold">{categoriesCount}</p>
        </div>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {quotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">No Quotes Yet</h3>
            <p className="text-gray-400">Get started by adding your first quote!</p>
          </div>
        ) : (
          quotes.map((quote) => (
            <div key={quote._id || quote.id} className="glass-effect p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-lg italic mb-2">"{quote.quote}"</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <span><strong>Book:</strong> {quote.bookTitle}</span>
                    <span><strong>Author:</strong> {quote.author}</span>
                    <span><strong>Category:</strong> {quote.category || 'fiction'}</span>
                    <span><strong>Likes:</strong> {quote.likes || 0}</span>
                    <span><strong>Views:</strong> {quote.views || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(quote._id || quote.id)}
                  className="ml-4 px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Quote Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-effect p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quote</label>
                <textarea
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Book Title</label>
                <input
                  required
                  type="text"
                  value={formData.bookTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, bookTitle: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  required
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Quote
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
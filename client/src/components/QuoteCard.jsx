import { motion } from 'framer-motion'
import { Heart, Share2 } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { quoteAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const QuoteCard = ({ quote }) => {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [isLiking, setIsLiking] = useState(false)

  const likeMutation = useMutation({
    mutationFn: () => quoteAPI.like(quote._id),
    onMutate: async () => {
      setIsLiking(true)
      await queryClient.cancelQueries({ queryKey: ['quotes'] })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
    onError: () => {
      toast.error('Failed to like quote')
    },
    onSettled: () => {
      setIsLiking(false)
    }
  })

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like quotes')
      return
    }
    likeMutation.mutate()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `"${quote.quote}"`,
          text: `From ${quote.bookTitle} by ${quote.author}`,
        })
      } catch (err) {
        // Share failed
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(`"${quote.quote}" - ${quote.author}, ${quote.bookTitle}`)
      toast.success('Quote copied to clipboard!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex items-center justify-center p-4"
      style={{ backgroundColor: quote.bgColor || '#3b82f6' }}
    >
      <div className="text-center max-w-2xl mx-auto">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-serif italic mb-8 text-shadow-lg"
        >
          "{quote.quote}"
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <h2 className="text-2xl md:text-3xl font-semibold">{quote.bookTitle}</h2>
          <p className="text-xl md:text-2xl text-white/80">by {quote.author}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center space-x-2 px-6 py-3 rounded-full glass-effect hover:scale-105 transition-transform"
          >
            <Heart className="h-6 w-6" />
            <span>{quote.likes}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-6 py-3 rounded-full glass-effect hover:scale-105 transition-transform"
          >
            <Share2 className="h-6 w-6" />
            <span>Share</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default QuoteCard
import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeft, ChevronRight, Play, Pause, Plus, Settings } from 'lucide-react'
import QuoteCard from './QuoteCard'
import { useQuotes } from '../hooks/useQuotes'
import { useNavigate } from 'react-router-dom'

const QuoteCarousel = () => {
  const { data: quotesData, isLoading, error } = useQuotes()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const navigate = useNavigate()
  
  // DEBUG: Log the data to see what's happening
  console.log('quotesData:', quotesData)
  console.log('quotesData.data:', quotesData?.data)

  // FIX: Better array handling with multiple fallbacks
  const quotes = Array.isArray(quotesData?.data) 
    ? quotesData.data 
    : Array.isArray(quotesData) 
      ? quotesData 
      : []

  console.log('quotes array:', quotes)
  console.log('quotes length:', quotes.length)

  const nextQuote = () => {
    if (quotes.length === 0) return
    setCurrentIndex(prev => (prev + 1) % quotes.length)
  }

  const prevQuote = () => {
    if (quotes.length === 0) return
    setCurrentIndex(prev => (prev - 1 + quotes.length) % quotes.length)
  }

  useEffect(() => {
    if (!isAutoPlay || quotes.length === 0) return

    const interval = setInterval(nextQuote, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlay, quotes.length])

  const handlers = useSwipeable({
    onSwipedLeft: nextQuote,
    onSwipedRight: prevQuote,
    trackMouse: true
  })

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading quotes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Failed to load quotes</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // FIX: Better check that includes debugging
  if (!Array.isArray(quotes) || quotes.length === 0) {
    console.log('Showing empty state - quotes is not array or empty:', quotes)
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Quotes Available</h2>
          <p className="text-gray-400 mb-6">Get started by adding some inspiring book quotes</p>
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Go to Admin</span>
          </button>
        </div>
      </div>
    )
  }

  console.log('Rendering carousel with quotes:', quotes.length)

  // Only render the carousel if we have a valid array with quotes
  return (
    <div {...handlers} className="relative h-screen overflow-hidden">
      <QuoteCard quote={quotes[currentIndex]} />

      {/* Admin Button - Top Left */}
      <button
        onClick={() => navigate('/admin')}
        className="absolute top-4 left-4 px-4 py-2 rounded-full glass-effect hover:scale-105 transition-transform flex items-center space-x-2"
      >
        <Settings className="h-4 w-4" />
        <span>Admin</span>
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
        <button
          onClick={prevQuote}
          className="p-3 rounded-full glass-effect hover:scale-110 transition-transform"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="p-3 rounded-full glass-effect hover:scale-110 transition-transform"
        >
          {isAutoPlay ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>

        <button
          onClick={nextQuote}
          className="p-3 rounded-full glass-effect hover:scale-110 transition-transform"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Current position indicator */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-effect text-sm">
        {currentIndex + 1} / {quotes.length}
      </div>
    </div>
  )
}

export default QuoteCarousel
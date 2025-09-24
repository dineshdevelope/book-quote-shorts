import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: [true, 'Quote text is required'],
    trim: true,
    maxlength: [500, 'Quote cannot be more than 500 characters']
  },
  bookTitle: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Book title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  bgColor: {
    type: String,
    default: '#4F46E5'
  },
  category: {
    type: String,
    enum: ['fiction', 'non-fiction', 'poetry', 'biography', 'other'],
    default: 'fiction'
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
quoteSchema.index({ category: 1, isActive: 1 });
quoteSchema.index({ likes: -1 });
quoteSchema.index({ createdAt: -1 });

// Virtual for popularity score
quoteSchema.virtual('popularityScore').get(function() {
  return this.likes * 2 + this.views;
});

const Quote = mongoose.model('Quote', quoteSchema);

export default Quote;
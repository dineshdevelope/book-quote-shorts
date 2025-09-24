import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote',
    required: true
  }
}, {
  timestamps: true
});

// Prevent duplicate likes
likeSchema.index({ user: 1, quote: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;
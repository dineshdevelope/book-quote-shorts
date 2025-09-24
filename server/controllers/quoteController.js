import Quote from '../models/Quote.js';
import Like from '../models/Like.js';

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Public
export const getQuotes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const sortBy = req.query.sortBy || 'createdAt';

    let query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'popular':
        sortOptions = { likes: -1 };
        break;
      case 'latest':
        sortOptions = { createdAt: -1 };
        break;
      case 'random':
        // For random sorting, we'll use aggregate
        const quotes = await Quote.aggregate([
          { $match: query },
          { $sample: { size: limit } }
        ]);
        return res.status(200).json({
          success: true,
          count: quotes.length,
          data: quotes
        });
      default:
        sortOptions = { createdAt: -1 };
    }

    const quotes = await Quote.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Quote.countDocuments(query);

    // Increment views for each quote
    await Promise.all(
      quotes.map(quote => 
        Quote.findByIdAndUpdate(quote._id, { $inc: { views: 1 } })
      )
    );

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: quotes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quote
// @route   GET /api/quotes/:id
// @access  Public
export const getQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote || !quote.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    // Increment views
    quote.views += 1;
    await quote.save();

    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quote
// @route   POST /api/quotes
// @access  Private/Admin
export const createQuote = async (req, res, next) => {
  try {
    const quote = await Quote.create(req.body);

    res.status(201).json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quote
// @route   PUT /api/quotes/:id
// @access  Private/Admin
export const updateQuote = async (req, res, next) => {
  try {
    let quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
export const deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    await Quote.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike quote
// @route   POST /api/quotes/:id/like
// @access  Private
export const likeQuote = async (req, res, next) => {
  try {
    const quoteId = req.params.id;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ user: userId, quote: quoteId });

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      await Quote.findByIdAndUpdate(quoteId, { $inc: { likes: -1 } });

      res.status(200).json({
        success: true,
        liked: false,
        message: 'Quote unliked successfully'
      });
    } else {
      // Like
      await Like.create({ user: userId, quote: quoteId });
      await Quote.findByIdAndUpdate(quoteId, { $inc: { likes: 1 } });

      res.status(200).json({
        success: true,
        liked: true,
        message: 'Quote liked successfully'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get quote statistics
// @route   GET /api/quotes/stats
// @access  Private/Admin
export const getQuoteStats = async (req, res, next) => {
  try {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalViews: { $sum: '$views' },
          avgLikes: { $avg: '$likes' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
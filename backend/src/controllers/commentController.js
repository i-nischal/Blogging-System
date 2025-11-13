import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @desc    Create a new comment
 * @route   POST /api/comments/blog/:blogId
 * @access  Private (Any authenticated user)
 */
export const createComment = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;

  // Check if blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(ApiResponse.notFound('Blog not found'));
  }

  // Check if blog is published
  if (blog.status !== 'published') {
    return res.status(403).json(ApiResponse.forbidden('Cannot comment on unpublished blog'));
  }

  const comment = await Comment.create({
    content,
    blog: blogId,
    user: req.user._id
  });

  // Populate user details for response
  await comment.populate('user', 'name email');

  res.status(201).json(ApiResponse.created('Comment added successfully', comment));
});

/**
 * @desc    Get all comments for a blog
 * @route   GET /api/comments/blog/:blogId
 * @access  Public
 */
export const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Check if blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(ApiResponse.notFound('Blog not found'));
  }

  const comments = await Comment.find({ 
    blog: blogId,
    isActive: true 
  })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({ 
    blog: blogId,
    isActive: true 
  });

  res.json(ApiResponse.success('Comments retrieved successfully', {
    comments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }));
});

/**
 * @desc    Update a comment
 * @route   PUT /api/comments/:id
 * @access  Private (Comment owner only)
 */
export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json(ApiResponse.notFound('Comment not found'));
  }

  // Check if user owns the comment
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json(ApiResponse.forbidden('Not authorized to update this comment'));
  }

  // Check if comment is still active
  if (!comment.isActive) {
    return res.status(400).json(ApiResponse.error('Cannot update deleted comment'));
  }

  comment.content = req.body.content;
  await comment.save();

  await comment.populate('user', 'name email');

  res.json(ApiResponse.success('Comment updated successfully', comment));
});

/**
 * @desc    Delete a comment (soft delete)
 * @route   DELETE /api/comments/:id
 * @access  Private (Comment owner or Blog author)
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate('blog');

  if (!comment) {
    return res.status(404).json(ApiResponse.notFound('Comment not found'));
  }

  // Check if user owns the comment OR is the blog author
  const isCommentOwner = comment.user.toString() === req.user._id.toString();
  const isBlogAuthor = comment.blog.author.toString() === req.user._id.toString();

  if (!isCommentOwner && !isBlogAuthor) {
    return res.status(403).json(ApiResponse.forbidden('Not authorized to delete this comment'));
  }

  // Soft delete by setting isActive to false
  comment.isActive = false;
  await comment.save();

  res.json(ApiResponse.success('Comment deleted successfully'));
});

/**
 * @desc    Get user's comments
 * @route   GET /api/comments/my-comments
 * @access  Private
 */
export const getMyComments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ 
    user: req.user._id,
    isActive: true 
  })
    .populate('blog', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({ 
    user: req.user._id,
    isActive: true 
  });

  res.json(ApiResponse.success('My comments retrieved successfully', {
    comments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }));
});

/**
 * @desc    Get comment by ID
 * @route   GET /api/comments/:id
 * @access  Public
 */
export const getComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('blog', 'title');

  if (!comment) {
    return res.status(404).json(ApiResponse.notFound('Comment not found'));
  }

  res.json(ApiResponse.success('Comment retrieved successfully', comment));
});
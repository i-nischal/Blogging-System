import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { 
  uploadToCloudinary, 
  uploadMultipleToCloudinary,
  deleteFromCloudinary 
} from '../utils/cloudinaryUtils.js';

/**
 * @desc    Upload single image
 * @route   POST /api/upload/single
 * @access  Private (Writer only)
 */
export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(ApiResponse.error('No image file provided'));
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, 'blog-images');

    res.json(ApiResponse.success('Image uploaded successfully', {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    }));
  } catch (error) {
    res.status(500).json(ApiResponse.error('Failed to upload image'));
  }
});

/**
 * @desc    Upload multiple images
 * @route   POST /api/upload/multiple
 * @access  Private (Writer only)
 */
export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json(ApiResponse.error('No image files provided'));
  }

  try {
    const results = await uploadMultipleToCloudinary(req.files, 'blog-images');

    const uploadedImages = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    }));

    res.json(ApiResponse.success('Images uploaded successfully', uploadedImages));
  } catch (error) {
    res.status(500).json(ApiResponse.error('Failed to upload images'));
  }
});

/**
 * @desc    Delete image from Cloudinary
 * @route   DELETE /api/upload/:publicId
 * @access  Private (Writer only)
 */
export const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  try {
    const result = await deleteFromCloudinary(publicId);

    if (result.result === 'ok') {
      res.json(ApiResponse.success('Image deleted successfully'));
    } else {
      res.status(400).json(ApiResponse.error('Failed to delete image'));
    }
  } catch (error) {
    res.status(500).json(ApiResponse.error('Failed to delete image'));
  }
});
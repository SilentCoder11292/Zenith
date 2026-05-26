import Asset from './Asset.js';
import AppError from '../../shared/utils/AppError.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

// ==========================================
// CRUD ENDPOINT HANDLERS
// ==========================================

/**
 * @desc    Create a new user asset
 * @route   POST /api/v1/assets
 * @access  Private
 */
export const createAsset = asyncHandler(async (req, res, next) => {
  // Enforce secure dynamic binding of userId context to block client forgery
  req.body.userId = req.user.id;

  const newAsset = await Asset.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      asset: newAsset,
    },
  });
});

/**
 * @desc    Get all assets belonging to active user
 * @route   GET /api/v1/assets
 * @access  Private
 */
export const getAllAssets = asyncHandler(async (req, res, next) => {
  // Query only documents belonging strictly to the authenticated tenant
  const assets = await Asset.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: {
      assets,
    },
  });
});

/**
 * @desc    Get single asset by ID
 * @route   GET /api/v1/assets/:id
 * @access  Private
 */
export const getAsset = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findById(req.params.id);

  // 1. Confirm asset exists
  if (!asset) {
    return next(new AppError(`No asset found with ID '${req.params.id}'.`, 404));
  }

  // 2. Tenancy Validation: Verify resource ownership
  if (asset.userId.toString() !== req.user.id) {
    return next(
      new AppError('Access Denied: You do not possess structural ownership permissions for this asset.', 403)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      asset,
    },
  });
});

/**
 * @desc    Update single asset parameters
 * @route   PUT /api/v1/assets/:id
 * @access  Private
 */
export const updateAsset = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findById(req.params.id);

  // 1. Confirm asset exists
  if (!asset) {
    return next(new AppError(`No asset found with ID '${req.params.id}'.`, 404));
  }

  // 2. Tenancy Validation: Verify resource ownership
  if (asset.userId.toString() !== req.user.id) {
    return next(
      new AppError('Access Denied: You do not possess structural ownership permissions to update this asset.', 403)
    );
  }

  // 3. Apply updates and execute model validation constraints
  const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      asset: updatedAsset,
    },
  });
});

/**
 * @desc    Delete single user asset
 * @route   DELETE /api/v1/assets/:id
 * @access  Private
 */
export const deleteAsset = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findById(req.params.id);

  // 1. Confirm asset exists
  if (!asset) {
    return next(new AppError(`No asset found with ID '${req.params.id}'.`, 404));
  }

  // 2. Tenancy Validation: Verify resource ownership
  if (asset.userId.toString() !== req.user.id) {
    return next(
      new AppError('Access Denied: You do not possess structural ownership permissions to delete this asset.', 403)
    );
  }

  // 3. Execute deletion
  await Asset.findByIdAndDelete(req.params.id);

  // Respond with 204 No Content for successful deletion
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

import express from 'express';
import {
  createAsset,
  getAllAssets,
  getAsset,
  updateAsset,
  deleteAsset,
} from './assetController.js';
import { createAssetSchema, updateAssetSchema, validate } from './assetValidation.js';
import protect from '../../shared/middlewares/protect.js';

const router = express.Router();

// ==========================================
// PROTECTED ASSETS CRUD ROUTING PIPELINE
// ==========================================

// Enforce authentication context globally for all downstream assets routes
router.use(protect);

// Routes for resource collections
router
  .route('/')
  .post(validate(createAssetSchema), createAsset) // Log new asset
  .get(getAllAssets);                             // Retrieve all user assets

// Routes for specific resource instances by ID
router
  .route('/:id')
  .get(getAsset)                                   // Fetch asset details
  .put(validate(updateAssetSchema), updateAsset)   // Update asset parameters
  .delete(deleteAsset);                            // Delete asset record

export default router;

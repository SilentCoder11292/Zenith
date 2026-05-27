import { z } from 'zod';
import validate from '../../shared/middlewares/validate.js';

// ==========================================
// 1. ASSET ZOD SCHEMAS
// ==========================================

export const createAssetSchema = z.object({
  body: z.object({
    assetType: z.enum(['Liquid Cash', 'Land', 'Commercial Building', 'Equipment'], {
      errorMap: () => ({ message: 'Asset type must be either: Liquid Cash, Land, Commercial Building, or Equipment.' }),
    }).optional(),
    category: z.enum(['Liquid Cash', 'Land', 'Commercial Building', 'Equipment'], {
      errorMap: () => ({ message: 'Category must be either: Liquid Cash, Land, Commercial Building, or Equipment.' }),
    }).optional(),
    valueINR: z.number({ required_error: 'Asset value in INR is required.' })
      .positive('Asset value in INR must be a positive, non-zero number.'),
    description: z.string().trim().max(500, 'Description cannot exceed 500 characters.').optional(),
    physicalAddress: z.string().trim().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    location: z.object({
      address: z.string().trim().optional(),
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      coordinates: z.object({
        lat: z.number()
          .min(-90, 'Latitude must be a valid geographic degree between -90 and 90.')
          .max(90, 'Latitude must be a valid geographic degree between -90 and 90.'),
        lng: z.number()
          .min(-180, 'Longitude must be a valid geographic degree between -180 and 180.')
          .max(180, 'Longitude must be a valid geographic degree between -180 and 180.'),
      }).optional(),
    }).optional(),
  }).strict() // Rejects requests with unrecognized parameters (e.g., body.userId) to protect against forgery
});

export const updateAssetSchema = z.object({
  body: z.object({
    assetType: z.enum(['Liquid Cash', 'Land', 'Commercial Building', 'Equipment']).optional(),
    valueINR: z.number()
      .positive('Asset value in INR must be a positive, non-zero number.')
      .optional(),
    description: z.string().trim().max(500, 'Description cannot exceed 500 characters.').optional(),
    location: z.object({
      address: z.string().trim().optional(),
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      coordinates: z.object({
        lat: z.number()
          .min(-90, 'Latitude must be a valid geographic degree between -90 and 90.')
          .max(90, 'Latitude must be a valid geographic degree between -90 and 90.'),
        lng: z.number()
          .min(-180, 'Longitude must be a valid geographic degree between -180 and 180.')
          .max(180, 'Longitude must be a valid geographic degree between -180 and 180.'),
      }).optional(),
    }).optional(),
  }).strict() // Protects against forgery attempts on update requests
});

export { validate };

import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An asset must belong to a registered user.'],
    },
    assetType: {
      type: String,
      required: [true, 'Please specify an asset type.'],
      enum: {
        values: ['Liquid Cash', 'Land', 'Commercial Building', 'Equipment'],
        message: 'Asset type must be either: Liquid Cash, Land, Commercial Building, or Equipment.',
      },
    },
    valueINR: {
      type: Number,
      required: [true, 'Please specify the asset value in INR.'],
      min: [0, 'Asset value in INR must be a positive number.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
    },
    location: {
      address: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      coordinates: {
        lat: {
          type: Number,
          validate: {
            validator: function (val) {
              if (val === undefined || val === null) return true; // Optional coordinate check
              return val >= -90 && val <= 90;
            },
            message: 'Latitude must be a valid geographic degree between -90 and 90.',
          },
        },
        lng: {
          type: Number,
          validate: {
            validator: function (val) {
              if (val === undefined || val === null) return true; // Optional coordinate check
              return val >= -180 && val <= 180;
            },
            message: 'Longitude must be a valid geographic degree between -180 and 180.',
          },
        },
      },
    },
  },
  {
    timestamps: true, // Manages createdAt and updatedAt fields
  }
);

// Add index on userId for fast query filtering
assetSchema.index({ userId: 1 });

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;

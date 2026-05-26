import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters.'],
      maxlength: [50, 'Name cannot exceed 50 characters.'],
    },
    email: {
      type: String,
      required: [true, 'A user must have an email address.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address.',
      ],
    },
    password: {
      type: String,
      required: [true, 'A user must have a secure password.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select: false, // Prevents password leak in API responses by default
    },
    role: {
      type: String,
      required: [true, 'A user must select an incubation role.'],
      enum: {
        values: ['entrepreneur', 'investor', 'supplier'],
        message: 'Role must be either: entrepreneur, investor, or supplier.',
      },
    },
    onboardingPath: {
      type: String,
      enum: {
        values: ['has_idea', 'needs_idea'],
        message: 'Onboarding path must be either: has_idea or needs_idea.',
      },
      default: 'has_idea',
    },
    gstin: {
      type: String,
      trim: true,
      // Optional Indian GSTIN format check for registered business verification
      validate: {
        validator: function (val) {
          if (!val) return true; // Optional field
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val);
        },
        message: 'Please provide a valid Indian GSTIN number.',
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// ==========================================
// PRE-SAVE PASSWORD HASHING LIFECYCLE HOOK
// ==========================================
userSchema.pre('save', async function (next) {
  // Check if password has actually been modified (prevents double-hashing on profile updates)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate secure salt rounds (12 is optimal security/performance scaling)
    const salt = await bcrypt.genSalt(12);
    // Hash password and assign to document field
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ==========================================
// INSTANCE METHODS
// ==========================================

/**
 * Compare entered password with stored hashed password
 * @param {string} candidatePassword - Raw password submitted by client
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

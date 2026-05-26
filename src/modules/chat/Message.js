import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A chat message must belong to a registered user.'],
    },
    role: {
      type: String,
      required: [true, 'A chat message must specify its role.'],
      enum: {
        values: ['user', 'model'],
        message: 'Message role must be either: user or model.',
      },
    },
    text: {
      type: String,
      required: [true, 'A chat message must contain text.'],
      trim: true,
      maxlength: [20000, 'A single message cannot exceed 20000 characters.'],
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt fields
  }
);

// Compound Indexing for optimized chronological user conversation fetches
messageSchema.index({ userId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;

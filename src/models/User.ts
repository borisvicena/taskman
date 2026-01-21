import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  passwordHash: {
    type: String,
    required: false,
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true, 
  },

  isAdmin: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
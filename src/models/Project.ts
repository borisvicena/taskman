import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["editor", "viewer"],
    default: "viewer",
  }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,

  status: {
    type: String,
    enum: ["active", "on-hold", "done"],
    default: "active", 
  },

  dueDate: {
    type: Date,
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  members: [projectMemberSchema],

}, { timestamps: true });

// Add index for members.userId to improve query performance
ProjectSchema.index({ "members.userId": 1 });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
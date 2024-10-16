import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: {
    type: [mongoose.Types.ObjectId],
    ref: "Image",
    default: [],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema);
export default Folder;

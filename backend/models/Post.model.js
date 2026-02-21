import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: 10,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ title: "text", content: "text" });

const Post = mongoose.model("Post", postSchema);
export default Post;

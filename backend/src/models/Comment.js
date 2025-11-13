import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please add comment content"],
      trim: true,
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update blog's comment count
commentSchema.post("save", async function () {
  const Blog = mongoose.model("Blog");
  await Blog.findByIdAndUpdate(this.blog, {
    $inc: { commentCount: 1 },
  });
});

commentSchema.post("remove", async function () {
  const Blog = mongoose.model("Blog");
  await Blog.findByIdAndUpdate(this.blog, {
    $inc: { commentCount: -1 },
  });
});

export default mongoose.model("Comment", commentSchema);

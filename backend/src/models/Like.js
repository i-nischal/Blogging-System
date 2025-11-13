import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate likes
likeSchema.index({ blog: 1, user: 1 }, { unique: true });

// Update blog's like count
likeSchema.post("save", async function () {
  const Blog = mongoose.model("Blog");
  await Blog.findByIdAndUpdate(this.blog, {
    $inc: { likeCount: 1 },
  });
});

likeSchema.post("remove", async function () {
  const Blog = mongoose.model("Blog");
  await Blog.findByIdAndUpdate(this.blog, {
    $inc: { likeCount: -1 },
  });
});

export default mongoose.model("Like", likeSchema);

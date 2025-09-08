import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A post title is required"],
    trim: true,
  },
  slug: {
    type: String,
    uniques: true,
  },
  markdownContent: {
    type: String,
    required: [true, "A post content is required"],
  },
  categories: {
    type: [String],
    default: []
  },
  author: {
    type: String,
    default: "Admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// This function will run before any document created from this schema is saved.
// We use a standard function() declaration to get access to the 'this' keyword,
// which points to the current document being saved.
postSchema.pre('save', function(next) {
  // We only want to generate a slug if the post is new OR if the title has been modified.
  // If we're just updating the content, we don't want the URL (slug) to change,
  // as this would break existing links to the post.
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;

import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { title, markdownContent, categories, author } = req.body;
    if (!title || !markdownContent) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const newPost = await Post.create({
      title,
      markdownContent,
      categories,
      author,
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    // We use parseInt to convert the string from the query into a number.
    // The || operator provides a default value if one isn't specified in the URL.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page.

    // This is the core formula for pagination.
    const skip = (page - 1) * limit;

    // We need this to calculate the total number of pages.
    // .countDocuments() is much more efficient than fetching all documents and getting the length.
    const totalPosts = await Post.countDocuments();

    const posts = await Post.find({})
      .sort({ createdAt: -1 }) // Sort by creation date, newest first.
      .skip(skip) // Skip the documents for previous pages.
      .limit(limit);    // Limit the results to the number per page.
    
      res.status(200).json({
        posts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
      });

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const postSlug = req.params.slug;
    if (!postSlug) {
      return res.status(400).json({ message: "Post Slug is required" });
    }
    const post = await Post.findOne({ slug: postSlug });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: "Post Id is required" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;

    const posts = await Post.find({ categories: categoryName }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  }
  catch (error) {
    res.status(500).json({
      message: "Error fetching posts by category", error: error.message
    });
  }
}

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const { title, markdownContent, categories } = req.body;
    const updatedData = {
      title,
      markdownContent,
      categories
    }
    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

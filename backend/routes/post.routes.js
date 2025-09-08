import express from 'express';
import { getAllPosts, createPost, getPostBySlug, updatePost, deletePost, getPostById, getPostsByCategory } from '../controllers/post.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const postRouter = express.Router();

// Route to get all posts
postRouter.get("/", getAllPosts);

// Route to create a new post
postRouter.post("/", [protect], createPost);

postRouter.get("/category/:categoryName", getPostsByCategory);

// Route to get a specific post by ID
postRouter.get("/slug/:slug", getPostBySlug);

postRouter.get("/id/:id", getPostById);


// Route to update a post by ID
postRouter.patch("/:id", protect, updatePost);

// Route to delete a post by ID
postRouter.delete("/:id", protect, deletePost);

export default postRouter;
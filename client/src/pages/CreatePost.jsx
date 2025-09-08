import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import "../css/CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [categories, setCategories] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if(!title.trim() || !markdownContent.trim()) {
        setError("Title and Content are required.");
        setLoading(false);
        return;
    }

    const categoryArray = categories.split(',').map(cat => cat.trim()).filter(cat => cat);

    try {
        await apiService.post('/posts', {
            title,
            markdownContent,
            categories: categoryArray,
            author: 'Admin'
        });

        navigate('/admin/dashboard');
    }
    catch(err) {
        console.error("Failed to create post", err);
        setError(err.response?.data?.messsage || "Failed to create post. Please try again later.");
        setLoading(false);
    }
  }

  return (
    <div className="create-post-page">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="markdownContent">Content (Markdown)</label>
          {/* The textarea for Markdown is also a controlled component */}
          <textarea
            id="markdownContent"
            className="form-control markdown-input"
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            placeholder="Write your post content here using Markdown..."
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="categories">Categories (comma-separated)</label>
          <input
            type="text"
            id="categories"
            className="form-control"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="e.g., React, Web Development, Tutorial"
            disabled={loading}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

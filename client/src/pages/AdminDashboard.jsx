import { useState, useEffect } from "react";
import apiService from "../services/apiService";
import { Link } from "react-router-dom";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiService.get(`/posts`);
        setPosts(response.data.posts);
      } catch (err) {
        console.log("Failed to fetch posts", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");

    if(!isConfirmed) {
      return;
    }

    try {
      await apiService.delete(`/posts/${postId}`);
      setPosts(currentPosts => currentPosts.filter(post => post._id !== postId));
      alert("Post deleted successfully.");
    }
    catch(err) {
      console.log("Failed to delete post", err);
      alert("Failed to delete post. Please try again later.");
    }
  };

  if (loading) {
    return <div className="loading-message">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Manage Posts</h2>
      </div>
      <Link to="/admin/create-post" className="create-post-btn">
        + Create New Post
      </Link>
      <table className="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Check if there are posts to display */}
          {posts.length > 0 ? (
            // Map over the posts array to render a table row for each post.
            posts.map((post) => (
              // The 'key' prop is essential for React's rendering performance.
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                {/* Format the date for better readability */}
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <Link
                    to={`/admin/edit-post/${post._id}`}
                    className="btn edit-btn"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            // Display a message if no posts are found.
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No posts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

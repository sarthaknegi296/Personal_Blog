import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/apiService";
import PostListItem from "../components/PostListItem";
import "../css/HomePage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiService.get(
          `/posts/category/${categoryName}`
        );
        setPosts(response.data);
      } catch (err) {
        console.error(
          `Failed to fetch posts for category ${categoryName}:`,
          err
        );
        setError("Could not load posts for this category. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPostsByCategory();
  }, [categoryName]);

   if (loading) {
     return <div className="loading-message">Loading posts...</div>;
   }
   if (error) {
     return <div className="error-message">{error}</div>;
   }
  return (
    <div className="home-page">
      {/*Display a clear, dynamic heading to provide context to the user. */}
      <h1>Posts in: "{categoryName}"</h1>

      <div className="post-list">
        {/* If posts are found, map over them and render a PostListItem for each one.
             This is the power of component reuse! */}
        {posts.length > 0 ? (
          posts.map((post) => <PostListItem key={post._id} post={post} />)
        ) : (
          // If the array is empty, show a helpful message.
          <p>No posts found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

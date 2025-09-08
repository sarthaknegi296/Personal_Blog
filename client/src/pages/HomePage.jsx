import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import PostListItem from "../components/PostListItem";
import { Helmet } from "react-helmet-async";
import "../css/HomePage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiService.get(
          `/posts?page=${currentPage}&limit=10`
        );

        const { posts: fetchedPosts, totalPages: fetchedTotalPages } =
          response.data;

        setPosts(fetchedPosts);
        setTotalPages(fetchedTotalPages);
      } catch (error) {
        console.log("Error fetching posts:", error);
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handleNextPage = () => {
    // We only move to the next page if we're not already on the last page.
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  return (
    <div className="home-page">
      <Helmet>
        <title>My Awesome Blog - Latest Posts</title>
        <meta
          name="description"
          content="Welcome to My Awesome Blog. Read the latest articles on web development, technology, and more."
        />
      </Helmet>
      <h1>Latest Posts</h1>
      {/* Check if the posts array is empty. */}
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to create one!</p>
      ) : (
        // If there are posts, map over the array to create a list item for each post.
        // The 'key' prop is essential for React to efficiently update lists. It must be a unique string or number.
        // Here, the post's '_id' from MongoDB is a perfect unique key.
        <div className="post-list">
          {posts.map((post) => (
            <PostListItem key={post._id} post={post} />
          ))}
        </div>
      )}
      {totalPages > 0 && (
        <div className="pagination-controls">
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-buttons">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="btn"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

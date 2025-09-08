import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import apiService from "../services/apiService";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import CategoryTag from "../components/CategoryTag";
import "../markdown-styles.css";

const categoriesContainerStyle = {
  marginTop: "1rem",
  marginBottom: "1rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "1rem",
};

const PostPage = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.get(`/posts/slug/${slug}`);
        setPost(response.data);
      } catch (error) {
        console.log("Error fetching post:", error);

        if (error.response && error.response.status === 404) {
          setError("Post not found");
        } else {
          setError("Error fetching post");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const createMetaDescription = (markdown) => {
    if (!markdown) return "";
    // Remove Markdown formatting and trim to a suitable length (e.g., 155 chars).
    const plainText = markdown
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Keep link text
      .replace(/[`*#_~]/g, "") // Remove markdown characters
      .replace(/\s+/g, " "); // Normalize whitespace

    return plainText.substring(0, 155).trim() + "...";
  };

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    // We can render a more prominent error message
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        Error: {error}
      </div>
    );
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <article className="post-full">
      <Helmet>
        {/* We create a dynamic title using the post's title. */}
        <title>{`${post.title} | My Awesome Blog`}</title>
        {/* We create a dynamic meta description from the post's content. */}
        <meta
          name="description"
          content={createMetaDescription(post.markdownContent)}
        />
      </Helmet>

      <h1>{post.title}</h1>
      <div className="post-full-meta">
        <span>by {post.author}</span>
        <span>
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      {post.categories && post.categories.length > 0 && (
        <div style={categoriesContainerStyle}>
          {post.categories.map((category) => (
            <CategoryTag key={category} category={category} />
          ))}
        </div>
      )}
      <div className="post-full-content">
        <ReactMarkdown>{post.markdownContent}</ReactMarkdown>
      </div>
    </article>
  );
};

export default PostPage;

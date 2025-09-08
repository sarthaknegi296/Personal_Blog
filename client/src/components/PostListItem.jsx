import { Link } from "react-router-dom";
import CategoryTag from "./CategoryTag";


const categoriesContainerStyle = {
  marginTop: "10px",
};

const PostListItem = ({ post }) => {
  const snippet = post.markdownContent
                  .replace(/[#_*~`>]/g, "")
                  .substring(0, 150) + "...";
  return (
    <Link to={`/post/${post.slug}`} className="post-link">
      <article className="post-list-item">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span>by {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p>{snippet}</p>
        {post.categories && post.categories.length > 0 && (
          <div style={categoriesContainerStyle}>
            {/* 3. Map over the categories array. For each category string,
               render our reusable CategoryTag component.
               The category string itself makes a good unique 'key'. */}
            {post.categories.map((category) => (
              <CategoryTag key={category} category={category} />
            ))}
          </div>
        )}
      </article>
    </Link>
  );
};

export default PostListItem;

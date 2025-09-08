import "../css/CategoryTag.css"
import { useNavigate } from "react-router-dom";

const CategoryTag = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/category/${category}`);
  };

  return (
    <span onClick={handleClick} className="category-tag">
      {category}
    </span>
  );
}

export default CategoryTag;
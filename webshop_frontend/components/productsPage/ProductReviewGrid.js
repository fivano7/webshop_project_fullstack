import { useAuth } from "@/store/AuthContext";
import RatingStars from "./RatingStarts";

function ProductReviewGrid({ review, onDelete }) {
  const { userId, userRole } = useAuth();
  return (
    <div className="review-item">
      <h5>
        Rating <RatingStars rating={review.rating} />
      </h5>
      <h6>By {review.user.firstName}</h6>
      <p>{review.comment}</p>
      {(review.user._id === userId || userRole === "admin") && (
        <div>
          <button
            className="primary-button"
            onClick={() => onDelete(review._id)}
          >
            Delete Review
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductReviewGrid;

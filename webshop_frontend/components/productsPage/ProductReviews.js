import { useAuth } from "@/store/AuthContext";
import { sendAuthorizedClientRequest } from "@/utils/requestUtils";
import ProductReviewGrid from "./ProductReviewGrid";

const ProductReviews = ({ reviews, onReviewDeleted }) => {
  const { jwtToken } = useAuth();

  const handleDeleteReview = async (reviewId) => {
    try {
      await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews/${reviewId}`,
        "DELETE",
      );
      onReviewDeleted(reviewId);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="reviews-list">
      {reviews.length === 0 ? (
        <h6>No reviews yet for this product...</h6>
      ) : (
        reviews.map((review) => (
          <ProductReviewGrid
            key={review._id}
            review={review}
            onDelete={handleDeleteReview}
          />
        ))
      )}
    </div>
  );
};

export default ProductReviews;

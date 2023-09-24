import { useAuth } from "@/store/AuthContext";
import { sendAuthorizedClientRequest } from "@/utils/requestUtils";
import { useState } from "react";

function AddReview({ productId, onReviewAdded, reviews }) {
  const { isLoggedIn, jwtToken, userId } = useAuth();
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const userAlreadyReviewed = reviews.some(
    (review) => review.user._id === userId,
  );

  const handleReviewSubmit = async (e) => {
    setStatusMessage("");
    e.preventDefault();

    try {
      const response = await sendAuthorizedClientRequest(
        jwtToken,
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews`,
        "POST",
        { productId, rating, comment },
      );

      setRating(null);
      setComment("");
      onReviewAdded(response);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setStatusMessage("You already reviewed this product.");
        } else {
          setStatusMessage(error.response.data.error);
        }
      }
    }
  };

  return (
    <div className="write-review">
      {isLoggedIn ? (
        <div>
          {userAlreadyReviewed ? (
            <h4>You reviewed this product.</h4>
          ) : (
            <div>
              <h4>Write a Review</h4>
              {statusMessage && (
                <p className="status-message">{statusMessage}</p>
              )}
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <select
                    className="dropdown"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                  >
                    <option value="">Select Rating</option>
                    {Array.from({ length: 5 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <textarea
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                  />
                  <label>Comment (optional)</label>
                </div>

                <button className="primary-button" type="submit">
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <h4>Log in to write a review</h4>
      )}
    </div>
  );
}

export default AddReview;

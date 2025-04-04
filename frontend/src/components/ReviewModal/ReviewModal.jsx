import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";


function ReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (review.length < 10) {
      setErrors({ review: "Review must be at least 10 characters long." });
      return;
    }

    const response = await dispatch(createReview(spotId, { review, stars }));
    if (response.errors) {
      setErrors(response.errors);
    } else {
      closeModal();
    }
  };

  return (
    <form className="review-modal" onSubmit={handleSubmit}>
      <h2>How was your stay?</h2>
      {errors.server && <p className="error">{errors.server}</p>}
      <textarea
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        required
      />
      {errors.review && <p className="error">{errors.review}</p>}

      {/* Star Rating Component */}
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= stars ? "star selected" : "star"}
            onClick={() => setStars(Number(star))}
          >
            ★
          </span>
        ))}
      </div>
      {stars === 0 && <p className="error">Please select a star rating.</p>}

      <button type="submit" disabled={review.length < 10 || stars === 0}>
        Submit Your Review
      </button>
    </form>
  );
}

export default ReviewModal;

import { useDispatch } from "react-redux";
import { deleteReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    if (!reviewId || !spotId) {
      console.error("Missing reviewId or spotId");
      return;
    }

    await dispatch(deleteReview(spotId, reviewId)); // Ensure reviewId is passed here
    closeModal();
  };

  return (
    <div>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete this review?</p>
      <button className="confirm-delete" onClick={handleDelete}>
        Yes (Delete Review)
      </button>
      <button className="cancel-delete" onClick={closeModal}>
        No (Keep Review)
      </button>
    </div>
  );
}

export default DeleteReviewModal;

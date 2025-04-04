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

    await dispatch(deleteReview(spotId, reviewId));
    closeModal();
  };

  return (
    <div className="p-6 text-center">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Confirm Delete</h3>
      <p className="mb-8 text-gray-600">Are you sure you want to delete this review?</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors"
          onClick={handleDelete}
        >
          Yes (Delete Review)
        </button>
        <button 
          className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition-colors"
          onClick={closeModal}
        >
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
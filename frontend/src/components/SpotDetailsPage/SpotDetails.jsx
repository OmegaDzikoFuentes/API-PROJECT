import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpots, getSpotById } from "../../store/spots";
import { getReviews, deleteReview } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import "./SpotDetails.css";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const numericSpotId = Number(spotId);

  const spot = useSelector((state) => state.spots.byId[numericSpotId]);
  const reviews = useSelector((state) =>
    state.reviews[numericSpotId] ? state.reviews[numericSpotId] : []
  );
  const user = useSelector((state) => state.session.user);



  const reviewsCount = reviews.length;
  const averageRating =
    reviewsCount > 0
      ? (reviews.reduce((sum, review) => sum + review.stars, 0) / reviewsCount).toFixed(1)
      : null;

      const isOwner = user && spot?.ownerId === user.id;
  const hasReviewed = reviews.some((review) => review.userId === user?.id);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  useEffect(() => {
    if (!spot) {
      dispatch(getSpotById(numericSpotId));
    } else {
      dispatch(getReviews(numericSpotId));
    }
  }, [dispatch, numericSpotId, spot]);



  const confirmDeleteReview = async () => {
    await dispatch(deleteReview(numericSpotId, reviewToDelete));
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const cancelDeleteReview = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  if (!spot) return <p>Loading...</p>;

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  const defaultImage =
    "https://farm7.staticflickr.com/6089/6115759179_86316c08ff_z_d.jpg";

  return (
    <div className="spot-details-container">
      <h4 className="spot-name-label">{spot.name}</h4>
      <p className="location">{`${spot.city}, ${spot.state}, ${spot.country}`}</p>

      <div className="images-container">
  <img
    src={spot.previewImage || defaultImage}
    alt={spot.name}
    className="main-image"
  />
  <div className="small-images-grid">
    <img src={spot.SpotImages?.[1]?.url || defaultImage} alt="Spot image 1" />
    <img src={spot.SpotImages?.[2]?.url || defaultImage} alt="Spot image 2" />
    <img src={spot.SpotImages?.[3]?.url || defaultImage} alt="Spot image 3" />
    <img src={spot.SpotImages?.[4]?.url || defaultImage} alt="Spot image 4" />
  </div>
</div>
<div className="reserve-box">
        <div className="reserve-box-content">
          <p className="price">{`$${spot.price}  night`}</p>
          <div className="rating-info">
            <span>{`⭐ ${averageRating || "New"}`}</span>
            {reviewsCount !== undefined && (
              <span>· {`${reviewsCount} ${reviewsCount === 1 ? "review" : "reviews"}`}</span>
            )}
          </div>
        </div>
        <button className="reserve-button" onClick={handleReserveClick}>
          Reserve
        </button>
      </div>
      <div className="details-content">
        <div>
          <p className="hosted-by">{`Hosted by ${spot.Owner?.firstName}`}</p>
          <p>{spot.description}</p>
          <div className="reviews-section">
  <h3>
    {averageRating
      ? `⭐ ${averageRating} · ${reviewsCount} ${reviewsCount === 1 ? "review" : "reviews"}`
      : "New"}
  </h3>
  <div className="review-button">
    {user && !hasReviewed && !isOwner && (
      <OpenModalButton
        modalComponent={<ReviewModal spotId={numericSpotId} />}
        buttonText="Post Your Review"
      />
    )}
  </div>
  {reviewsCount === 0 ? (
    user && !isOwner ? (
      <p>Be the first to post a review!</p>
    ) : (
      <p>No reviews yet.</p>
    )
  ) : (
    <ul className="reviews-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-item">
          <div className="review-header">
            <p className="review-user-name">{review.User?.firstName}</p>
            <p className="review-date">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <p className="review-text">{review.review}</p>
          <p className="review-rating">Rating: {review.stars}⭐</p>
          {user?.id === review.userId && (
            <OpenModalButton
              modalComponent={
                <DeleteReviewModal
                  reviewId={review.id}
                  spotId={numericSpotId}
                />
              }
              buttonText="Delete Review"
            />
          )}
        </li>
      ))}
    </ul>
  )}
</div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="modal">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this review?</p>
          <button className="confirm-delete" onClick={confirmDeleteReview}>
            Yes (Delete Review)
          </button>
          <button className="cancel-delete" onClick={cancelDeleteReview}>
            No (Keep Review)
          </button>
        </div>
      )}
    </div>
  );
}

export default SpotDetails;

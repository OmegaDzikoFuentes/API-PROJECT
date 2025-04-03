import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getSpotById } from "../../store/spots";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import "./SpotDetails.css";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);



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
// Dispatch the action to fetch the spot details when the component mounts
dispatch(getSpotById(spotId))
.then(() => {
setLoading(false); // Set loading to false once the data is fetched
})
.catch((err) => {
console.error("Error fetching spot data:", err);
setLoading(false); // Set loading to false even on error
});
}, [dispatch, spotId]);

// If loading, display a loading message or spinner





  if (!spot) return <p>Loading...</p>;

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  const defaultImage =
    "https://images.pexels.com/photos/2294465/pexels-photo-2294465.jpeg";
    const defaultImage1 = "https://images.pexels.com/photos/14737628/pexels-photo-14737628.jpeg"
    const defaultImage2 = "https://images.pexels.com/photos/22598409/pexels-photo-22598409/free-photo-of-top-view-of-neatly-folded-towels-and-a-bathrobe.jpeg"
    const defaultImage3 = "https://images.pexels.com/photos/9318350/pexels-photo-9318350.jpeg"
    const defaultImage4 = "https://images.pexels.com/photos/19084143/pexels-photo-19084143/free-photo-of-view-of-a-modern-resort-with-a-swimming-pool-in-the-evening.jpeg"
    const imageVariants = {
      hover: { scale: 1.05, transition: { duration: 0.3 } }
    };
  
    if (loading) {
      return (
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading...</p>
        </div>
      );
    }
  
    if (!spot) return <p>Spot not found</p>;
  
    return (
      <motion.div
        className="spot-details-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="spot-name-label">{spot.name}</h1>
        <p className="location">{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
  
        <div className="images-container">
          <motion.img
            src={spot.previewImage || defaultImage}
            alt={spot.name}
            className="main-image"
            variants={imageVariants}
            whileHover="hover"
          />
          <div className="small-images-grid">
            {[defaultImage1, defaultImage2, defaultImage3, defaultImage4].map((img, index) => (
              <motion.img
                key={index}
                src={spot.SpotImages?.[index + 1]?.url || img}
                alt={`Spot image ${index + 1}`}
                variants={imageVariants}
                whileHover="hover"
              />
            ))}
          </div>
        </div>
  
        <div className="details-content">
          <div className="spot-info">
            <p className="hosted-by">
              {spot.Owner?.firstName && spot.Owner?.lastName
                ? `Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`
                : "Loading... please refresh"}
            </p>
            <p className="description">{spot.description}</p>
          </div>
  
          <motion.div
            className="reserve-box"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="reserve-box-content">
              <p className="price">{`$${spot.price} / night`}</p>
              <div className="rating-info">
                <span>{`⭐ ${averageRating || "New"}`}</span>
                {reviewsCount !== undefined && (
                  <span>· {`${reviewsCount} ${reviewsCount === 1 ? "review" : "reviews"}`}</span>
                )}
              </div>
            </div>
            <motion.button
              className="reserve-button"
              onClick={handleReserveClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reserve
            </motion.button>
          </motion.div>
        </div>
  
        <div className="reviews-section">
          <h2>
            {averageRating
              ? `⭐ ${averageRating} · ${reviewsCount} ${reviewsCount === 1 ? "review" : "reviews"}`
              : "New"}
          </h2>
          <div className="review-button">
            {user && !hasReviewed && !isOwner && (
              <OpenModalButton
                modalComponent={<ReviewModal spotId={numericSpotId} />}
                buttonText="Post Your Review"
              />
            )}
          </div>
          {reviewsCount === 0 ? (
            !isOwner ? (
              <p>Be the first to post a review!</p>
            ) : (
              <p>No reviews yet.</p>
            )
          ) : (
            <AnimatePresence>
              <motion.ul className="reviews-list">
                {reviews.map((review) => (
                  <motion.li
                    key={review.id}
                    className="review-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
  );
}

export default SpotDetails;

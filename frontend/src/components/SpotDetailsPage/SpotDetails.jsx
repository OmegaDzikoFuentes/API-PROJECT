import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getSpotById } from "../../store/spots";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";


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
    dispatch(getSpotById(spotId))
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching spot data:", err);
        setLoading(false);
      });
  }, [dispatch, spotId]);

  if (!spot) return <div className="text-center py-8">Loading...</div>;

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
      <div className="flex justify-center items-center h-screen">
        <motion.div
          className="w-16 h-16 border-4 border-dashed border-powder-blue rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="ml-4">Loading...</p>
      </div>
    );
  }

  if (!spot) return <p className="text-center py-8">Spot not found</p>;

  return (
    <motion.div
      className="container mx-auto p-4 pt-20" // Basic container with padding
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-2">{spot.name}</h1>
      <p className="text-gray-600 mb-4">{`${spot.city}, ${spot.state}, ${spot.country}`}</p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <motion.img
          src={spot.previewImage || defaultImage}
          alt={spot.name}
          className="md:w-1/2 h-auto object-cover rounded-md shadow-md" // Main image takes half width on medium screens and up
          variants={imageVariants}
          whileHover="hover"
        />
        <div className="md:w-1/2 grid grid-cols-2 grid-rows-2 gap-2"> {/* Grid for small images */}
          {[defaultImage1, defaultImage2, defaultImage3, defaultImage4].map((img, index) => (
            <motion.img
              key={index}
              src={spot.SpotImages?.[index + 1]?.url || img}
              alt={`Spot image ${index + 1}`}
              className="w-full h-full object-cover rounded-md shadow-md" // Each small image fills its grid cell
              variants={imageVariants}
              whileHover="hover"
            />
          ))}
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div className="spot-info">
          <p className="text-lg font-semibold mb-2">
            {spot.Owner?.firstName && spot.Owner?.lastName
              ? `Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`
              : "Loading... please refresh"}
          </p>
          <p className="text-gray-700">{spot.description}</p>
        </div>

        <motion.div
          className="bg-white rounded-md shadow-md p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl font-bold">{`$${spot.price}`}<span className="text-gray-600 font-normal"> / night</span></p>
            <div className="flex items-center text-yellow-500">
              <span>{`⭐ ${averageRating || "New"}`}</span>
              {reviewsCount !== undefined && (
                <span className="ml-2 text-gray-600">· {`${reviewsCount} ${reviewsCount === 1 ? "review" : "reviews"}`}</span>
              )}
            </div>
          </div>
          <motion.button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md w-full"
            onClick={handleReserveClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reserve
          </motion.button>
        </motion.div>
      </div>

      <div className="reviews-section mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          {averageRating
            ? `⭐ ${averageRating} · ${reviewsCount} ${reviewsCount === 1 ? "review" : "reviews"}`
            : "New"}
        </h2>
        <div className="mb-4">
          {user && !hasReviewed && !isOwner && (
            <OpenModalButton
              modalComponent={<ReviewModal spotId={numericSpotId} />}
              buttonText="Post Your Review"
            />
          )}
        </div>
        {reviewsCount === 0 ? (
          !isOwner ? (
            <p className="text-gray-700">Be the first to post a review!</p>
          ) : (
            <p className="text-gray-700">No reviews yet.</p>
          )
        ) : (
          <AnimatePresence>
            <motion.ul className="space-y-4">
              {reviews.map((review) => (
                <motion.li
                  key={review.id}
                  className="bg-white rounded-md shadow-md p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{review.User?.firstName}</p>
                    <p className="text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <p className="text-gray-700">{review.review}</p>
                  <p className="text-yellow-500">Rating: {review.stars}⭐</p>
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

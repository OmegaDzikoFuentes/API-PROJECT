import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { getReviews } from "../../store/reviews";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./SpotsList.css";

function SpotsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select spots and reviews from Redux state
  const spots = useSelector((state) =>
    state.spots.allIds.map((id) => state.spots.byId[id])
  );
  const reviews = useSelector((state) => state.reviews);



// Fetch spots and reviews on mount
useEffect(() => {
dispatch(getSpots());
dispatch(getReviews());
}, [dispatch]);

// Update loading state when both spots and reviews are available


// Memoize spotsWithRatings to optimize re-renders
// Memoize spotsWithRatings to optimize re-renders
const spotsWithRatings = useMemo(() => {
  const localRatings = JSON.parse(localStorage.getItem("ratings")) || [];
  return spots.map((spot) => {
      const spotReviews = reviews[spot.id] || [];
      const allRatings = [...spotReviews.map((r) => r.stars), ...localRatings];
      const reviewsCount = allRatings.length;
      const averageRating =
          reviewsCount > 0
              ? (allRatings.reduce((sum, rating) => sum + rating, 0) / reviewsCount).toFixed(1)
              : null; // Set to null if no reviews or ratings
      return { ...spot, averageRating };
  });
}, [spots, reviews]);



  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <motion.div
    className="spots-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {spotsWithRatings.map((spot, index) => (
      <SpotTile key={spot.id} spot={spot} index={index} onClick={handleTileClick} />
    ))}
  </motion.div>
);
}

function SpotTile({ spot, index, onClick }) {
const [ref, inView] = useInView({
  triggerOnce: true,
  threshold: 0.1,
});

return (
  <motion.div
    ref={ref}
    className="spot-tile"
    onClick={() => onClick(spot.id)}
    title={spot.name}
    initial={{ opacity: 0, y: 50 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <motion.img
      src={spot.previewImage || "https://farm7.staticflickr.com/6089/6115759179_86316c08ff_z_d.jpg"}
      alt={spot.name}
      className="spot-image"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    />
    <motion.div className="spot-info" layout>
      <motion.div className="spot-details" layout>
        <span>{`${spot.city}, ${spot.state}`}</span>
        <motion.span
          className="spot-rating"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
        >
          {Number(spot.avgRating) === 0 ? "New" : `⭐ ${spot.avgRating}`}
        </motion.span>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >{`$${spot.price} night`}</motion.p>
    </motion.div>
  </motion.div>
  );
}

export default SpotsList;

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { getReviews } from "../../store/reviews";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
      className="container mx-auto px-4 pt-20 pb-8" // Added padding-top for nav bar
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {spotsWithRatings.map((spot, index) => (
          <SpotTile key={spot.id} spot={spot} index={index} onClick={handleTileClick} />
        ))}
      </div>
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
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => onClick(spot.id)}
      title={spot.name}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <div className="relative pb-[100%]"> {/* Create a perfect square regardless of image size */}
        <motion.img
          src={spot.previewImage || "https://farm7.staticflickr.com/6089/6115759179_86316c08ff_z_d.jpg"}
          alt={spot.name}
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <motion.div className="p-4 flex flex-col gap-2" layout> {/* Padding and layout for text */}
        <motion.div className="flex justify-between items-center" layout> {/* City, State and Rating */}
          <span className="text-sm font-medium">{`${spot.city}, ${spot.state}`}</span>
          <motion.span
            className="flex items-center text-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          >
            {Number(spot.avgRating) === 0 ? "New" : `⭐ ${spot.avgRating}`}
          </motion.span>
        </motion.div>
        <motion.p
          className="text-sm font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >{`$${spot.price} night`}</motion.p>
      </motion.div>
    </motion.div>
  );
}

export default SpotsList;
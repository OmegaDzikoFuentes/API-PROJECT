import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { getReviews } from "../../store/reviews";
import { useNavigate } from "react-router-dom";
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
    <div className="spots-container">
      {spotsWithRatings.map((spot) => (
        <div
          key={spot.id}
          className="spot-tile"
          onClick={() => handleTileClick(spot.id)}
          title={spot.name}
        >
          <img
            src={
              spot.previewImage ||
              "https://farm7.staticflickr.com/6089/6115759179_86316c08ff_z_d.jpg"
            }
            alt={spot.name}
            className="spot-image"
          />
          <div className="spot-info">
            <div className="spot-details">
              <span>{`${spot.city}, ${spot.state}`}</span>
              <span className="spot-rating">
              {(Number(spot.avgRating) === 0) ? "New" : `⭐ ${spot.avgRating}`}
              </span>
            </div>
            <p>{`$${spot.price} night`}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpotsList;

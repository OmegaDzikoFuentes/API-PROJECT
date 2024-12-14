import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { getReviews } from "../../store/reviews"; // Ensure reviews are fetched
import { useNavigate } from "react-router-dom";
import "./SpotsList.css";

function SpotsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots.allIds.map((id) => state.spots.byId[id]));
  const reviews = useSelector((state) => state.reviews); // Reviews stored in the state
  const [spotsWithRatings, setSpotsWithRatings] = useState([]);

  // Fetch spots and reviews
  useEffect(() => {
    dispatch(getSpots());
    dispatch(getReviews()); // Fetch reviews for all spots
  }, [dispatch]);

  // Calculate average rating for each spot
  useEffect(() => {
    const updatedSpots = spots.map(spot => {
      const spotReviews = reviews[spot.id] || [];
      const reviewsCount = spotReviews.length;
      const averageRating =
        reviewsCount > 0
          ? (spotReviews.reduce((sum, review) => sum + review.stars, 0) / reviewsCount).toFixed(1)
          : null;
      return { ...spot, averageRating };
    });
    setSpotsWithRatings(updatedSpots);
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
          title={spot.name} // Tooltip with spot name
        >
          <img
            src={spot.previewImage || "https://farm7.staticflickr.com/6089/6115759179_86316c08ff_z_d.jpg"} // Fallback image if none provided
            alt={spot.name}
            className="spot-image"
          />
          <div className="spot-info">
            <div className="spot-details">
              <span>{`${spot.city}, ${spot.state}`}</span>
              <span className="spot-rating">
                   {spot.averageRating
                     ? `⭐ ${spot.averageRating}`
                          : "New"}
              </span>
            </div>
            <p>{`$${spot.price}  night`}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpotsList;

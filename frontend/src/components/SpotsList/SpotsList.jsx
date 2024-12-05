import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import "./SpotsList.css";

function SpotsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots || []);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="spots-container">
      {spots.map((spot) => (
        <div
          key={spot.id}
          className="spot-tile"
          onClick={() => handleTileClick(spot.id)}
          title={spot.name} // Tooltip with spot name
        >
          <img
            src={spot.previewImage || "../images/"} // Fallback image if none provided
            alt={spot.name}
            className="spot-image"
          />
          <div className="spot-info">
  <div className="spot-details">
    <span>{`${spot.city}, ${spot.state}`}</span>
    <span className="spot-rating">
      {spot.averageRating ? `⭐ ${spot.averageRating.toFixed(1)}` : "New"}
    </span>
  </div>
  <p>{`$${spot.price} / night`}</p>
</div>
        </div>
      ))}
    </div>
  );
}

export default SpotsList;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserSpots, deleteSpot } from "../../store/spots";
import "./SpotsList.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userSpots = useSelector((state) =>
    state.spots.byId
      ? Object.values(state.spots.byId).filter((spot) => spot.ownerId === state.session.user?.id)
      : []
  );

  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const handleDelete = (spotId) => {
    if (window.confirm("Are you sure you want to delete this spot?")) {
      dispatch(deleteSpot(spotId));
    }
  };

  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };
console.log('this is the userspot object.....kkkkkk', userSpots)
  return (
    <div className="manage-spots">
      <h1>Manage Spots</h1>
      {userSpots.length === 0 ? (
        <div className="no-spots">
          <p>You have not created any spots yet.</p>
          <button onClick={() => navigate("/spots/new")}>Create a New Spot</button>
        </div>
      ) : (
        <div className="spots-container">
          {userSpots.map((spot) => (
            <div
              key={spot.id}
              className="spot-tile"
              onClick={() => handleTileClick(spot.id)}
              title={spot.name}
            >
              <img
                src={spot.previewImage || "https://farm2.staticflickr.com/1533/26541536141_41abe98db3_z_d.jpg"}
                alt={spot.name}
                className="spot-image"
              />
              <div className="spot-info">
                <div className="spot-details">
                  <span>{`${spot.city}, ${spot.state}`}</span>
                  <span className="spot-rating">
                    {spot.avgRating ? `⭐ ${spot.avgRating}` : "New"}
                  </span>
                </div>
                <p>{`$${spot.price}  night`}</p>
                <div className="spot-actions">
                  <button onClick={(e) => { e.stopPropagation(); handleUpdate(spot.id); }}>Update</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(spot.id); }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageSpots;

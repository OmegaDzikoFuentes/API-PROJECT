import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserSpots, deleteSpot } from "../../store/spots";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

  

  return (
    <motion.div
      className="manage-spots"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Manage Spots</h1>
      {userSpots.length === 0 ? (
        <motion.div
          className="no-spots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>You have not created any spots yet.</p>
          <motion.button
            onClick={() => navigate("/spots/new")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create a New Spot
          </motion.button>
        </motion.div>
      ) : (
        <div className="spots-container">
          {userSpots.map((spot, index) => (
            <SpotTile
              key={spot.id}
              spot={spot}
              index={index}
              handleTileClick={handleTileClick}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function SpotTile({ spot, index, handleTileClick, handleUpdate, handleDelete }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="spot-tile"
      onClick={() => handleTileClick(spot.id)}
      title={spot.name}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.img
        src={
          spot.previewImage ||
          "https://farm2.staticflickr.com/1533/26541536141_41abe98db3_z_d.jpg"
        }
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
            animate={{ scale: inView ? 1 : 0 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 500 }}
          >
            {Number(spot.avgRating) === 0 ? "New" : `⭐ ${spot.avgRating}`}
          </motion.span>
        </motion.div>
        <motion.p>{`$${spot.price} night`}</motion.p>
        <div className="spot-actions">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate(spot.id);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Update
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(spot.id);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ManageSpots;
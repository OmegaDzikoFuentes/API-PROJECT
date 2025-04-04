import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserSpots, deleteSpot } from "../../store/spots";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
      className="container mx-auto px-4 pt-20 pb-8" // Added padding-top for nav bar
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Manage Spots</h1>
      {userSpots.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg mb-4">You have not created any spots yet.</p>
          <motion.button
            onClick={() => navigate("/spots/new")}
            className="bg-powder-blue hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create a New Spot
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div 
        className="cursor-pointer"
        onClick={() => handleTileClick(spot.id)}
      >
        <div className="relative pb-[100%]"> {/* Create a perfect square regardless of image size */}
          <motion.img
            src={
              spot.previewImage ||
              "https://farm2.staticflickr.com/1533/26541536141_41abe98db3_z_d.jpg"
            }
            alt={spot.name}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.div className="p-4 flex flex-col gap-2">
          <motion.div className="flex justify-between items-center">
            <span className="text-sm font-medium">{`${spot.city}, ${spot.state}`}</span>
            <motion.span
              className="text-sm"
              initial={{ scale: 0 }}
              animate={{ scale: inView ? 1 : 0 }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 500 }}
            >
              {Number(spot.avgRating) === 0 ? "New" : `⭐ ${spot.avgRating}`}
            </motion.span>
          </motion.div>
          <motion.p className="text-sm font-semibold">{`$${spot.price} night`}</motion.p>
        </motion.div>
      </div>
      <div className="mt-auto p-4 pt-0 flex gap-2">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate(spot.id);
          }}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Update
        </motion.button>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(spot.id);
          }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ManageSpots;
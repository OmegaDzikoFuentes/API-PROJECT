import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpots } from "../../store/spots";
import "./SpotDetails.css";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.find((s) => s.id === +spotId));
  const user = useSelector((state) => state.session.user); // Check if user is logged in

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch, spotId]);

  if (!spot) return <p>Loading...</p>;

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  return (
    <div className="spot-details-container">
      <h4>{spot.name}</h4>
      <p className="location">{`${spot.city}, ${spot.state}, ${spot.country}`}</p>

      <div className="images-container">
        <img
          src={spot.previewImage || "https://farm4.staticflickr.com/3852/14447103450_2d0ff8802b_z_d.jpg"}
          alt={spot.name}
          className="main-image"
        />
        <div className="small-images">
          {[spot.image1, spot.image2, spot.image3, spot.image4].map((img, idx) => (
            <img key={idx} src={img || "https://farm9.staticflickr.com/8295/8007075227_dc958c1fe6_z_d.jpg"} alt={`Spot ${idx + 1}`} />
          ))}
        </div>
      </div>

      <div className="details-content">
        <div>
          <p className="hosted-by">{`Hosted by ${spot.owner}`}</p>
          <p>{spot.description}</p>
          <div className="reviews-section">
            <h3>{spot.averageRating ? `⭐ ${spot.averageRating} · ${spot.reviewsCount} reviews` : "New"}</h3>
            {user && <button className="post-review-button">Post Your Review</button>}
          </div>
        </div>
        <div className="reserve-box">
          <p className="price">{`$${spot.price} / night`}</p>
          <button onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpots, getSpotById } from "../../store/spots";
import { getReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import "./SpotDetails.css";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();

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

       // Determine if the user is the owner
  const isOwner = user && spot?.ownerId === user.id;

  // Determine if the user has already reviewed the spot
  const hasReviewed = reviews.some((review) => review.userId === user?.id);

      useEffect(() => {
        dispatch(getSpots());
        dispatch(getReviews(numericSpotId));
      }, [dispatch, numericSpotId]);

      useEffect(() => {
        if (!spot) {
          dispatch(getSpotById(numericSpotId)); // Fetch specific spot if not in store
        } else {
          dispatch(getReviews(numericSpotId)); // Fetch reviews if spot is already available
        }
      }, [dispatch, numericSpotId, spot]);



console.log('why is this loooking wonky', spot);

  if (!spot) return <p>Loading...</p>;

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  const defaultImage =
    "https://farm7.staticflickr.com/6089/6115759179_86316c08ff_z_d.jpg";



  return (
    <div className="spot-details-container">
      <h4 className="spot-name-label">{spot.name}</h4>
      <p className="location">{`${spot.city}, ${spot.state}, ${spot.country}`}</p>

      <div className="images-container">
        <img
          src={spot.previewImage || defaultImage}
          alt={spot.name}
          className="main-image"
        />
          <div className="small-images">
          {[spot.image1, spot.image2, spot.image3, spot.image4].map((img, idx) => (
            <img key={idx} src={img || defaultImage} alt={`Spot ${idx + 1}`} />
          ))}
        </div>
      </div>

      <div className="details-content">
        <div>
          <p className="hosted-by">{`Hosted by ${spot.Owner}`}</p>
          <p>{spot.description}</p>
          <div className="reviews-section">
            <h3>
              {averageRating
                ? `⭐ ${averageRating} · ${reviewsCount} reviews`
                : "New"}
            </h3>
            <div className="review-button">
            {user && !isOwner && !hasReviewed && (
              <OpenModalButton
                className="review-button"
                modalComponent={<ReviewModal spotId={spotId} />}
                buttonText="Post Your Review"
              />
            )}
            </div>
            <ul className="reviews-list">
  {reviews.map((review) => (
    <ul key={review.id} className="review-item">
      <div className="review-header">
        <p className="review-user-name">{review.User.firstName}</p>
        <p className="review-date">
          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </p>
      </div>
      <p className="review-text">{review.review}</p>
      <p className="review-rating">Rating: {review.stars}⭐</p>
    </ul>
  ))}
</ul>

          </div>
        </div>
        <div className="reserve-box">
          <div className="reserve-box-content">
            <p className="price">{`$${spot.price} / night`}</p>
            <div className="rating-info">
              <span>{`⭐ ${averageRating || "New"}`}</span>
              {reviewsCount !== undefined && (
                <span>· {`${reviewsCount} reviews`}</span>
              )}
            </div>
          </div>
          <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;

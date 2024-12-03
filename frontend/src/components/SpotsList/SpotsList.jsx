import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import './SpotsList.css';


function SpotsList() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots || []);

    useEffect(() => {
        dispatch(getSpots());
    }, [dispatch]);

    return (
        <>
        <div className="spots-container">
            {spots.map((spot) => (
                <div key={spot.id} className="spot-tile">
                    {/* <img src={spot.previewImage} alt={`${spot.name}`} /> */}
                    <div className="spot-info">
                        <h3 title={spot.name}>{`${spot.city}, ${spot.state}`}</h3>
                        {/* <p>
                            {spot.averageRating ? `⭐️ ${spot.averageRating.toFixed(1)}` : 'New'}
                        </p> */}
                        <p>{`$${spot.price} night`}</p>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}


export default SpotsList;

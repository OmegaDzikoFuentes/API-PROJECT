import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateSpot, getUserSpots } from "../../store/spots";

function UpdateSpotForm() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector((state) => state.spots.byId[spotId]);

  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    name: '',
    description: '',
    price: '',
    previewImageUrl: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    lat: '',
    lng: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (spot) {
      setFormData({ ...spot });
    } else {
      dispatch(getUserSpots(spotId));
    }
  }, [dispatch, spot, spotId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description || formData.description.length < 30)
      newErrors.description = "Description needs 30 or more characters";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price is required and must be a positive number";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    const response = await dispatch(updateSpot({ ...formData, id: spotId }));
    if (response.errors) {
      setErrors(response.errors);
    } else {
      navigate(`/spots/${response.id}`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!spot) return <p>Loading...</p>;

  return (
    <form className="update-spot-form" onSubmit={handleSubmit}>
      <h1 className="update-spot-label">Update your Spot</h1>

      {/* Location Section */}
      <h2 className="location-question-label">Where&#39;s your place located?</h2>
      <p className="address-label">Guests will only get your exact address once they book a reservation.</p>
      {["country", "address", "city", "state"].map((field) => (
        <label key={field}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
          <input
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field}

          />
          {errors[field] && <p className="error">{errors[field]}</p>}
        </label>
      ))}

      {/* Latitude and Longitude Section */}
      <label>
        Latitude
        <input
          name="lat"
          type="number"
          step="any"
          value={formData.lat}
          onChange={handleChange}
          placeholder="Latitude"

        />
        {errors.lat && <p className="error">{errors.lat}</p>}
      </label>

      <label>
        Longitude
        <input
          name="lng"
          type="number"
          step="any"
          value={formData.lng}
          onChange={handleChange}
          placeholder="Longitude"

        />
        {errors.lng && <p className="error">{errors.lng}</p>}
      </label>

      {/* Description Section */}
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Please write at least 30 characters"

      />
      {errors.description && <p className="error">{errors.description}</p>}

      {/* Title Section */}
      <h2>Create a title for your spot</h2>
      <p>Catch guests&#39; attention with a spot title that highlights what makes your place special.</p>
      <label>
        Name of your spot
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name of your spot"

        />
        {errors.name && <p className="error">{errors.name}</p>}
      </label>

      {/* Price Section */}
      <h2>Set a base price for your spot</h2>
      <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
      <label>
        Price per night (USD)
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price per night (USD)"

        />
        {errors.price && <p className="error">{errors.price}</p>}
      </label>

      {/* Photos Section */}
      <h2>Liven up your spot with photos</h2>
      <p>Submit a link to at least one photo to publish your spot.</p>
      <label>
        Preview Image URL
        <input
          name="previewImageUrl"
          value={formData.previewImageUrl}
          onChange={handleChange}
          placeholder="Preview Image URL"

        />
        {errors.previewImageUrl && <p className="error">{errors.previewImageUrl}</p>}
      </label>

      {/* Additional Image URLs */}
      {[...Array(4)].map((_, index) => (
        <label key={`image${index + 1}`}>
          Image URL
          <input
            name={`image${index + 1}`}
            value={formData[`image${index + 1}`]}
            onChange={handleChange}
            placeholder="Image URL"
          />
        </label>
      ))}

      <button className="update-button" type="submit">Update your Spot</button>
    </form>
  );
}

export default UpdateSpotForm;

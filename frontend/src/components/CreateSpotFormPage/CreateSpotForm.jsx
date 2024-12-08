import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpot } from "../../store/spots";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const validate = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description || formData.description.length < 30)
      newErrors.description = "Description needs 30 or more characters";

    // Validate price as a number
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Price is required and must be a positive number";
    }

    // Validate lat and lng
    if (!formData.lat || isNaN(formData.lat) || formData.lat < -90 || formData.lat > 90) {
      newErrors.lat = "Latitude is required and must be between -90 and 90";
    }

    if (!formData.lng || isNaN(formData.lng) || formData.lng < -180 || formData.lng > 180) {
      newErrors.lng = "Longitude is required and must be between -180 and 180";
    }

    if (!formData.previewImageUrl || !/.(jpg|jpeg|png)$/.test(formData.previewImageUrl))
      newErrors.previewImageUrl = "Preview image is required and must end in .jpg, .jpeg, or .png";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    // Ensure price is a number and lat/lng are valid
    const formDataWithCoordinates = {
      ...formData,
      price: Number(formData.price), // Convert price to a number
      lat: formData.lat, // lat is required
      lng: formData.lng, // lng is required
    };
     
    const response = await dispatch(createSpot(formDataWithCoordinates));
    if (response.errors) {
      setErrors(response.errors);
    } else {
      navigate(`/spots/${response.id}`); // Redirect to the new spot's detail page
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a New Spot</h1>

      {/* Location Section */}
      <h2>Where&#39;s your place located?</h2>
      <p>Guests will only get your exact address once they booked a reservation.</p>
      {["country", "address", "city", "state"].map((field) => (
        <label key={field}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
          <input
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field}
            required
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
          required
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
          required
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
        required
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
          required
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
          required
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
          required
        />
        {errors.previewImageUrl && <p className="error">{errors.previewImageUrl}</p>}
      </label>
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

      {/* Submit Button */}
      <button type="submit">Create Spot</button>
    </form>
  );
}

export default CreateSpotForm;
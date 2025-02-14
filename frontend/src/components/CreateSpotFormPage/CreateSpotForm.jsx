import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpot } from "../../store/spots";
import "./CreateSpotForm.css";
import { motion, AnimatePresence } from "framer-motion";

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

    const spotData = { ...formData, price: Number(formData.price) };
    const imageUrls = [
      formData.previewImageUrl,
      formData.image1,
      formData.image2,
      formData.image3,
      formData.image4,
    ].filter(Boolean); // Remove empty URLs

    const response = await dispatch(createSpot(spotData, imageUrls));

    if (response.errors) {
      setErrors(response.errors);
    } else {
      navigate(`/spots/${response.id}`);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      className="create-spot-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        <motion.div className="form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2>Where's your place located?</h2>
          <p>Guests will only get your exact address once they booked a reservation.</p>
          {["country", "address", "city", "state"].map((field) => (
            <motion.div key={field} className="input-group" whileHover={{ scale: 1.02 }}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
              />
              <AnimatePresence>
                {errors[field] && (
                  <motion.p
                    className="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors[field]}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Latitude and Longitude Section */}
        <motion.div className="form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="input-group-inline">
            <motion.div className="input-group" whileHover={{ scale: 1.02 }}>
              <label htmlFor="lat">Latitude</label>
              <input
                id="lat"
                name="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Latitude"
              />
              <AnimatePresence>
                {errors.lat && (
                  <motion.p
                    className="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.lat}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="input-group" whileHover={{ scale: 1.02 }}>
              <label htmlFor="lng">Longitude</label>
              <input
                id="lng"
                name="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={handleChange}
                placeholder="Longitude"
              />
              <AnimatePresence>
                {errors.lng && (
                  <motion.p
                    className="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.lng}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Description Section */}
        <motion.div className="form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please write at least 30 characters"
            />
            <AnimatePresence>
              {errors.description && (
                <motion.p
                  className="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.description}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

           {/* Title Section */}
           <motion.div className="form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2>Create a title for your spot</h2>
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }}>
            <label htmlFor="name">Name of your spot</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name of your spot"
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  className="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Price Section */}
        <motion.div className="form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }}>
            <label htmlFor="price">Price per night (USD)</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price per night (USD)"
            />
            <AnimatePresence>
              {errors.price && (
                <motion.p
                  className="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.price}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

         {/* Photos Section */}
         <motion.div className="form-section" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }}>
            <label htmlFor="previewImageUrl">Preview Image URL</label>
            <input
              id="previewImageUrl"
              name="previewImageUrl"
              value={formData.previewImageUrl}
              onChange={handleChange}
              placeholder="Preview Image URL"
            />
            <AnimatePresence>
              {errors.previewImageUrl && (
                <motion.p
                  className="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.previewImageUrl}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

           {[...Array(4)].map((_, index) => (
            <motion.div key={`image${index + 1}`} className="input-group" whileHover={{ scale: 1.02 }}>
              <label htmlFor={`image${index + 1}`}>Image URL</label>
              <input
                id={`image${index + 1}`}
                name={`image${index + 1}`}
                value={formData[`image${index + 1}`]}
                onChange={handleChange}
                placeholder="Image URL"
              />
            </motion.div>
          ))}
        </motion.div>


        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Spot
        </motion.button>
      </form>
    </motion.div>
  );
}

export default CreateSpotForm;
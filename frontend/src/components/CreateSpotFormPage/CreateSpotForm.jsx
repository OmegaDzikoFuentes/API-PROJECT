import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpot } from "../../store/spots";

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
      className="container mx-auto p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create a New Spot</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <motion.div className="bg-white rounded-md shadow-md p-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Where&apos;s your place located?</h2>
          <p className="text-gray-600 mb-4">Guests will only get your exact address once they booked a reservation.</p>
          {["country", "address", "city", "state"].map((field) => (
            <motion.div key={field} className="mb-4" whileHover={{ scale: 1.02 }}>
              <label htmlFor={field} className="block text-gray-700 text-sm font-bold mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <AnimatePresence>
                {errors[field] && (
                  <motion.p
                    className="text-red-500 text-xs italic mt-1"
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
        <motion.div className="bg-white rounded-md shadow-md p-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Latitude and Longitude</h2>
          <div className="flex gap-4 mb-4">
            <motion.div className="w-1/2" whileHover={{ scale: 1.02 }}>
              <label htmlFor="lat" className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
              <input
                id="lat"
                name="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Latitude"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <AnimatePresence>
                {errors.lat && (
                  <motion.p
                    className="text-red-500 text-xs italic mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.lat}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="w-1/2" whileHover={{ scale: 1.02 }}>
              <label htmlFor="lng" className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
              <input
                id="lng"
                name="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={handleChange}
                placeholder="Longitude"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <AnimatePresence>
                {errors.lng && (
                  <motion.p
                    className="text-red-500 text-xs italic mt-1"
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
        <motion.div className="bg-white rounded-md shadow-md p-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Describe your place to guests</h2>
          <p className="text-gray-600 mb-4">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <motion.div className="mb-4" whileHover={{ scale: 1.02 }}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please write at least 30 characters"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            />
            <AnimatePresence>
              {errors.description && (
                <motion.p
                  className="text-red-500 text-xs italic mt-1"
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
        <motion.div className="bg-white rounded-md shadow-md p-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Create a title for your spot</h2>
          <p className="text-gray-600 mb-4">Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
          <motion.div className="mb-4" whileHover={{ scale: 1.02 }}>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name of your spot</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name of your spot"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  className="text-red-500 text-xs italic mt-1"
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
        <motion.div className="bg-white rounded-md shadow-md p-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Set a base price for your spot</h2>
          <p className="text-gray-600 mb-4">Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <motion.div className="mb-4" whileHover={{ scale: 1.02 }}>
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price per night (USD)</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price per night (USD)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <AnimatePresence>
              {errors.price && (
                <motion.p
                  className="text-red-500 text-xs italic mt-1"
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
        <motion.div className="bg-white rounded-md shadow-md p-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Liven up your spot with photos</h2>
          <p className="text-gray-600 mb-4">Submit a link to at least one photo to publish your spot.</p>
          <motion.div className="mb-4" whileHover={{ scale: 1.02 }}>
            <label htmlFor="previewImageUrl" className="block text-gray-700 text-sm font-bold mb-2">Preview Image URL</label>
            <input
              id="previewImageUrl"
              name="previewImageUrl"
              value={formData.previewImageUrl}
              onChange={handleChange}
              placeholder="Preview Image URL"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <AnimatePresence>
              {errors.previewImageUrl && (
                <motion.p
                  className="text-red-500 text-xs italic mt-1"
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
            <motion.div key={`image${index + 1}`} className="mb-4" whileHover={{ scale: 1.02 }}>
              <label htmlFor={`image${index + 1}`} className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
              <input
                id={`image${index + 1}`}
                name={`image${index + 1}`}
                value={formData[`image${index + 1}`]}
                onChange={handleChange}
                placeholder="Image URL"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          type="submit"
          className="bg-powder-blue hover:bg-blue-300 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
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
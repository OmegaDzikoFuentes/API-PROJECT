// routes/api/reviews.js
const express = require('express');
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');  // Middleware for authentication
const router = express.Router();

// GET /api/reviews/current
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;  // The current authenticated user

  // Find all reviews created by the current user
  const reviews = await Review.findAll({
    where: { userId: user.id },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: [
          {
            model: SpotImage,
            attributes: ['url'],
            where: { preview: true },  // Assuming you have a 'preview' attribute to filter for the preview image
            required: false  // Allow spots without preview images to be included
          }
        ]
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });

  // Format the response
  res.json({ Reviews: reviews });
});

module.exports = router;

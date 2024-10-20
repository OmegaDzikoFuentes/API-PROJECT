// routes/api/reviews.js
const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
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

// POST /reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    try {

      const review = await Review.findByPk(reviewId);

      //when there is no matching review
      if (!review) {

        return res.status(404).json({ message: "No Matching Review Found" });
      }

      // make sure review and user match
      if (review.userId !== userId) {

        return res.status(403).json({ message: "This Revie Does Not Belong to You" });
      }

      // Setting max
      const imageCount = await ReviewImage.count({ where: { reviewId } });

   // Max 5 images
      if (imageCount >= 5) {

        return res.status(403).json({ message: "Maximum number of images reached" });
      }

      // add new image
      const newImage = await ReviewImage.create({
        reviewId,
        url,
      });

      //  Return created image data
      return res.status(201).json({
        id: newImage.id,
        url: newImage.url,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;

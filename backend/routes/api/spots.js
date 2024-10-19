const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, Booking, SpotImage, User, Review } = require('../../db/models');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();

// Validation middleware for creating a new spot
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Address is required.'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required.'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required.'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required.'),
  check('lat')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Latitude is required.')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90.'),
  check('lng')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Longitude is required.')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180.'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Name is required.'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required.'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Price is required.'),
  handleValidationErrors
];


// POST /api/spots - Create a new spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const ownerId = req.user.id; // Use the authenticated user's id

  try {
    const newSpot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    return res.status(201).json(newSpot);
  } catch (err) {
    next(err);
  }
});

// Validation middleware for the booking dates
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date is required.')
    .isISO8601()
    .withMessage('Please provide a valid start date.'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is required.')
    .isISO8601()
    .withMessage('Please provide a valid end date.'),
  (req, res, next) => {
    const { startDate, endDate } = req.body;

    // Check if endDate is after startDate
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        errors: [
          {
            msg: 'End date must be after start date.',
            param: 'endDate',
            location: 'body',
          },
        ],
      });
    }

    // Check if start date or end date is in the past
    const currentDate = new Date();
    if (new Date(startDate) < currentDate || new Date(endDate) < currentDate) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Dates cannot be in the past.',
            param: 'startDate',
            location: 'body',
          },
        ],
      });
    }
    next();
  },
];

// POST /api/spots/:spotId/bookings - Create a new booking
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const userId = req.user.id;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
        statusCode: 404
      });
    }

    // Check if the user owns the spot
    if (spot.ownerId === userId) {
      return res.status(403).json({
        message: 'You cannot book your own spot',
        statusCode: 403
      });
    }

    // Find existing bookings for the spot
    const existingBookings = await Booking.findAll({
      where: { spotId }
    });

    // Check for booking conflicts
    for (let booking of existingBookings) {
      const existingStartDate = new Date(booking.startDate);
      const existingEndDate = new Date(booking.endDate);

      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);

      // Check for any overlap or conflict
      if (
        (newStartDate >= existingStartDate && newStartDate <= existingEndDate) || // Start date overlaps existing booking
        (newEndDate >= existingStartDate && newEndDate <= existingEndDate) ||     // End date overlaps existing booking
        (newStartDate <= existingStartDate && newEndDate >= existingEndDate)      // Booking encompasses an existing booking
      ) {
        return res.status(403).json({
          message: 'Booking conflicts with an existing booking',
          statusCode: 403
        });
      }
    }

    // Create the new booking
    const newBooking = await Booking.create({
      userId,
      spotId,
      startDate,
      endDate
    });

    return res.status(201).json(newBooking);

  } catch (err) {
    next(err);
  }
});

// GET /api/spots/current - Returns all spots owned by the current user
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    const spots = await Spot.findAll({
      where: {
        ownerId: user.id,
      },
      include: [
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview'],
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    return res.json(spots);
  } catch (err) {
    next(err);
  }
});


// GET /api/spots/:spotId - Returns details of a spot specified by its ID
router.get('/:spotId', async (req, res, next) => {
  const { spotId } = req.params;

  try {
    // Find the spot by its ID
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview'],
        },
      ],
    });

    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
      });
    }

    // Get the number of reviews and average star rating
    const numReviews = await Review.count({
      where: { spotId: spot.id },
    });
    const avgStarRating = await Review.findOne({
      where: { spotId: spot.id },
      attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStarRating']],
    });

    // response
    res.json({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: numReviews,
      avgStarRating: parseFloat(avgStarRating?.dataValues.avgStarRating || 0).toFixed(2),
      SpotImages: spot.SpotImages.map(image => ({
        id: image.id,
        url: image.url,
        preview: image.preview,
      })),
      User: {
          id: spot.User.id,
          firstName: spot.User.firstName,
          lastName: spot.User.lastName,
        },
    });
  } catch (err) {
    next(err);
  }
});


// GET /api/spots/:spotId/bookings - Returns all bookings for a specified spot
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { user } = req; // authenticated user

  try {
    // does spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
      });
    }

    // get bookings for the specified spot
    const bookings = await Booking.findAll({
      where: { spotId },
      include: user.id === spot.ownerId ? [{
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      }] : [], // Include User only if the authenticated user is owner
    });

    // Map bookings
    const response = bookings.map(booking => {
      if (user.id === spot.ownerId) {
        return {
          id: booking.id,
          spotId: booking.spotId,
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          User: {
            id: booking.User.id,
            firstName: booking.User.firstName,
            lastName: booking.User.lastName,
          },
        };
      } else {
        return {
          spotId: booking.spotId,
          startDate: booking.startDate,
          endDate: booking.endDate,
        };
      }
    });

    return res.json(response);
  } catch (err) {
    next(err);
  }
});

// PUT /api/spots/:spotId - Updates an existing spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
  const { spotId } = req.params;
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  try {
    // Check spot exist
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
      });
    }

    // Check if user is owner
    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: 'Unauthorized: You are not the owner of this spot',
      });
    }

    // new data
    await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    // Return the updated spot data
    return res.json({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});



// DELETE /api/spots/:spotId - Deletes an existing spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { user } = req;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found'
      });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: 'Unauthorized: You are not the owner of this spot'
      });
    }

    await spot.destroy();

    return res.status(200).json({
      message: 'Spot successfully deleted'
    });

  } catch (err) {
    next(err);
  }
});


module.exports = router;

// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const reviewsRouter = require('./reviews');
const spotImagesRouter = require('./spot-images');
const reviewImagesRouter = require('./review-images');

const { restoreUser } = require("../../utils/auth.js");
const spotsRouter = require('./spots');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);


router.use('/review-images', reviewImagesRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/reviews', reviewsRouter);

router.use('/spots', spotsRouter);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

// Keep this route to test frontend setup in Mod 5
router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
  });


module.exports = router;

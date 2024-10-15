const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .isLength({ min: 2 })
      .withMessage('Please provide a valid first name.'),
    check('lastName')
      .exists({ checkFalsy: true })
      .isLength({ min: 2 })
      .withMessage('Please provide a valid last name.'),
    handleValidationErrors,
  ];

// Sign up - POST /api/users
router.post('/', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password);

  // Create new user
  try {
    const user = await User.create({
      email,
      username,
      firstName,  // Include firstName
      lastName,   // Include lastName
      hashedPassword,
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName, // Include firstName
      lastName: user.lastName,   // Include lastName
      email: user.email,
      username: user.username,
    };

    // Set token cookie
    await setTokenCookie(res, safeUser);

    return res.json({ user: safeUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

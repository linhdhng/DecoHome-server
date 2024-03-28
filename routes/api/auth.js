const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator')
const User = require('../../models/Users');

// @route:   GET api/auth
// @desc:    Get User Data
// @access:  Private


router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route:   POST api/users
// @desc:    Log in and authenticate user
// @access: Public
router.post(
  '/',
  [
    check('email', 'Please inclue a valide email').isEmail(),
    check('password', 'Password required').exists(),
  ],
  async (req, res) => {
    //Check if are valididation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;

    try {
      //Create instance of user
      let user = await User.findOne({ email });
      //Check if user already exists
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      //Create a JWT
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
      };

      const token = jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
        res.json({token})
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../../models/Users");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res.status(400).json({ message: "No users found." });
    }
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route:   POST api/users
// @desc:    Reqgister User and Get JWT
// @access:
router.post("/",
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please inclue a valide email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 characters or more'
    ).isLength({ min: 6 }),
  ], async (req, res) => {
      //Check if are valididation errors
      const errors = validationResult(req)
  
      if(!errors.isEmpty()){
          return res.status(400).json({ errors: errors.array() })
      }
  
      // To test information being sent
      // return res.send(req.body)
  
      const { name, email, password} = req.body;
  
      
      try {
          //Create instance of user
          let user = await User.findOne({ email })
          //Check if user already exists
          if(user) {
              return res.status(400).json([{msg: 'User already exists'}])
          }
  
          user = new User({
              name,
              email,
              password
          })
    //Encrpyt PW
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);
    //Save User
    await user.save();

    //Create a JWT
    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Cannot find User" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

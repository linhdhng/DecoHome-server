// const User = require("../models/Users");
// const bcrypt = require("bcrypt");
// const { validationResult } = require("express-validator");

// // @route:   GET api/users
// // @desc:    Test users route
// // @access:  Public
// const gettAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     if (!users) {
//       return res.status(400).json({ message: "No users found." });
//     }
//     res.json(users);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };

// // @route:   CREATE api/users
// // @desc:    Test users route
// // @access:  Public
// const createNewUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { name, email, password, role } = req.body;

//   try {
//     //Check if user already exists
//     const duplicate = await User.findOne({ email }).lean();
//     if (duplicate) {
//       return res.status(400).json({ message: "User already exists. " });
//     }

//     const hashedPwd = await bcrypt.hash(password, 10);

//     const userObject = { name, email, password: hashedPwd, role };

//     //Create and store new user
//     const user = await User.create(userObject);
//     if (user) {
//       // If user is created
//       res
//         .status(201)
//         .json({ message: `Account for ${name} has been created!` });
//     } else {
//       res.status(400).json({ message: "Invalid user data." });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports = { gettAllUsers, createNewUser };

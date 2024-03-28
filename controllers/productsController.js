// const Product = require('../models/Products')
// const { validationResult } = require('express-validator');
 
// // @route:   GET api/products
// // @desc:    Test users route
// // @access:  Public
// const gettAllProducts = async(req, res) => {
//     try {
//         const products = await Product.find()
//         if (!products) {
//             return res.status(400).json({ message: 'No users found.' })
//         }
//         res.json(products);
//       } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//       }
// }

// // @route:   CREATE api/products
// // @desc:    Test users route
// // @access:  Public
// const createNewProduct = async(req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//     const { title, description, category, price } = req.body;
//     try {
//         //Check if product already exists
//         const duplicate = await Product.findOne({ title }).lean()
//         if (duplicate) {
//             return res.status(400).json({ message: 'Product already exists. '})
//         }

//         const productObject = { title, description, category, price }

//         //Create and store new product
//         const product = await Product.create(productObject)
//         if (product) { // If user is created
//             res.status(201).json({ message: `Product ${title} has been created!` })
//         } else {
//             res.status(400).json({ message: 'Invalid user data.' })
//         }
//     } catch (err) {
//         console.error(err.message)
//         res.status(500).send('Server Error')
//     }
// }

// // @desc Update a note
// // @route PATCH /notes
// // @access Private
// const updateProduct = async (req, res) => {
//     const id = req.params.id;
//     UserModel.findByIdAndUpdate({_id: id}, {
//         title: req.body.title,
//         image: req.body.image,
//         description: req.body.description,
//         category: req.body.category,
//         material: req.body.material,
//         price: req.body.price
//     }).then(product => res.json(product))
//     .catch(err => res.json(err))

// }
// module.exports = { gettAllProducts, createNewProduct, updateProduct }

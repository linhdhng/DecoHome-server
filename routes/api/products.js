const express = require("express");
const router = express.Router();
const Product = require("../../models/Products");
const User = require("../../models/Users")
const { validationResult } = require("express-validator");

// @route:   GET api/products
// @desc:    Test users route
// @access:  Public

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(400).json({ message: "No users found." });
    }
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route:   CREATE api/products
// @desc:    Test users route
// @access:  Public
router.post("/", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, category, price } = req.body;
  try {
    //Check if product already exists
    const duplicate = await Product.findOne({ title }).lean();
    if (duplicate) {
      return res.status(400).json({ message: "Product already exists. " });
    }

    const productObject = { title, description, category, price };

    //Create and store new product
    const product = await Product.create(productObject);
    if (product) {
      // If user is created
      res.status(201).json({ message: `Product ${title} has been created!` });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
      const product = await Product.findOne({ _id: productId});
      if (product) {
          res.json(product);
      } else {
          res.status(404).json({ message: 'Product not found' });
      }
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:productId', async(req, res) => {
  const productId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  const updatedMaterial = req.body.material;

    try {
        const result = await Product.findOneAndUpdate(
          { _id: productId },
          { $set: {title: updatedTitle, description: updatedDescription, price: updatedPrice, material: updatedMaterial }},
          { new: true}
        );
        if (result == null) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.json({ message: 'Product updated successfully' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete("/:productId", async (req, res) => {
  const productId = req.params.productId;
  console.log('Product ID to be deleted:', productId)
    try {
        const result = await Product.deleteOne({ _id: productId });
        console.log('Delete result:', result);
        if (result.deletedCount > 0) {
          res.json({ message: 'Product deleted successfully' });
          
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Add item to user's list
router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, material, category, price } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new item
    const newItem = new Product({ title, description, material, category, price });
    await newItem.save();

    // Add the item to the user's list
    user.items.push(newItem);
    await user.save();

    res.status(201).json({ message: 'Item added to list', item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's list
router.get('/:userId/list', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID and populate the items
    const user = await User.findById(userId).populate('items');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

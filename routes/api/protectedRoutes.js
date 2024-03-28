const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Protected route
router.get('/protected', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware'); // ✅ exact path
const User = require('../models/user.model');
const Product = require('../models/product.model');

// ✅ Get user's favorites
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

// ✅ Toggle favorite
router.post('/:productId', protect, async (req, res) => {
  const productId = req.params.productId;

  try {
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(productId)) {
      user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
    } else {
      user.favorites.push(productId);
    }

    await user.save();
    await user.populate('favorites');

    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Error toggling favorite:", err);
    res.status(500).json({ message: 'Failed to update favorites' });
  }
});

module.exports = router;

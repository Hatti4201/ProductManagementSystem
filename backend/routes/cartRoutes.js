const express = require('express');
const router = express.Router();
const {
    getCart,
    addOrUpdateItem,
    removeItem,
    applyPromoCode,
    mergeCart,
} = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

router.get('/',auth, getCart);
router.post('/item', auth, addOrUpdateItem);
router.delete('/item/:productId', auth, removeItem);
router.post('/promo', auth, applyPromoCode);
router.post('/merge', auth, mergeCart);

module.exports = router;

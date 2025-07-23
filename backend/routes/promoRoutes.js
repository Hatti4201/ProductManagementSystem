const express = require('express');
const router = express.Router();
const { validatePromoCode } = require('../controllers/promoController');

router.get('/:code', validatePromoCode);

module.exports = router;

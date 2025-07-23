const PromotionCode = require('../models/PromotionCode');

exports.validatePromoCode = async (req, res) => {
  const { code } = req.params;

  try {
    const promo = await PromotionCode.findOne({ code });

    if (!promo) {
      return res.status(404).json({ valid: false, message: 'Code not found' });
    }

    if (new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Code expired' });
    }

    res.json({
      valid: true,
      discountType: promo.discountType,
      value: promo.value,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

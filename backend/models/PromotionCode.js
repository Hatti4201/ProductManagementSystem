const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['amount', 'percent'], required: true },
  value: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('PromotionCode', promoSchema);

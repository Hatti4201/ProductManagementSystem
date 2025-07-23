const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PromotionCode = require('../models/PromotionCode');

exports.createOrder = async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // 计算总价
  let total = 0;
  cart.items.forEach((item) => {
    total += item.productId.price * item.quantity;
  });

  if (cart.promotionCode) {
    const promo = await PromotionCode.findOne({ code: cart.promotionCode });
    if (promo && promo.expiresAt > new Date()) {
      if (promo.discountType === 'percent') {
        total *= (1 - promo.value / 100);
      } else {
        total -= promo.value;
      }
    }
  }

  const order = await Order.create({
    userId,
    items: cart.items.map((i) => ({
      productId: i.productId._id,
      quantity: i.quantity,
    })),
    promotionCode: cart.promotionCode || '',
    totalAmount: Math.max(0, total.toFixed(2)),
  });

  // 清空购物车
  cart.items = [];
  cart.promotionCode = '';
  await cart.save();

  res.status(201).json({ message: 'Order created', order });
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate('items.productId');
  res.json(orders);
};

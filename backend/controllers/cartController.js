const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// 获取当前用户的购物车
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    return res.json(cart || { items: [], promotionCode: '' });
  } catch (err) {
    console.error('getCart error =>', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 添加或更新购物车商品
exports.addOrUpdateItem = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    const userId = req.user.id;

    console.log('💡 原始 productId:', productId);
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    productId = new mongoose.Types.ObjectId(productId);
    console.log('✅ 转换后的 productId:', productId);

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // 检查商品是否已存在于购物车中
    const existing = cart.items.find((i) =>
      i.productId.equals(productId)
    );

    if (existing) {
      console.log('🟡 商品已存在，增加数量');
      existing.quantity = quantity;
    } else {
      console.log('🆕 添加新商品');
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('🧾 updatedCart:', updatedCart);
    return res.json(updatedCart);
  } catch (err) {
    console.error('addOrUpdateItem error =>', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 删除购物车中的商品
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    console.error('removeItem success:', cart.items);
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    return res.json(updatedCart);
  } catch (err) {
    console.error('removeItem error =>', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 应用优惠码
exports.applyPromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.promotionCode = code;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    return res.json(updatedCart);
  } catch (err) {
    console.error('applyPromoCode error =>', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 合并本地购物车与服务器端购物车
exports.mergeCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const localItems = req.body.items || [];

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const mergeMap = new Map();
    cart.items.forEach(item => {
      if (item?.productId?.toString) {
        mergeMap.set(item.productId.toString(), item.quantity);
      }
    });

    localItems.forEach(({ productId, quantity }) => {
      if (mergeMap.has(productId)) {
        mergeMap.set(productId, mergeMap.get(productId) + quantity);
      } else {
        mergeMap.set(productId, quantity);
      }
    });

    cart.items = Array.from(mergeMap.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    await cart.save();
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('🧾 updatedCart:', updatedCart);
    res.json(updatedCart);
  } catch (err) {
    console.error('Merge cart failed:', err);
    res.status(500).json({ message: 'Cart merge failed', error: err.message });
  }
};

import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateQuantityLocal,
  removeFromCartLocal,
  fetchCartFromServer,
  addOrUpdateCartItem,
  removeCartItem,
  applyPromoCodeToCart,
  checkoutOrder,
} from '../store/slices/cartSlice';
import { checkPromoCode } from '../api/promo';
import debounce from 'lodash.debounce';

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [promoCode, setPromoCode] = useState('');
  const [promoInfo, setPromoInfo] = useState(null);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // 初始加载购物车（仅登录用户）
  useEffect(() => {
    if (user) {
      dispatch(fetchCartFromServer());
    }
  }, [user]);

  // 防抖函数：修改服务器购物车商品数量
  const debouncedUpdate = useCallback(
    debounce((productId, qty) => {
      dispatch(addOrUpdateCartItem({ productId, quantity: qty }));
    }, 400),
    [dispatch]
  );

  // 应用优惠码
  const handleApplyPromo = async () => {
    try {
      const data = await checkPromoCode(promoCode.trim());
      if (data.valid) {
        setPromoInfo(data);
        setError('');
        if (user) {
          dispatch(applyPromoCodeToCart(promoCode.trim()));
        }
      } else {
        setPromoInfo(null);
        setError(data.message || 'Invalid code');
      }
    } catch (err) {
      setPromoInfo(null);
      setError(err.response?.data?.message || 'Error validating code');
    }
  };

  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = promoInfo
    ? promoInfo.discountType === 'percent'
      ? totalBeforeDiscount * (1 - promoInfo.value / 100)
      : totalBeforeDiscount - promoInfo.value
    : totalBeforeDiscount;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Your Cart</h2>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map((item) => (
        <div
          key={item._id}
          style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}
        >
          <h4>{item.name}</h4>
          <p>${item.price} × {item.quantity}</p>

          {/* 数量输入框 */}
            {/* 如果用户已登录，则更新服务器购物车；否则更新本地状态 */}
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => {
              const qty = Number(e.target.value);
              if (user) {
                debouncedUpdate(item._id, qty);
              } else {
                dispatch(updateQuantityLocal({ id: item._id, quantity: qty }));
              }
            }}
          />

          {/*  删除商品按钮 */}
          <button
            onClick={() => {
              const pid = item.productId?._id || item._id;
              console.log('🧹 Remove productId =', pid);
              if (user) {
                console.log('Removing item from server cart page', pid);
                dispatch(removeCartItem({ productId: pid }));
              } else {
                dispatch(removeFromCartLocal(item._id ));
              }
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <hr />

      <div>
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button onClick={handleApplyPromo}>Apply</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {promoInfo && (
          <p style={{ color: 'green' }}>
            {promoInfo.discountType === 'percent'
              ? `Discount: ${promoInfo.value}%`
              : `Discount: $${promoInfo.value}`}
          </p>
        )}
      </div>

      <h3>Total: ${total.toFixed(2)}</h3>
      {user && cart.length > 0 && (
        <button onClick={() => dispatch(checkoutOrder())}>Checkout</button>
      )}
    </div>
  );
}

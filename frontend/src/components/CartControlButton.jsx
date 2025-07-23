import { useDispatch, useSelector } from 'react-redux';
import { addToCartLocal, addOrUpdateCartItem, addOrUpdateCartItemLocal } from '../store/slices/cartSlice';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function CartControlButton({ product, mode = 'default' }) {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.items);

  const existingItem = cartItems.find((i) => i._id === product._id);
  const quantity = existingItem?.quantity || 0;

  // 用于本地控制输入框显示的值
  const [inputVal, setInputVal] = useState(quantity);

  // 每当购物车中数量发生变化时，更新 inputVal（例如点 + / -）
  useEffect(() => {
    setInputVal(quantity);
  }, [quantity]);

  const handleChange = (val) => {
    const safeVal = Math.max(0, Number(val));
    if (user) {
      dispatch(addOrUpdateCartItem({ productId: product._id, quantity: safeVal }));
    } else {
      dispatch(addOrUpdateCartItemLocal({ ...product, quantity: safeVal }));
    }  
  };

  // 没加入购物车：显示按钮
  if (quantity === 0) {
    return (
      <button
        onClick={() => {
          if (user) {
            dispatch(addOrUpdateCartItem({ productId: product._id, quantity: 1 }));
          } else {
            dispatch(addOrUpdateCartItemLocal({ ...product, quantity: 1 }));
          }
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    );
  }
    const adaptive = mode === 'adaptive';

  // 已加入购物车：数量控制
  return (
    // <div className="flex items-center space-x-2"
    // >
    <div
      className={"flex items-center justify-between gap-1 w-full max-w-[200px]"}
    >
      {/* ➖ 减号 */}
      <button
        onClick={() => handleChange(quantity - 1)}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        -
      </button>

      {/* 数量输入框 */}
      <input
        type="text"
        value={inputVal}
        onChange={(e) => {
          const val = e.target.value;
          // 更新输入框本地状态（支持空值）
          setInputVal(val);

          // 只有是正整数时才 dispatch
          const num = Number(val);
          if (!isNaN(num) && Number.isInteger(num) && num > 0) {
            handleChange(num);
          }
        }}
        className="w-16 h-8 px-2 py-1 text-center border rounded"
      />

      {/* ➕ 加号 */}
      <button
        onClick={() => handleChange(quantity + 1)}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
}

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCart,
  addOrUpdateItem,
  removeItem,
  applyPromoCode,
} from '../../api/cart';
import { createOrder } from '../../api/order';

const saveLocal = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchCartFromServer',
  async () => {
    const data = await fetchCart();
    return data;
  }
);

export const addOrUpdateCartItem = createAsyncThunk(
  'cart/addOrUpdateItem',
  async ({ productId, quantity }) => {
    const data = await addOrUpdateItem({productId, quantity});
    return data;
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ productId }) => {
    const res = await removeItem({ productId });
    return res.data; // 直接返回 cart.items
  }
);

export const applyPromoCodeToCart = createAsyncThunk(
  'cart/applyPromo',
  async (code) => {
    const data = await applyPromoCode(code);
    return code;
  }
);

export const checkoutOrder = () => async (dispatch) => {
  console.log('[THUNK] checkoutOrder triggered');
  try {
    const res = await createOrder();
    dispatch(clearCart());
    alert('Order placed successfully!');
    window.location.href = '/orders'; //  强制跳转避免 dispatch 导致视图异常
  } catch (err) {
    console.error('[THUNK] Order error:', err);
    alert(err.response?.data?.message || 'Failed to place order');
  }
};


//分界线


const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 添加商品到本地状态
    addToCartLocal(state, action) {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveLocal(state.items);
    },
    // 更新本地状态中的商品数量
    updateQuantityLocal(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) {
        item.quantity = quantity;
        saveLocal(state.items);
      }
    },
    // 从本地状态中删除商品
    removeFromCartLocal(state, action) {
      state.items = state.items.filter(i => i._id !== action.payload);
      saveLocal(state.items);
    },
    // 清空购物车
    clearCart(state) {
      state.items = [];
      state.promotionCode = '';
      localStorage.removeItem('cart');
    },
  },

  
  // 异步操作处理
  // 使用 createAsyncThunk 处理异步操作
  extraReducers: (builder) => {
    builder

      // 获取服务器购物车数据
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.items = action.payload.items.map((i) => {
          const product = i.productId;
          return {
            _id: product._id , 
            name: product.name ,
            price: product.price ,
            quantity: i.quantity,
          };
        });
        state.promotionCode = action.payload.promotionCode || '';
        saveLocal(state.items);
      })

      // 添加或更新商品
      .addCase(addOrUpdateCartItem.fulfilled, (state, action) => {
        console.log('[Reducer] addOrUpdateCartItem.fulfilled:', action.payload);
        const updatedItems = action.payload.items;
        state.items = updatedItems.map((i) => {
          const product = i.productId || {};
          return{
            _id: product._id || i.productId,
            quantity: i.quantity ,
            name: product.name || 'Unknown',
            price: product.price  || 0,
          };
      });
        saveLocal(state.items);
      })

      // 删除商品
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const incoming = action.payload?.items || [];
        console.log('[Reducer] removeCartItem.payload:', action.payload);
        console.error('[Reducer] removeCartItem REJECTED:', action.error);
        state.items = incoming.map((i) => {
          const product = i.productId || {};
          return {
            _id: product._id || '',
            quantity: i.quantity,
            name: product.name || 'Unknown',
            price: product.price || 0,
          };
        });
        saveLocal(state.items);
      })

      // 应用优惠码
      .addCase(applyPromoCodeToCart.fulfilled, (state, action) => {
        state.promotionCode = action.payload;
      });
  },
} );


export const { addToCartLocal, updateQuantityLocal, removeFromCartLocal, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

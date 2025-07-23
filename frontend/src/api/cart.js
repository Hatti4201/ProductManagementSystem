import axios from 'axios';

const BASE = 'http://localhost:3000/api/cart';
const token = () => localStorage.getItem('token');

export const fetchCart = async () => {
  const res = await axios.get(BASE, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
};

export const addOrUpdateItem = async (payload) => {
  if (!payload?.productId) {
    console.warn('⚠️ productId is missing in addOrUpdateItem:', payload);
  }

  const res = await axios.post(
    `${BASE}/item`,
    payload,
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  return res.data;
};

export const removeItem = async ({ productId }) => {
  console.log('[API] Removing item:', productId);
  const res = await axios.delete(`${BASE}/item/${productId}`, {
    
    headers: { Authorization: `Bearer ${token()}` },
  });
  console.log('[API] Remove success:', res.data);
};

export const applyPromoCode = async ({ code }) => {
  const res = await axios.post(
    `${BASE}/promo`,
    { code },
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  return res.data;
};

export const mergeCart = async ({ localItems }) => {
  const res = await axios.post(
    `${BASE}/merge`,
    { items: localItems.map(i => ({ productId: i._id, quantity: i.quantity })) },
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  return res.data;
};

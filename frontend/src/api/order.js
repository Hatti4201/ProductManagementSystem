import axios from 'axios';
const BASE = 'http://localhost:3000/api/orders';
const token = () => localStorage.getItem('token');

export const createOrder = async () => {
  const res = await axios.post(BASE, {}, {
    headers: { Authorization: `Bearer ${token()}` }
  });
  return res.data;
};

export const getMyOrders = async () => {
  const res = await axios.get(BASE, {
    headers: { Authorization: `Bearer ${token()}` }
  });
  return res.data;
};

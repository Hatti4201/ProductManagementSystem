import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

export const fetchProducts = async (search = '') => {
  const res = await axios.get(`${BASE_URL}/products`, {
    params: search ? { search } : {},
  });
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await axios.post(`${BASE_URL}/products`, productData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await axios.put(`${BASE_URL}/products/${id}`, productData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${BASE_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await axios.get(`${BASE_URL}/products/${id}`);
  return res.data;
};

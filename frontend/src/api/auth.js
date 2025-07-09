import axios from 'axios';

// ⚠️ 根据你后端地址修改 baseURL，例如 localhost:3000
const BASE_URL = 'http://localhost:5173/api';

export const signIn = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/signin`, { email, password });
  return res.data; // 假设返回 { token, user }
};

export const signUp = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/signup`, { email, password });
  return res.data;
};

export const updatePassword = async (oldPassword, password) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${BASE_URL}/update-password`,
    { oldPassword, password },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

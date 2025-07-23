import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/promo';

export const checkPromoCode = async(code) => {
    const res = await axios.get(`${BASE_URL}/${code}`);
    return res.data;
};
import { useState } from 'react';
import { signIn, signUp, updatePassword } from '../api/auth';
import { mergeCart } from '../api/cart';
import { fetchCartFromServer } from '../store/slices/cartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

export default function AuthForm({ mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    oldPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    // ✅ 前端验证
    if (mode !== 'update' && !formData.email.trim()) {
      alert('Email is required');
      return;
    }

    if (!formData.password.trim()) {
      alert('Password is required');
      return;
    }

    if (mode === 'signup' || mode === 'update') {
      if (!formData.confirmPassword.trim()) {
        alert('Please confirm your password');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }

    if (mode === 'update' && !formData.oldPassword.trim()) {
      alert('Old password is required');
      return;
    }

    if (mode !== 'update') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email');
        return;
      }
    }

    try {
      let response;

      if (mode === 'signin') {
        response = await signIn(formData.email, formData.password);
      } else if (mode === 'signup') {
        response = await signUp(formData.email, formData.password);
      } else if (mode === 'update') {
        response = await updatePassword(
          formData.oldPassword,
          formData.password
        );
      }

      // ✅ 成功登录后保存信息
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        
          // 🛒 合并购物车逻辑start
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (localCart.length > 0 ) {
          const items = localCart.map(i => ({
            productId: i._id,
            quantity: i.quantity,
          }));
        
          try {
            await mergeCart({ localItems: localCart }); // 合并 localStorage 与后端
            localStorage.removeItem('cart');           // 清除 local 副本
            dispatch(fetchCartFromServer());           // 拉取合并后的服务器购物车
          } catch (err) {
            console.error('Cart merge failed:', err);
          }
        }
        // 🛒 合并购物车逻辑end

        alert(`${mode} success!`);
        navigate('/products');  //登录成功后跳转
      }
    
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };



  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>
        {mode === 'signin'
          ? 'Sign In'
          : mode === 'signup'
          ? 'Sign Up'
          : 'Update Password'}
      </h2>
      <form onSubmit={handleSubmit}>
        {mode !== 'update' && (
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        )}

        {mode === 'update' && (
          <div>
            <label>Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              required
              value={formData.oldPassword}
              onChange={handleChange}
            />
          </div>
        )}

        <div>
          <label>{mode === 'update' ? 'New Password:' : 'Password:'}</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {(mode === 'signup' || mode === 'update') && (
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit" style={{ marginTop: '16px' }}>
          {mode === 'signin'
            ? 'Sign In'
            : mode === 'signup'
            ? 'Sign Up'
            : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

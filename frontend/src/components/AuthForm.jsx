import { useState, useContext } from 'react';
import { signIn, signUp, updatePassword } from '../api/auth';
import { mergeCart } from '../api/cart';
import { fetchCartFromServer } from '../store/slices/cartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

const modeConfig = {
  signin: {
    title: 'Sign In',
    showEmail: true,
    showOldPassword: false,
    showConfirmPassword: false,
  },
  signup: {
    title: 'Sign Up',
    showEmail: true,
    showOldPassword: false,
    showConfirmPassword: true,
  },
  update: {
    title: 'Update Password',
    showEmail: false,
    showOldPassword: true,
    showConfirmPassword: true,
  },
};

export default function AuthForm({ mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    oldPassword: '',
    isAdmin: false,
  });

  const { title, showEmail, showOldPassword, showConfirmPassword } =
    modeConfig[mode];

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 验证表单数据
  const validate = () => {
    if (showEmail && !formData.email.trim()) return 'Email is required';
    if (!formData.password.trim()) return 'Password is required';
    if (showConfirmPassword && formData.password !== formData.confirmPassword)
      return 'Passwords do not match';
    if (showConfirmPassword && !formData.confirmPassword.trim())
      return 'Please confirm your password';
    if (showOldPassword && !formData.oldPassword.trim())
      return 'Old password is required';

    if (showEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return 'Invalid email format';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return alert(error);

    try {
      let response;
      if (mode === 'signin') {
        response = await signIn(formData.email, formData.password);
      } else if (mode === 'signup') {
        response = await signUp(
          formData.username, 
          formData.email, 
          formData.password,
          formData.isAdmin
        );
      } else {
        response = await updatePassword(
          formData.oldPassword,
          formData.password
        );
      }

      if (response.token) {
        localStorage.setItem('token', response.token);
        login(response.user);

        // 购物车合并
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (localCart.length > 0) {
          await mergeCart({ localItems: localCart });
          localStorage.removeItem('cart');
          dispatch(fetchCartFromServer());
        }

        alert(`${title} success!`);
        navigate('/products');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">{title}</h2>
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="gap-ld" />

        {/* signup: username */}
        {mode === 'signup' && (
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full border p-2 rounded"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="gap-md" />

        {/* email */}
        {showEmail && (
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="gap-md" />

        {/* oldpassword */}
        {showOldPassword && (
          <div>
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              className="w-full border p-2 rounded"
              value={formData.oldPassword}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="gap-md" />

        {/* password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder={mode === 'update' ? 'New Password' : 'Password'}
            className="w-full border p-2 rounded"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="gap-md" />

        {/* confirm password */}
        {showConfirmPassword && (
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="gap-md" />

        {/* signup: isAdmin */}
        {mode === 'signup' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAdmin"
              id="isAdmin"
              checked={formData.isAdmin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isAdmin: e.target.checked }))
              }
            />
            <label htmlFor="isAdmin" className="text-sm">
              Register as Admin
            </label>
          </div>
        )}


        {/* submit button */}
        <button
          type="submit"
          className="w-full bg-[#3F51B5] text-white py-2 rounded hover:bg-[#5C6BC0] transition"
        >
          {title}
        </button>
      </form>

      {mode === 'signin' && (
        <p className="text-sm text-center mt-4">
          Don’t have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Register here
          </span>
        </p>
      )}
      </div>
    </div>

  );
}

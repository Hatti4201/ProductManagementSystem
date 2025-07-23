import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.items);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const [search, setSearch] = useState(new URLSearchParams(location.search).get('search') || '');

  const handleLogout = () => {
    dispatch(clearCart());
    logout();
    navigate('/signin');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${search}`);
  };

  return (
    // header贴在上方
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#3F51B5] text-white px-4 py-3 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        
        {/* 左：Logo + 标题 */}
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/products')}>
          <img src="/vite.svg" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-lg text-[#F3E5F5] md:text-xl whitespace-nowrap">
            Product Management System
          </span>
        </div>

        {/* 中：搜索框 */}
        <form
          onSubmit={handleSearch}
          className="sm:flex justify-center items-center gap-2 flex-1"
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 rounded bg-[#F3E5F5] text-black w-48 md:w-64"
          />
          <button
            type="submit"
            className="px-1 py-1 bg-white text-[1rem] text-[#3F51B5] font-medium rounded hover:bg-[#7986CB] hover:text-white transition scale-80"
          >
            Search
          </button>
        </form>

        {/* 右：用户/订单/购物车 */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {user ? (
            <div className="relative group">
              <span className="text:[#F3E5F5] cursor-pointer font-medium group-hover:underline whitespace-nowrap">
                {user.username} ⏷
              </span>
              <div className="absolute right-0 mt-1 hidden group-hover:block bg-white text-black rounded shadow py-1 z-10 min-w-[100px]">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm w-full text-left scale-90"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/signin')}
              className="hover:underline font-medium"
            >
              Sign in
            </button>
          )}

          <button
            onClick={() => navigate('/orders')}
            className="text-md font-medium hover:underline whitespace-nowrap scale-90"
          >
            📦 Orders
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="text-md font-medium hover:underline whitespace-nowrap scale-90"
          >
            🛒 ￥{totalPrice}
          </button>
        </div>
      </div>
    </nav>

  );
}

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
    <nav className="bg-[#3F51B5] text-white h-20 px-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        
        {/* 左：Logo + 标题 */}
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/products')}>
          <img src="/vite.svg" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-lg md:text-xl whitespace-nowrap">
            Product Management System
          </span>
        </div>

        {/* 中：搜索框（中间居中，移动端隐藏） */}
        <form
          onSubmit={handleSearch}
          className="sm:flex items-center gap-2 flex-1 justify-center"
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
            className="px-3 py-1 bg-white text-[#3F51B5] font-medium rounded hover:bg-[#7986CB] hover:text-white transition"
          >
            Search
          </button>
        </form>

        {/* 右：用户/订单/购物车 */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {user ? (
            <div className="relative group">
              <span className="cursor-pointer font-medium group-hover:underline whitespace-nowrap">
                {user.username} ⏷
              </span>
              <div className="absolute right-0 mt-1 hidden group-hover:block bg-white text-black rounded shadow py-1 z-10 min-w-[100px]">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm w-full text-left"
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
            className="text-sm font-medium hover:underline whitespace-nowrap"
          >
            📦 Orders
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="text-sm font-medium hover:underline whitespace-nowrap"
          >
            🛒 ￥{totalPrice}
          </button>
        </div>
      </div>
    </nav>

  );
}

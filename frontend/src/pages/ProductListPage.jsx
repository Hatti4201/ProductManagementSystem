import { useEffect, useState, useContext } from 'react';
import { fetchProducts, deleteProduct } from '../api/product';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addToCartLocal,
  addOrUpdateCartItem,   
} from '../store/slices/cartSlice';
import CartControlButton from '../components/CartControlButton';
import ProductTitle from '../components/ProductTitle';


export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext); // ✅ 保留 AuthContext 提供的 user
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || ''; // 从 URL 获取搜索参数
  const cartItems = useSelector(state => state.cart.items); // 获取 Redux 中的购物车商品
  const [sortOption, setSortOption] = useState(''); // 排序

  // Infinite Scroll 无限加载产品
  const [page, setPage] = useState(0);      // 当前页码（从0开始）
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const BASE_URL = 'http://localhost:3000/api';
  const limit = 10; // 每页加载的产品数量

useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 50 >=
      document.documentElement.offsetHeight
    ) {
      loadMoreProducts();
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [page, hasMore, loading]);

// 初始化加载第一页
useEffect(() => {
  setProducts([]);
  setPage(0);
  setHasMore(true);
}, [search]);

useEffect(() => {
  if (page === 0) loadMoreProducts();
}, [page]);

  // 获取产品数量
  const getCartQuantity = (productId) => {
    const item = cartItems.find(i => i._id === productId);
    return item?.quantity || 0;
  };

  // 产品移出购物车 处理函数
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // 添加到购物车 处理函数
  const handleAddToCart = (product) => {
    const existing = cartItems.find((i) => i._id === product._id);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    console.log('Adding item to server cart page', product._id, 'quantity =', newQuantity);
    dispatch(addOrUpdateCartItem({ productId: product._id, quantity: newQuantity }));
  };



  // 下滑加载更多商品-数据加载 函数
  const loadMoreProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const res = await fetch(
      `${BASE_URL}/products?skip=${page * limit}&limit=${limit}&search=${search}`
    );
    const data = await res.json();

    setProducts((prev) => [...prev, ...data.products]);
    setHasMore(data.products.length === limit);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  return (
    <div className="w-full">
      
      <h2 className="text-xl font-semibold text-primary">Product List</h2>   
        {/* // 排序filter */}
        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setProducts([]);  // 重新加载
            setPage(0);
            setHasMore(true);
          }}
          className="border border-gray-300 px-3 py-1 rounded-md bg-white text-sm"
        >
          <option value="">Filter</option>
          <option value="latest">Latest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>


      {user?.role === 'admin' && (
        <button 
          onClick={() => navigate('/product/new')}
          className='bg-[#A5D6A7] scale-90'
          >
            + Add Product</button>
      )}
      
      {/* 商品卡片列表排列 */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-100 gap-y-6 p-6">  
        {products.map((product) => (
          <ProductTitle
            key={product._id}
            product={product}
            user={user}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Loading 指示器 */}
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {!hasMore && <p style={{ textAlign: 'center' }}>No more products.</p>}

    </div>
  );
}

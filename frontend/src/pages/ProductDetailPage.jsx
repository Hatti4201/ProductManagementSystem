import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/product';
import { AuthContext } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { addOrUpdateCartItem, addToCartLocal } from '../store/slices/cartSlice';
import CartControlButton from '../components/CartControlButton';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
    };
    loadProduct();
  }, [id]);

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Products Detail</h2>

      {/* ✅ 主体内容：响应式布局 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左：商品图片 */}
        <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow border border-gray-200">
          <img
            src={product.image || product.imageUrl}
            alt={product.name}
            className="w-full h-auto max-h-[700px] object-contain"
          />
        </div>

        {/* 右：商品详情 */}
        <div className="w-full md:w-1/2 flex flex-col justify-start gap-4">
          <p className="text-sm text-gray-500">{product.category}</p>
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <p className="text-xl text-black font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-gray-700">{product.description}</p>

          {/* Add to Cart 按钮 */}
          <div className="mt-4">
            <CartControlButton product={product} />
          </div>

          {/* 管理员编辑按钮 */}
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate(`/product/edit/${id}`)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Edit Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

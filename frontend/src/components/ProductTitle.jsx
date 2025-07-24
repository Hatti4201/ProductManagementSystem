import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartControlButton from './CartControlButton';

export default function ProductTile({ product, user, onDelete }) {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const quantity = cartItems.find((i) => i._id === product._id)?.quantity || 0;

  return (
    <div className="rounded-2xl overflow-hidden shadow border border-gray-200 p-4 bg-white hover:shadow-md transition flex flex-col">
      {/* 商品图片：正方形比例 */}
      <div
        className="w-full aspect-square overflow-hidden mb-3 rounded-2xl"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* 商品名称 + 价格 */}
      <div className="flex flex-col justify-end items-start min-h-[72px]">
        <p
          className="px-2 text-sm text-gray-500 leading-snug line-clamp-2"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </p>
        <p className="text-2xl font-extrabold text-black tracking-tight mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* 按钮区域 */}
      <div className="mt-4">
        {user?.role === 'admin' && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/edit/${product._id}`);
              }}
              className="flex-1 text-sm py-1 rounded bg-[#5C6BC0] text-white hover:bg-[#3949AB]"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product._id);
              }}
              className="flex-1 text-sm py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
          <CartControlButton product={product} mode="adaptive" />
      </div>
    </div>
  );
}

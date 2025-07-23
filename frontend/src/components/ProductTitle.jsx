import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartControlButton from './CartControlButton';

export default function ProductTile({ product, user, onDelete }) {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const quantity = cartItems.find((i) => i._id === product._id)?.quantity || 0;

  return (
    <div
      className="bg-white border border-gray-300 rounded-lg shadow p-4 hover:shadow-md transition 
                 cursor-pointer flex flex-col"
    >
      {/* 商品图片：正方形比例 */}
      <div
        className="w-full aspect-square overflow-hidden mb-3 rounded-lg"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 商品名称 + 价格 */}
      <div className="flex flex-col justify-end items-start min-h-[72px]">
        <p
          className="text-sm text-gray-500 leading-tight line-clamp-2 "
          onClick={() => navigate(`/product/${product._id}`)}
          padding="0 0.5rem"
        >
          {product.name}
        </p>
        <p className="text-2xl font-extrabold text-black tracking-tight mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* 按钮区域 */}
      <div className="mt-4">
        {user?.role === 'admin' ? (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/edit/${product._id}`);
              }}
              className="flex-1 text-sm bg-blue-500 text-white py-1 rounded bg-[#5C6BC0] hover:bg-[#3949AB] text-white"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product._id);
              }}
              className="flex-1 text-sm bg-red-500 text-white py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ) : (
          <CartControlButton product={product} mode="adaptive" />
        )}
      </div>
    </div>
  );
}

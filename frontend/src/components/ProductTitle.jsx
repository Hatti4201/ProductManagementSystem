import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartControlButton from './CartControlButton';

export default function ProductTile({ product, user, onDelete }) {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const quantity = cartItems.find((i) => i._id === product._id)?.quantity || 0;

  return (
    <div
      className="bg-white border border-gray-300 rounded shadow p-4 hover:shadow-md transition 
                 cursor-pointer w-full aspect-[4/5] flex flex-col justify-between"
    >
      {/* 商品图片 */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-[140px] object-contain mb-3"
        onClick={() => navigate(`/product/${product._id}`)}
      />

      <h3 
       className="text-lg font-semibold mb-2 min-h-[48px]"
       onClick={() => navigate(`/product/${product._id}`)}
      >{product.name}
      </h3>
      
      <p className="text-gray-700 font-bold mb-2">${product.price.toFixed(2)}</p>

      {user?.role === 'admin' ? (
        <div className="flex justify-between items-center">

          {/* admin：编辑按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/edit/${product._id}`);
            }}
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
          >
            Edit
          </button>

          {/* admin：删除按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product._id);
            }}
            className="text-sm bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>

        </div>
      ) : (
        <CartControlButton product={product} />
      )}
    </div>
  );
}

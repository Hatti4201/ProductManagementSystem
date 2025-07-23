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

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>${product.price}</strong></p>

      <CartControlButton product={product} />

      {user?.role === 'admin' && (
        <button onClick={() => navigate(`/product/edit/${id}`)}>Edit Product</button>
        
      )}
    </div>
  );
}

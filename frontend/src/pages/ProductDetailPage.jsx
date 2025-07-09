import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/product';
import { AuthContext } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { user } = useContext(AuthContext);

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

      <button>Add to Cart</button>

      {user?.role === 'admin' && (
        <button onClick={() => navigate(`/product/edit/${id}`)}>Edit Product</button>
      )}
    </div>
  );
}

import { useEffect, useState, useContext } from 'react';
import { fetchProducts, deleteProduct } from '../api/product';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2>Product List</h2>
      {user?.role === 'admin' && (
        <button onClick={() => navigate('/product/new')}>+ Add Product</button>
      )}
      <div>
        {products.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ccc', margin: '12px', padding: '8px' }}>
            <h3 onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
              {product.name}
            </h3>
            <p>${product.price}</p>

            {user?.role === 'admin' ? (
              <>
                <button onClick={() => navigate(`/product/edit/${product._id}`)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </>
            ) : (
              <button>Add to Cart</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

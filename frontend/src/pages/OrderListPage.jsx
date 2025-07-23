import { useEffect, useState } from 'react';
import { getMyOrders } from '../api/order';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders().then(setOrders);
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} style={{ marginBottom: '20px' }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total:</strong> ${order.totalAmount}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.productId._id}>
                {item.productId.name} × {item.quantity}
              </li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </div>
  );
}

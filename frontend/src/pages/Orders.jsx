import { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((response) => setOrders(response.data));
  }, []);

  return (
    <>
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div className="order" key={order.id}>
          <b>Order #{order.id}</b>
          <span>{order.status}</span>
          <span>₹{order.totalAmount}</span>
          <small>{new Date(order.createdAt).toLocaleString()}</small>
          {order.items.map((item) => (
            <div key={item.id}>{item.productName} × {item.quantity}</div>
          ))}
        </div>
      ))}
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const loadCart = () => api.get("/cart").then((response) => setCart(response.data));

  useEffect(() => { loadCart(); }, []);

  const checkout = async () => {
    const shippingAddress = prompt("Shipping address");
    if (shippingAddress) {
      await api.post("/orders/checkout", { shippingAddress });
      alert("Order placed");
      navigate("/orders");
    }
  };

  return (
    <>
      <h1>Cart</h1>
      {cart.length ? cart.map((item) => (
        <div className="row" key={item.id}>
          <span>{item.product.name}</span>
          <input type="number" min="1" value={item.quantity} onChange={async (event) => {
            await api.put(`/cart/${item.id}`, { quantity: +event.target.value });
            loadCart();
          }} />
          <b>₹{item.subtotal}</b>
          <button onClick={async () => { await api.delete(`/cart/${item.id}`); loadCart(); }}>Remove</button>
        </div>
      )) : <p>Cart is empty.</p>}
      {cart.length > 0 && <button onClick={checkout}>Checkout · ₹{cart[0].total}</button>}
    </>
  );
}

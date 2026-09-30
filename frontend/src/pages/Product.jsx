import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Auth from "../auth";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useContext(Auth);

  useEffect(() => {
    api.get(`/products/${id}`).then((response) => setProduct(response.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product">
      <img src={product.imageUrl} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <h2>₹{product.price}</h2>
        <p>Stock: {product.stock}</p>
        <button
          disabled={!user}
          onClick={() => api.post(`/cart/${product.id}`).then(() => alert("Added to cart"))}
        >
          {user ? "Add to Cart" : "Login to buy"}
        </button>
      </div>
    </div>
  );
}

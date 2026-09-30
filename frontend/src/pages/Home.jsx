import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/products").then((response) => setProducts(response.data));
  }, []);

  return (
    <>
      <h1>Products</h1>
      <input
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="grid">
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase()),
          )
          .map((product) => (
            <div className="card" key={product.id}>
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <b>₹{product.price}</b>
              <Link to={`/product/${product.id}`}>View</Link>
            </div>
          ))}
      </div>
    </>
  );
}

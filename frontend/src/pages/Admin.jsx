import { useEffect, useState } from "react";
import api from "../api";

const initialForm = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrl: "https://picsum.photos/600/400",
  categoryId: 1,
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const loadProducts = () => api.get("/products").then((response) => setProducts(response.data));

  useEffect(() => { loadProducts(); }, []);

  const addProduct = async (event) => {
    event.preventDefault();
    await api.post("/products", form);
    setForm({ ...form, name: "", description: "" });
    loadProducts();
  };

  return (
    <>
      <h1>Admin · Products</h1>
      <form className="adminform" onSubmit={addProduct}>
        {Object.keys(form).map((key) => (
          <input key={key} placeholder={key} value={form[key]} onChange={(event) => setForm({
            ...form,
            [key]: key === "price" || key === "stock" || key === "categoryId"
              ? +event.target.value
              : event.target.value,
          })} />
        ))}
        <button>Add Product</button>
      </form>
      {products.map((product) => (
        <div className="row" key={product.id}>
          <span>{product.name} · ₹{product.price} · stock {product.stock}</span>
          <button onClick={async () => { await api.delete(`/products/${product.id}`); loadProducts(); }}>Delete</button>
        </div>
      ))}
    </>
  );
}

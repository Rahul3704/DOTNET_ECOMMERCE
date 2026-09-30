import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Auth from "./auth";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Product from "./pages/Product";
import Register from "./pages/Register";

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const login = (session) => {
    localStorage.setItem("token", session.token);
    localStorage.setItem("user", JSON.stringify(session.user));
    setUser(session.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Auth.Provider value={{ user, login, logout }}>
      <nav>
        <Link to="/" className="logo">ShopDotNet</Link>
        <div>
          <Link to="/">Products</Link>
          {user && <Link to="/cart">Cart</Link>}
          {user && <Link to="/orders">Orders</Link>}
          {user?.role === "Admin" && <Link to="/admin">Admin</Link>}
          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </Auth.Provider>
  );
}

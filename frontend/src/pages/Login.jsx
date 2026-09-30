import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Auth from "../auth";
import Form from "../components/Form";

export default function Login() {
  const { login } = useContext(Auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form title="Login" onSubmit={async (event) => {
      event.preventDefault();
      try {
        const response = await api.post("/auth/login", { email, password });
        login(response.data);
        navigate("/");
      } catch (error) {
        alert(error.response?.data || "Login failed");
      }
    }}>
      <input placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
      <button>Login</button>
    </Form>
  );
}

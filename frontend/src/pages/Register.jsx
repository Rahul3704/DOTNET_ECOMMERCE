import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Auth from "../auth";
import Form from "../components/Form";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(Auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form title="Register" onSubmit={async (event) => {
      event.preventDefault();
      try {
        const response = await api.post("/auth/register", { name, email, password });
        login(response.data);
        navigate("/");
      } catch (error) {
        alert(error.response?.data || "Registration failed");
      }
    }}>
      <input placeholder="Name" onChange={(event) => setName(event.target.value)} />
      <input placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
      <button>Create Account</button>
    </Form>
  );
}

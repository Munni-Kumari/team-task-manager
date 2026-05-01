import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      // save token
      localStorage.setItem("token", res.data.token);

      alert("Login success");

      // redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
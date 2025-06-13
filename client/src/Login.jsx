import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (res.data && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/profile");
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2 style={{ color: "#333" }}>Login</h2>

      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="password-container">
        <input
          className="input-field"
          type={showPass ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="show-hide-icon"
          onClick={() => setShowPass(!showPass)}
        >
          {showPass ? "🙈 Hide" : "👁️ Show"}
        </span>
      </div>

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      <p className="link">
           <a href="/forgot-password">Forgot Password?</a>
      </p>
      <p className="link">
        Don't have an account? <a href="/register">Create new account</a>
      </p>
    </div>
  );
}

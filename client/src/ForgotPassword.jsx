import { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleReset = async () => {
    if (!form.name || !form.email || !form.mobile || !form.newPassword) {
      setError("All fields are required");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[A-Za-z\d@#$%&]{8,}$/;
    if (!passwordRegex.test(form.newPassword)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, and special character (@#$%&)");
      return;
    } 

    try {
      const res = await axios.post("http://localhost:5000/reset-password", form);
      setSuccess("Password updated successfully! Redirecting to login...");
      setError("");
      setTimeout(() => {
      navigate("/"); 
    }, 4000);
    } catch (err) {
      setError("Verification failed. Please check your inputs.");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <input className="input-field" name="name" placeholder="Name" onChange={handleChange} />
      <input className="input-field" name="email" placeholder="Email" onChange={handleChange} />
      <input className="input-field" name="mobile" placeholder="Mobile" onChange={handleChange} />
      <input className="input-field" name="newPassword" type="password" placeholder="New Password" onChange={handleChange} />
      <button onClick={handleReset} >Reset Password</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

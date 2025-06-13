import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    photo: null
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[A-Za-z\d@#$%&]{8,}$/;
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, and special character (@#$%&)");
      return;
    }

    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);

    try {
      await axios.post("http://localhost:5000/register", data);
       setSuccess("Registration successful! Redirecting to login...");
       setError("");
  setTimeout(() => {
    navigate("/");
  }, 4000);
    } catch (err) {
      setError("Registration failed");
       setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <input className="input-field" name="name" placeholder="Name" onChange={handleChange} /><br />
      <input className="input-field" name="email" placeholder="Email" onChange={handleChange} /><br />
      <input className="input-field" name="mobile" placeholder="Mobile" onChange={handleChange} /><br />
      <input className="input-field" type="file" name="photo" onChange={handleChange} /><br />
      <input className="input-field" type="password" name="password" placeholder="Password" onChange={handleChange} /><br />
      <input className="input-field" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} /><br />
      <button onClick={handleSubmit}>Create Account</button>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

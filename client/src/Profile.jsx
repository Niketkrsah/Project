import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return navigate("/");
    setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="login-container">
      <h2 className="input-field">Profile</h2>
      <img
        src={`http://localhost:5000/uploads/${user.photo}`}
        alt="profile"
        width={150}
      /><br />
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Mobile:</strong> {user.mobile}</p>
      
      <button onClick={handleLogout} style={{ marginTop: "20px", background: "#d9534f" }}>
        Logout
      </button>
    </div>
  );
}

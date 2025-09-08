import { useState } from "react";
import axios from "axios";
import '../css/loginpage.css';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    // Prevent the default form submission behavior (which causes a page reload).
    // This is crucial for Single Page Applications (SPAs).
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );

      // We use localStorage.setItem() to store the received token.
      // We give it a key, 'token', so we can easily retrieve it later.
      localStorage.setItem("token", response.data.token);
      
      // We use localStorage.setItem() to store the received token.
      // We give it a key, 'token', so we can easily retrieve it later.
      navigate("/admin/dashboard");

      console.log("Login Successfull", response.data);
      alert("Login Successfull! Check the console for your token");
    }
    catch(error) {
      if( error.response && error.response.data && error.response.data.message ) {
        setError(error.response.data.message);
      }
      else {
        setError("Login failed");
      }
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
        </div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
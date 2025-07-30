import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/AuthContext";

const weatherBg =
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(username, password);
    if (data) {
      setUser(data.user);
      navigate("/weather"); // Redirect to weather app on successful login
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(rgba(0,30,80,0.5), rgba(0,80,180,0.55)), url(${weatherBg}) center/cover no-repeat`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
    }}>
      <form className="login-glass" onSubmit={handleSubmit} autoComplete="off">
        <div className="login-header">
          <span role="img" aria-label="weather" style={{fontSize:"2rem"}}>⛅</span>
          <h2>Weather Predictor Login</h2>
        </div>
        <input
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          required
        />
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
        />
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="login-error">{error}</p>}
        <div style={{marginTop: "1.2rem", textAlign: "center"}}>
          <span style={{color:"#fff"}}>Don't have an account? </span>
          <Link to="/register" style={{color:"#6bb7ff", fontWeight:"bold", textDecoration:"underline"}}>
            Register
          </Link>
        </div>
      </form>
      <style>{`
        .login-glass {
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.21);
          border-radius: 22px;
          border: 1.5px solid rgba(255,255,255,0.22);
          padding: 2.7rem 2.3rem 2rem;
          min-width: 325px;
          max-width: 92vw;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          animation: fadeIn 1s;
        }
        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2.1rem;
        }
        .login-header h2 {
          color: #fff;
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0.3rem 0 0;
          letter-spacing: 1.1px;
        }
        .login-input {
          margin-bottom: 1.2rem;
          padding: 0.8rem 1rem;
          border: none;
          border-radius: 7px;
          background: rgba(255,255,255,0.37);
          font-size: 1.07rem;
          color: #222;
          outline: none;
          transition: background .2s;
        }
        .login-input:focus {
          background: rgba(255,255,255,0.57);
        }
        .login-btn {
          padding: 0.9rem 0;
          border: none;
          border-radius: 7px;
          background: linear-gradient(90deg,#6bb7ff,#3a7bd5);
          color: #fff;
          font-size: 1.13rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 0.7rem;
        }
        .login-btn:disabled {
          background: #87c4ffad;
          cursor: not-allowed;
        }
        .login-error {
          color: #ffd6d6;
          background: rgba(255,0,0,0.11);
          border-radius: 5px;
          padding: 0.7rem;
          margin: 0;
          text-align: center;
          font-size: 1.03rem;
        }
        @media (max-width: 600px) {
          .login-glass {
            padding: 1.2rem 0.7rem;
            min-width: 0;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default Login;
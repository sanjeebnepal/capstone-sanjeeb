import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

const weatherBg =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80";

const Register = () => {
  const [form, setForm] = useState({ id: "", username: "", password: "", email: "" });
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res) navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(rgba(40,60,120,0.5), rgba(60,100,200,0.6)), url(${weatherBg}) center/cover no-repeat`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
    }}>
      <form className="register-glass" onSubmit={handleSubmit} autoComplete="off">
        <div className="register-header">
          <span role="img" aria-label="weather" style={{ fontSize: "2rem" }}>🌧️</span>
          <h2>Create Your Account</h2>
        </div>
        <input
          className="register-input"
          name="id"
          onChange={handleChange}
          type="number"
          placeholder="ID"
          required
        />
        <input
          className="register-input"
          name="username"
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          className="register-input"
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          required
        />
        <input
          className="register-input"
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Email"
          required
        />
        <button className="register-btn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p className="register-error">{error}</p>}
        <div style={{ marginTop: "1.1rem", textAlign: "center" }}>
          <span style={{ color: "#fff" }}>Already have an account? </span>
          <Link to="/" style={{ color: "#6bb7ff", fontWeight: "bold", textDecoration: "underline" }}>
            Login
          </Link>
        </div>
      </form>
      <style>{`
        .register-glass {
          background: rgba(255, 255, 255, 0.16);
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
        .register-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2.1rem;
        }
        .register-header h2 {
          color: #fff;
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0.3rem 0 0;
          letter-spacing: 1.1px;
        }
        .register-input {
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
        .register-input:focus {
          background: rgba(255,255,255,0.57);
        }
        .register-btn {
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
        .register-btn:disabled {
          background: #87c4ffad;
          cursor: not-allowed;
        }
        .register-error {
          color: #ffd6d6;
          background: rgba(255,0,0,0.11);
          border-radius: 5px;
          padding: 0.7rem;
          margin: 0;
          text-align: center;
          font-size: 1.03rem;
        }
        @media (max-width: 600px) {
          .register-glass {
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

export default Register;
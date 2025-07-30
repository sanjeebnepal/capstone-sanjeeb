import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import WeatherApp from "./components/WeatherApp";

const App = () => (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/weather" element={<WeatherApp />} />
    </Routes>
);

export default App;

// This code sets up a React application with routing using React Router.
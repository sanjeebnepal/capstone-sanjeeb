import React, { useState } from "react";
import axios from "axios";

function WeatherApp() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCelsius, setShowCelsius] = useState(false);
 
  
  const API_KEY = "8c8530f0f5f0040c40f60275a4355cd1";


  const handleSearch = async () => {
    setError("");
    setData({});
    if (!location || !date) {
      setError("Please enter both location and date.");
      return;
    }
    setLoading(true);
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0,0,0,0);
    selectedDate.setHours(0,0,0,0);
    const diffDays = Math.floor((selectedDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      setError("Sorry, past weather data is not available for free.");
      setLoading(false);
      return;
    } else if (diffDays === 0) {
      // Current weather
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`;
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (e) {
        setError("Could not fetch current weather.");
      }
    } else if (diffDays > 0 && diffDays < 6) {
      // Forecast (5 days ahead)
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&appid=${API_KEY}`;
      try {
        const response = await axios.get(url);
        const target = new Date(date + "T12:00:00");
        const item = response.data.list.find(item => {
          const itemDate = new Date(item.dt_txt);
          return (
            itemDate.getUTCFullYear() === target.getUTCFullYear() &&
            itemDate.getUTCMonth() === target.getUTCMonth() &&
            itemDate.getUTCDate() === target.getUTCDate() &&
            itemDate.getUTCHours() === target.getUTCHours()
          );
        });
        if (item) {
          setData({ ...item.main, weather: [item.weather[0]], name: location, wind: item.wind });
        } else {
          setError("No forecast available for that date/time.");
        }
      } catch (e) {
        setError("Could not fetch forecast.");
      }
    } else {
      setError("Free API only allows forecast up to 5 days ahead.");
    }
    setLoading(false);
    setLocation("");
    setDate("");
  };

  // Helper for weather icon
  const getWeatherIcon = () => {
    if (data.weather && data.weather[0] && data.weather[0].icon) {
      return `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    }
    return null;
  };

  // Convert Fahrenheit to Celsius
  const f2c = (f) => ((f - 32) * 5 / 9);
  // Get temp in F or C depending on showCelsius
  const displayTemp = (f) => {
    if (showCelsius) return `${Math.round(f2c(f))}°C`;
    return `${Math.round(f)}°F`;
  };

  return (
    <div className="sunset-bg">
      <div className="weather-app-card">
        <h2 className="weather-title">Weather App</h2>

        <div className="search-col">
          <input
            value={location}
            onChange={event => setLocation(event.target.value)}
            placeholder='Enter Location'
            type="text"
            className="input"
          />
          <input
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            placeholder="Select Date"
            className="input"
          />
          <button onClick={handleSearch} className="button" disabled={loading}>
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>
        <div style={{textAlign:"center", marginTop:"4px"}}>
          <button
            className="unit-toggle"
            onClick={() => setShowCelsius(v => !v)}
            style={{
              background: showCelsius
                ? "linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)"
                : "linear-gradient(90deg, #fc4a1a 0%, #f7b733 100%)"
            }}
          >
            {showCelsius ? "Show °F" : "Show °C"}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}

        <div className="weather-container">
          {data.name && (
            <>
              <div className="weather-top">
                <div className="location">
                  <h3>{data.name}</h3>
                </div>
                <div className="temp">
                  {typeof data.temp !== "undefined" ? (
                    <h1>{displayTemp(data.temp)}</h1>
                  ) : data.main && typeof data.main.temp !== "undefined" ? (
                    <h1>{displayTemp(data.main.temp)}</h1>
                  ) : null}
                </div>
                <div className="description">
                  {getWeatherIcon() && (
                    <img
                      src={getWeatherIcon()}
                      alt={data.weather[0].main}
                      className="weather-icon"
                    />
                  )}
                  {data.weather ? <p>{data.weather[0].main}</p> : null}
                </div>
              </div>
              <div className="weather-bottom">
                <div className="weather-info">
                  <span className="label">Feels Like</span>
                  {typeof data.feels_like !== "undefined" ? (
                    <span className="value">{displayTemp(data.feels_like)}</span>
                  ) : data.main && typeof data.main.feels_like !== "undefined" ? (
                    <span className="value">{displayTemp(data.main.feels_like)}</span>
                  ) : null}
                </div>
                <div className="weather-info">
                  <span className="label">Humidity</span>
                  {typeof data.humidity !== "undefined" ? (
                    <span className="value">{data.humidity}%</span>
                  ) : data.main && typeof data.main.humidity !== "undefined" ? (
                    <span className="value">{data.main.humidity}%</span>
                  ) : null}
                </div>
                <div className="weather-info">
                  <span className="label">Wind Speed</span>
                  {data.wind && typeof data.wind.speed !== "undefined" ? (
                    <span className="value">{Math.round(data.wind.speed)} MPH</span>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        .sunset-bg {
          min-height: 100vh;
          width: 100vw;
          background: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=80') center center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', sans-serif;
          position: relative;
        }
        .sunset-bg::before {
          content: '';
          position: absolute;
          width: 100vw;
          height: 100vh;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(120deg, rgba(247,183,51,0.32) 0%, rgba(252,74,26,0.34) 35%, rgba(71,118,230,0.17) 100%);
          z-index: 0;
        }
        .weather-app-card {
          background: rgba(255,255,255,0.93);
          border-radius: 20px;
          padding: 2.5rem 2rem 2rem 2rem;
          min-width: 340px;
          max-width: 380px;
          box-shadow: 0 6px 36px 0 rgba(0,0,0,0.13);
          position: relative;
          z-index: 1;
        }
        .weather-title {
          text-align: center;
          color: #222e50;
          margin-bottom: 1.5rem;
          letter-spacing: 1px;
        }
        .search-col {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-bottom: 1.3rem;
        }
        .input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #b2bec3;
          border-radius: 8px;
          font-size: 1rem;
        }
        .button {
          background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.7rem 1rem;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 1.08rem;
          font-weight: 600;
          box-shadow: 0 2px 8px 0 rgba(33,147,176,0.11);
        }
        .button:disabled {
          background: #7f8fa6;
          cursor: not-allowed;
        }
        .unit-toggle {
          margin-top: 0.25rem;
          border: none;
          border-radius: 8px;
          padding: 0.4rem 1.1rem;
          color: #fff;
          font-size: 0.97rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 8px 0 rgba(252,74,26,0.09);
          transition: background 0.2s;
        }

        .error-message {
          color: #e74c3c;
          background: #fdecec;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 0.97rem;
        }
        .weather-container {
          margin-top: 1.5rem;
        }
        .weather-top {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .location h3 {
          margin: 0 0 0.5rem 0;
          color: #222e50;
          font-size: 1.3rem;
          font-weight: 600;
        }
        .temp h1 {
          margin: 0;
          color: #2193b0;
          font-size: 2.7rem;
          font-weight: 700;
        }
        .description {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .weather-icon {
          width: 64px;
          height: 64px;
        }
        .weather-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
          gap: 0.6rem;
        }
        .weather-info {
          flex: 1;
          background: #e1ecf7;
          border-radius: 8px;
          padding: 0.7rem 0.6rem;
          text-align: center;
        }
        .label {
          color: #222e50;
          font-size: 0.98rem;
          display: block;
          margin-bottom: 0.17rem;
        }
        .value {
          font-size: 1.15rem;
          font-weight: 600;
          color: #2193b0;
        }
        @media (max-width: 480px) {
          .weather-app-card {
            min-width: 90vw;
            padding: 1.3rem 0.5rem;
          }
          .weather-bottom {
            flex-direction: column;
            gap: 0.7rem;
          }
          .temp h1 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}

export default WeatherApp;
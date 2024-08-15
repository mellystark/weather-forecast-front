import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./WeatherApp.css";
import sun from "./assets/sun.png";
import humidity from "./assets/humidity.png";
import wind from "./assets/wind.png";
import clouds from "./assets/clouds.png";
import water from "./assets/water.png";
import search from "./assets/search.png";
import cloudy_sun from "./assets/cloudy_sun.png";
import rainy from "./assets/rainy.png";
import snowing from "./assets/snowing.png";

const WeatherApp = () => {
  const [city, setCity] = useState("izmir");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(sun);
  const navigate = useNavigate();

  useEffect(() => {
    // Başlangıçta hava durumunu getir
    fetchWeather(); 

    const intervalId = setInterval(() => {
      fetchWeather();
    }, 900000); 

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7110/api/WeatherData/${city}`
      );
      setWeatherData(response.data);
      setWeatherIcon(getWeatherIcon(response.data));
      setError("");
    } catch (err) {
      setError("Hava durumu verisi alınamadı. Şehir adını kontrol edin.");
      setWeatherData(null);
    }
  };

  const getWeatherIcon = (weatherData) => {
    const { rain, temperature, clouds } = weatherData;

    if (rain > 50 && temperature <= 0) {
      return snowing;
    } else if (rain > 50) {
      return rainy;
    } else if (temperature <= 0) {
      return snowing;
    } else if (clouds > 50 && rain > 50) {
      return rainy;
    } else if (clouds > 50) {
      return cloudy_sun;
    } else {
      return sun;
    }
  };

  const handleWeatherDataClick = () => {
    if (weatherData.city.name) {
      navigate(`/all-weather/${weatherData.city.name}`);
    } else {
      setError("Hata");
    }
  };

  return (
    <div className="appContainer">
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Şehir ismini girin"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            marginRight: "10px",
            width: "450px",
          }}
        />
        <button
          onClick={fetchWeather}
          style={{
            padding: "10px",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={search}
            alt="Arama"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
        </button>
      </div>
      <div className="box">
         {error && <p style={{ color: "red" }}>{error}</p>}
        {weatherData && (
          <div>
            <div className="infoContainer">
              <img src={weatherIcon} alt="Weather Icon" className="icon" />
              <div className="details">
                <p>{new Date(weatherData.dateTime).toLocaleString()}</p>
                <h2>{weatherData.city.name}</h2>
                <p>Sıcaklık: {weatherData.temperature} °C</p>
              </div>
            </div>
            <div className="additionalInfo">
              <div className="smallBox">
                <p>Nem:</p>
                <img
                  src={humidity}
                  alt="Nem İkonu"
                  style={{ width: "30px", height: "30px", marginBottom: "0px" }}
                />
                 <p>{weatherData.humidity} %</p>
              </div>
              <div className="smallBox">
               <p>Rüzgar:</p>
                <img
                  src={wind}
                  alt="Rüzgar İkonu"
                  style={{ width: "30px", height: "30px", marginBottom: "0px" }}
                />
               <p>{weatherData.windspeed} km/h</p>
              </div>
              <div className="smallBox">
              <p>Bulut:</p>
                <img
                  src={clouds}
                  alt="Bulut İkonu"
                  style={{ width: "30px", height: "30px", marginBottom: "0px" }}
                />
              <p>{weatherData.clouds} %</p>
              </div>
              
              <div className="smallBox">
                <p>Yağış:</p>
                <img
                  src={water}
                  alt="Yağış İkonu"
                  style={{ width: "30px", height: "30px", marginBottom: "0px" }}
                />
               <p>{weatherData.rain} mm</p>
              </div>
            </div>
            <button
              onClick={handleWeatherDataClick}
              style={{
                marginTop: "60px",
                marginLeft: "500px",
                backgroundColor: "lightblue",
                borderColor: "transparent",
                borderRadius: "10px",
              }}
            >
             Tüm Verileri Göster
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;

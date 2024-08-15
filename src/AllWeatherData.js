import React, { useEffect, useState } from "react";
import axios from "axios";
import sun from "./assets/sun.png";
import cloudy_sun from "./assets/cloudy_sun.png";
import rainy from "./assets/rainy.png";
import snowing from "./assets/snowing.png";
import { useParams } from "react-router-dom";

const AllWeatherData = () => {
  const [weatherDataList, setWeatherDataList] = useState([]);
  const [error, setError] = useState("");
  const { city } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log("city:", city);
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7110/api/WeatherData/city/${city}/page/${currentPage}/size/10`
        );
        setWeatherDataList(response.data.data);
        console.log(response.data);
        setTotalPages(Math.ceil(response.data.totalCount / 10)); 
      } catch (err) {
        setError("Veriler alınamadı. Lütfen tekrar deneyin.");
      }
    };

    fetchWeatherData();
  }, [city, currentPage]);

  const handlePreviousPage = () => {
    if(currentPage > 1){
        setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if(currentPage < totalPages){
        setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="background">
      <h1>{city} için Hava Durumu Verileri</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Sıcaklık</th>
            <th>Nem</th>
            <th>Rüzgar</th>
            <th>Bulut</th>
            <th>Yağış</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>
          {weatherDataList.map((data, index) => (
            <tr key={index}>
              <td>
                <img
                  src={getWeatherIcon(data)}
                  alt="Weather Icon"
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>{data.temperature} °C</td>
              <td>{data.humidity} %</td>
              <td>{data.windspeed} km/h</td>
              <td>{data.clouds} %</td>
              <td>{data.rain} mm</td>
              <td>{new Date(data.dateTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>Önceki</button>
      <span> Sayfa {currentPage} / {totalPages} </span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>Sonraki</button>
    </div>
    </div>
  );
};

const getWeatherIcon = (weatherData) => {
  const { rain, temperature, clouds } = weatherData;

  // Hava durumu ikonlarını döndüren fonksiyon
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

export default AllWeatherData;

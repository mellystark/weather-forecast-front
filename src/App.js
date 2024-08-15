// src/App.js
import React from 'react';
import WeatherApp from './WeatherApp'; 
import AllWeatherData from './AllWeatherData';
import { Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <Routes>
        <Route path="/" element={<WeatherApp />} />
        <Route path="/all-weather/:city" element={<AllWeatherData />} />
      </Routes>
      );
};

export default App; 

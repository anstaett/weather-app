import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './index.css';


const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState('C'); // C for Celsius, F for Fahrenheit
    const handleChange = (e) => {
        setCity(e.target.value);
    };
    const toggleSwitchRef = useRef(null);  // reference to the toggle switch element

    const resizeFont = () => {
        if (toggleSwitchRef.current) {
            const { offsetWidth, offsetHeight } = toggleSwitchRef.current;
            const fontSize = Math.min(offsetWidth, offsetHeight) * 0.3;  // 30% of the smaller dimension
            toggleSwitchRef.current.style.fontSize = `${fontSize}px`;
        }
    }

    // Call resizeFont when component mounts
    useEffect(() => {
        resizeFont();
    }, []);

    // Update the font size when the window is resized
    useEffect(() => {
        window.addEventListener('resize', resizeFont);

        // Clean up after the effect:
        return () => {
            window.removeEventListener('resize', resizeFont);
        };
    }, []);



    const getWeatherData = async (e) => {
        e.preventDefault(); // prevent the form from refreshing the page
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a4d2302b889f2c9fd1b93b092d7fa03e`);
            setWeather(response.data);
            setError(null); // If successful, clear any previous error
        } catch (error) {
            console.error(error);
            setError('Unable to retrieve weather data. Please check your city name.'); // Set error message
            setWeather(null); // Clear any previous weather data
        }
        setCity(''); // Clear the input field
        e.target.elements.city.blur(); // Remove focus from the input field

    };

    // Toggle between Celsius and Fahrenheit
    const toggleUnit = () => {
        setUnit(unit === 'C' ? 'F' : 'C');
    };

    // Convert Kelvin to Celsius or Fahrenheit
    const convertTemperature = (kelvin) => {
        return unit === 'C' ? Math.round(kelvin - 273.15) : Math.round((kelvin - 273.15) * 9 / 5 + 32);
    };

    return (

        <div className="weather-container">
            <div className="spacer"></div>
            <div className="spacer"></div>
            <h1>Retro Weather App</h1>
            <h2>By Henry Anstaett</h2>
            <div className="spacer"></div>
            <div className="spacer"></div>
            <div className="spacer"></div>
            <form onSubmit={getWeatherData}>
                <input type="text" name="city" className='input' value={city} onChange={handleChange} placeholder="Enter city name here" />
                <div className="spacer"></div>
                <button className='search' type="submit">Search</button>
            </form>
            <div className="spacer"></div>
            <label className="switch" ref={toggleSwitchRef}>
                <input type="checkbox" onClick={toggleUnit} />
                <span className="slider">
                    <span className="slider-text fahrenheit">C°</span>
                    <span className="slider-text celsius">F°</span>
                </span>
            </label>
            <div className="spacer"></div>
            <div className="spacer"></div>
            {weather && (
                <div className='info'>
                    <h3>{weather.name}</h3>
                    <h4>{weather.weather[0].description}</h4>
                    <p>{convertTemperature(weather.main.temp)}°{unit}</p>
                </div>
            )}
            {error && (
                <div className='error'>
                    <div className="spacer"></div>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default Weather;

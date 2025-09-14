import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  AlertTriangle,
  MapPin,
  RefreshCw 
} from 'lucide-react';
import axios from 'axios';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  icon: string;
}

interface ForecastDay {
  date: string;
  temp: { min: number; max: number };
  description: string;
  humidity: number;
  icon: string;
}

const Weather: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [location, setLocation] = useState('Delhi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const alerts = [
    {
      type: 'warning',
      title: 'Heavy Rainfall Expected',
      description: 'Rainfall of 50-75mm expected in the next 24 hours. Consider postponing irrigation.',
      icon: CloudRain,
      color: 'yellow',
    },
    {
      type: 'info',
      title: 'Optimal Spraying Conditions',
      description: 'Wind speed and humidity are ideal for pesticide application between 6-9 AM.',
      icon: Wind,
      color: 'blue',
    },
  ];

  // Mock weather data for demonstration
  const mockWeatherData: WeatherData = {
    city: location,
    temperature: 28,
    description: 'Partly cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 8,
    pressure: 1013,
    icon: 'partly-cloudy',
  };

  const mockForecast: ForecastDay[] = [
    {
      date: 'Today',
      temp: { min: 22, max: 30 },
      description: 'Partly cloudy',
      humidity: 65,
      icon: 'partly-cloudy',
    },
    {
      date: 'Tomorrow',
      temp: { min: 20, max: 28 },
      description: 'Light rain',
      humidity: 78,
      icon: 'rainy',
    },
    {
      date: 'Day 3',
      temp: { min: 24, max: 32 },
      description: 'Sunny',
      humidity: 45,
      icon: 'sunny',
    },
    {
      date: 'Day 4',
      temp: { min: 23, max: 29 },
      description: 'Cloudy',
      humidity: 70,
      icon: 'cloudy',
    },
    {
      date: 'Day 5',
      temp: { min: 21, max: 27 },
      description: 'Heavy rain',
      humidity: 85,
      icon: 'heavy-rain',
    },
  ];

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');

    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        // Use mock data if no API key
        setTimeout(() => {
          setCurrentWeather(mockWeatherData);
          setForecast(mockForecast);
          setLoading(false);
        }, 1000);
        return;
      }

      // Real API call (if API key is provided)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
      );

      setCurrentWeather({
        city: response.data.name,
        temperature: Math.round(response.data.main.temp),
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(response.data.visibility / 1000),
        pressure: response.data.main.pressure,
        icon: response.data.weather[0].icon,
      });

      // Process forecast data (take one per day)
      const dailyForecast = forecastResponse.data.list
        .filter((_: any, index: number) => index % 8 === 0) // Every 8th item (24 hours)
        .slice(0, 5)
        .map((item: any, index: number) => ({
          date: index === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: {
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max),
          },
          description: item.weather[0].description,
          humidity: item.main.humidity,
          icon: item.weather[0].icon,
        }));

      setForecast(dailyForecast);
    } catch (err) {
      setError('Failed to fetch weather data. Using demo data.');
      setCurrentWeather(mockWeatherData);
      setForecast(mockForecast);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('sun') || iconCode === '01d') return Sun;
    if (iconCode.includes('rain') || iconCode.startsWith('09') || iconCode.startsWith('10')) return CloudRain;
    return Cloud;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return 'text-red-600';
    if (temp >= 25) return 'text-orange-500';
    if (temp >= 15) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Weather Forecast & Alerts</h1>
          <p className="text-lg text-gray-600">
            Real-time weather updates and agricultural risk alerts for your farm
          </p>
        </div>

        {/* Location Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchWeatherData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Weather</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin mx-auto h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-600">Loading weather data...</p>
              </div>
            ) : currentWeather ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentWeather.city}</h3>
                    <p className="text-gray-600 capitalize">{currentWeather.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getTemperatureColor(currentWeather.temperature)}`}>
                      {currentWeather.temperature}°C
                    </div>
                    <div className="flex justify-end mt-2">
                      {React.createElement(getWeatherIcon(currentWeather.icon), { 
                        className: "h-12 w-12 text-blue-500" 
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">{currentWeather.humidity}%</div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Wind className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">{currentWeather.windSpeed} km/h</div>
                    <div className="text-sm text-gray-600">Wind Speed</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <Eye className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">{currentWeather.visibility} km</div>
                    <div className="text-sm text-gray-600">Visibility</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <Thermometer className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">{currentWeather.pressure} hPa</div>
                    <div className="text-sm text-gray-600">Pressure</div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>

          {/* Weather Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Farm Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.color === 'yellow' 
                      ? 'bg-yellow-50 border-yellow-400' 
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-start">
                    <alert.icon className={`h-5 w-5 mr-3 mt-0.5 ${
                      alert.color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{alert.title}</h3>
                      <p className="text-sm text-gray-700">{alert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 5-Day Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">5-Day Forecast</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900 mb-2">{day.date}</div>
                <div className="flex justify-center mb-3">
                  {React.createElement(getWeatherIcon(day.icon), { 
                    className: "h-8 w-8 text-blue-500" 
                  })}
                </div>
                <div className="text-sm text-gray-600 capitalize mb-2">{day.description}</div>
                <div className="space-y-1">
                  <div className="flex justify-center space-x-2">
                    <span className="font-semibold text-gray-900">{day.temp.max}°</span>
                    <span className="text-gray-500">{day.temp.min}°</span>
                  </div>
                  <div className="text-xs text-gray-500">💧 {day.humidity}%</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Weather;

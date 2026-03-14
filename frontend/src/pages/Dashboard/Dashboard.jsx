import React, { useState } from "react";
import toast from "react-hot-toast";
import { getWeather } from "../../services/weatherService";
import FarmMap from "../../components/FarmMap";
import FarmSatellite from "../../components/FarmSatellite";

const Dashboard = () => {
  const [form, setForm] = useState({
    crop_type: "",
    farm_size: "",
    soil_type: "Loamy",
    latitude: "",
    longitude: ""
  });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setForm((prev) => ({ ...prev, latitude: lat, longitude: lon }));
        toast.success("GPS location captured");

        try {
          const weatherData = await getWeather(lat, lon);
          setWeather(weatherData);
        } catch {
          toast.error("Weather data unavailable");
        }
      },
      () => toast.error("Unable to retrieve location")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const farm_size = parseFloat(form.farm_size);
    const latitude = parseFloat(form.latitude);
    const longitude = parseFloat(form.longitude);

    if (!form.crop_type || isNaN(farm_size) || isNaN(latitude) || isNaN(longitude)) {
      toast.error("Please fill all fields correctly");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        crop_type: form.crop_type,
        farm_size,
        soil_type: form.soil_type,
        latitude,
        longitude
      };
      console.log("Submitting:", payload);
      toast.success("Farm profile created");
    } catch {
      toast.error("Submission failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center"
      style={{
        backgroundImage: "url('/dashhboard.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-5xl px-6 py-10 space-y-12">

        {/* HEADER */}
        <header className="text-center mb-10">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-wide">
            🌱 AgriAI Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="mt-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
          >
            Logout
          </button>
        </header>

        {/* WEATHER STATS */}
        <div className="grid grid-cols-4 gap-6 text-center">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-xl shadow text-white">
            <p className="text-sm font-semibold">Temperature</p>
            <h2 className="text-2xl font-bold">{weather ? `${weather.main.temp} °C` : "18.19 °C"}</h2>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl shadow text-white">
            <p className="text-sm font-semibold">Humidity</p>
            <h2 className="text-2xl font-bold">{weather ? `${weather.main.humidity}%` : "87%"}</h2>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-xl shadow text-white">
            <p className="text-sm font-semibold">Wind Speed</p>
            <h2 className="text-2xl font-bold">{weather ? `${weather.wind.speed} km/h` : "2.9 km/h"}</h2>
          </div>
          <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 p-6 rounded-xl shadow text-white">
            <p className="text-sm font-semibold">Weather</p>
            <h2 className="text-2xl font-bold">{weather ? weather.weather[0].main : "Rain"}</h2>
          </div>
        </div>

        {/* REGISTER FARM */}
        <div className="bg-white p-10 rounded-2xl shadow max-w-md mx-auto">
          <h2 className="text-4xl font-extrabold text-green-700 text-center mb-8 tracking-wide">
            Register Farm Field
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
            <input
              name="crop_type"
              placeholder="Crop Type (e.g Maize)"
              value={form.crop_type}
              onChange={handleChange}
              className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm w-full max-w-xs mx-auto"
            />
            <input
              name="farm_size"
              placeholder="Farm Size (hectares)"
              value={form.farm_size}
              onChange={handleChange}
              className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm w-full max-w-xs mx-auto"
            />
            <select
              name="soil_type"
              value={form.soil_type}
              onChange={handleChange}
              className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm w-full max-w-xs mx-auto"
            >
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Clay">Clay</option>
            </select>
            <button
              type="button"
              onClick={getLocation}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 py-3 rounded-xl shadow-sm w-full max-w-xs mx-auto font-semibold transition-transform hover:scale-105"
            >
              📍 Capture GPS Location
            </button>
            <input
              name="latitude"
              placeholder="Latitude"
              value={form.latitude}
              onChange={handleChange}
              className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm w-full max-w-xs mx-auto"
            />
            <input
              name="longitude"
              placeholder="Longitude"
              value={form.longitude}
              onChange={handleChange}
              className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm w-full max-w-xs mx-auto"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white py-4 rounded-xl font-semibold mt-4 w-full max-w-xs mx-auto transition-transform hover:scale-105"
            >
              {loading ? "Creating..." : "Create Field Profile"}
            </button>
          </form>
        </div>

        {/* SATELLITE MONITORING */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 tracking-wide">
            🌍 Satellite Crop Monitoring
          </h2>
          <FarmSatellite lat={form.latitude} lon={form.longitude} />
        </div>

        {/* MAP */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-purple-700 mb-6 tracking-wide">
            Farm Map
          </h2>
          <FarmMap lat={form.latitude} lon={form.longitude} />
        </div>

        {/* ANALYTICS (SVG Placeholders) */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-pink-600 mb-6 tracking-wide">
            Farm Analytics
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Line Chart SVG */}
            <div className="bg-white rounded-xl shadow p-4 w-64 h-64 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold mb-2 text-center">Temperature Trend</h3>
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <polyline
                  points="10,150 40,120 70,130 100,90 130,100 160,70 190,80"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                <line x1="10" y1="150" x2="10" y2="10" stroke="#6b7280" strokeWidth="1" />
                <line x1="10" y1="150" x2="190" y2="150" stroke="#6b7280" strokeWidth="1" />
              </svg>
            </div>

            {/* Pie Chart SVG */}
            <div className="bg-white rounded-xl shadow p-4 w-64 h-64 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold mb-2 text-center">Wind Distribution</h3>
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="#facc15" stroke="#ffffff" strokeWidth="2" strokeDasharray="50 150"/>
                <circle cx="100" cy="100" r="80" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" strokeDasharray="80 120" transform="rotate(-50 100 100)" />
                <circle cx="100" cy="100" r="80" fill="#10b981" stroke="#ffffff" strokeWidth="2" strokeDasharray="70 130" transform="rotate(-130 100 100)" />
              </svg>
            </div>
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="text-center bg-gradient-to-br from-green-700 to-green-500 text-white p-8 rounded-2xl shadow">
          <h2 className="text-4xl font-extrabold mb-6 tracking-wide">
            AI Farm Insights
          </h2>
          <ul className="space-y-2 text-sm font-semibold">
            <li>🌱 Soil condition: Suitable for maize & wheat</li>
            <li>☁ Weather outlook: Favorable rainfall expected</li>
            <li>💧 Irrigation recommendation: Moderate watering</li>
            <li>🚜 Yield prediction: 4.5 tons/hectare</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
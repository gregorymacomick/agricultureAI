import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { getWeather } from "../../services/weatherService";
import FarmMap from "../../components/FarmMap";
import FarmSatellite from "../../components/FarmSatellite";

const Dashboard = () => {
  const [form, setForm] = useState({
    crop_type: "",
    farm_size: "",
    soil_type: "Loamy",
    latitude: "",
    longitude: "",
    editingId: null, // ← new: track if editing
  });

  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null); // ← for focused view
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingProfiles, setFetchingProfiles] = useState(true);

  // Fetch profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get("/farm-profiles");
        setProfiles(res.data);
        if (res.data.length > 0) {
          setSelectedProfile(res.data[0]); // auto-select first one
        }
      } catch (err) {
        toast.error("Could not load farm profiles");
      } finally {
        setFetchingProfiles(false);
      }
    };
    fetchProfiles();
  }, []);

  // Fetch weather when selected profile changes
  useEffect(() => {
    if (selectedProfile) {
      fetchWeatherForProfile(selectedProfile);
    }
  }, [selectedProfile]);

  const fetchWeatherForProfile = async (profile) => {
    try {
      const weatherData = await getWeather(profile.latitude, profile.longitude);
      setWeather(weatherData);
    } catch {
      toast.error("Weather unavailable for this location");
      setWeather(null);
    }
  };

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
        toast.success("GPS captured");

        try {
          const weatherData = await getWeather(lat, lon);
          setWeather(weatherData);
        } catch {
          toast.error("Weather unavailable");
        }
      },
      () => toast.error("Location access denied")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const farm_size = parseFloat(form.farm_size);
    const latitude = parseFloat(form.latitude);
    const longitude = parseFloat(form.longitude);

    if (!form.crop_type || isNaN(farm_size) || isNaN(latitude) || isNaN(longitude)) {
      toast.error("Fill all fields correctly");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        crop_type: form.crop_type,
        farm_size,
        soil_type: form.soil_type,
        latitude,
        longitude,
      };

      let response;
      if (form.editingId) {
        // For edit: we re-use POST for simplicity (or change to PUT later)
        response = await api.post(`/farm-profile`, { ...payload, id: form.editingId });
        toast.success("Farm profile updated!");
      } else {
        response = await api.post("/farm-profile", payload);
        toast.success("Farm profile created!");
      }

      // Refresh list
      const res = await api.get("/farm-profiles");
      setProfiles(res.data);

      // If editing, update selected if it matches
      if (form.editingId) {
        const updated = res.data.find(p => p.id === form.editingId);
        if (updated) setSelectedProfile(updated);
      } else if (res.data.length > 0) {
        setSelectedProfile(res.data[res.data.length - 1]); // select new one
      }

      // Reset form
      setForm({
        crop_type: "",
        farm_size: "",
        soil_type: "Loamy",
        latitude: "",
        longitude: "",
        editingId: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile) => {
    setForm({
      crop_type: profile.crop_type,
      farm_size: profile.farm_size.toString(),
      soil_type: profile.soil_type || "Loamy",
      latitude: profile.latitude.toString(),
      longitude: profile.longitude.toString(),
      editingId: profile.id,
    });
    setSelectedProfile(profile); // focus on it
    toast("Editing mode – update & save");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this farm profile?")) return;

    try {
      await api.delete(`/farm-profile/${id}`);
      toast.success("Profile deleted");

      const updated = profiles.filter(p => p.id !== id);
      setProfiles(updated);

      if (selectedProfile?.id === id) {
        setSelectedProfile(updated.length > 0 ? updated[0] : null);
        setWeather(null);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const aiInsights = [
    "Soil condition looks optimal for maize & beans – pH likely 6.0–7.0",
    "Expected yield: 4.2–5.1 tons/ha with current weather pattern",
    "Moderate irrigation advised – next 72h rainfall probability 35%",
    "Pest risk low – monitor for fall armyworm after day 45",
    "Recommendation: Apply NPK 20-10-10 at 150 kg/ha during vegetative stage"
  ];

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
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-6xl px-6 py-10 space-y-16">

        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg">
            🌱 AgriAI Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="mt-6 bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        </header>

        {/* WEATHER STATS – now based on selected farm */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gradient-to-br from-blue-500/80 to-cyan-600/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-white border border-white/20">
            <p className="text-sm font-medium">Temperature</p>
            <h2 className="text-3xl font-bold">{weather ? `${weather.main.temp} °C` : "—"}</h2>
          </div>
          <div className="bg-gradient-to-br from-green-500/80 to-emerald-600/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-white border border-white/20">
            <p className="text-sm font-medium">Humidity</p>
            <h2 className="text-3xl font-bold">{weather ? `${weather.main.humidity}%` : "—"}</h2>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/80 to-amber-600/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-white border border-white/20">
            <p className="text-sm font-medium">Wind Speed</p>
            <h2 className="text-3xl font-bold">{weather ? `${weather.wind.speed} km/h` : "—"}</h2>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/80 to-violet-600/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-white border border-white/20">
            <p className="text-sm font-medium">Condition</p>
            <h2 className="text-3xl font-bold">{weather ? weather.weather[0].main : "—"}</h2>
          </div>
        </div>

        {/* REGISTER / EDIT FARM */}
        <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-lg mx-auto border border-green-100">
          <h2 className="text-4xl font-extrabold text-green-800 text-center mb-8">
            {form.editingId ? "Edit Farm Profile" : "Register New Farm"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input name="crop_type" placeholder="Crop Type (e.g. Maize)" value={form.crop_type} onChange={handleChange} className="border-2 border-green-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-green-400 outline-none shadow-sm" required />
            <input name="farm_size" type="number" placeholder="Farm Size (hectares)" value={form.farm_size} onChange={handleChange} className="border-2 border-green-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-green-400 outline-none shadow-sm" required />
            <select name="soil_type" value={form.soil_type} onChange={handleChange} className="border-2 border-green-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-green-400 outline-none shadow-sm bg-white">
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Clay">Clay</option>
            </select>
            <button type="button" onClick={getLocation} className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white py-4 rounded-2xl font-bold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all">
              📍 Get Current GPS
            </button>
            <div className="grid grid-cols-2 gap-4">
              <input name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} className="border-2 border-green-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-green-400 outline-none shadow-sm" required readOnly />
              <input name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} className="border-2 border-green-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-green-400 outline-none shadow-sm" required readOnly />
            </div>
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300">
              {loading ? "Saving..." : form.editingId ? "Update Profile" : "Create Profile"}
            </button>
          </form>
        </div>

        {/* SAVED FARMS – Sleek Cards */}
        <div className="space-y-8">
          <h2 className="text-4xl font-extrabold text-white text-center drop-shadow-md">Your Farms</h2>

          {fetchingProfiles ? (
            <p className="text-center text-white/80">Loading farms...</p>
          ) : profiles.length === 0 ? (
            <p className="text-center text-white/70 italic">No farms registered yet – add your first one above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl hover:scale-[1.03] transition-all duration-300 cursor-pointer overflow-hidden ${selectedProfile?.id === profile.id ? 'ring-4 ring-green-400/70 scale-[1.02]' : ''}`}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
                    {profile.crop_type}
                  </h3>
                  <div className="space-y-2 text-white/90">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Size:</span> {profile.farm_size} ha
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Soil:</span> {profile.soil_type || "—"}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">Coords:</span> {profile.latitude.toFixed(4)}° , {profile.longitude.toFixed(4)}°
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(profile); }}
                      className="flex-1 bg-blue-600/80 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }}
                      className="flex-1 bg-red-600/80 hover:bg-red-700 text-white py-2.5 rounded-xl font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SATELLITE + MAP – for selected farm */}
        {selectedProfile && (
          <>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-indigo-300 drop-shadow-lg">🌍 Satellite View – {selectedProfile.crop_type}</h2>
              <FarmSatellite lat={selectedProfile.latitude} lon={selectedProfile.longitude} />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-purple-300 drop-shadow-lg">📍 Farm Location</h2>
              <FarmMap lat={selectedProfile.latitude} lon={selectedProfile.longitude} />
            </div>
          </>
        )}

        {/* FARM ANALYTICS AI – Moving Text Ticker */}
        <div className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-green-400/30 overflow-hidden">
          <h2 className="text-4xl font-extrabold text-green-200 text-center mb-6 drop-shadow-md">
            🤖 AI Farm Analytics & Insights
          </h2>

          <div className="relative">
            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-marquee py-4 text-xl font-medium text-green-100">
                {aiInsights.map((insight, i) => (
                  <span key={i} className="mx-12">
                    • {insight}
                  </span>
                ))}
                {/* Duplicate for seamless loop */}
                {aiInsights.map((insight, i) => (
                  <span key={`dup-${i}`} className="mx-12">
                    • {insight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
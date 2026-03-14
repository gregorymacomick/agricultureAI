import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import { Toaster } from 'react-hot-toast';

import Register from "./pages/Auth/Register"; 
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        
        <Route path="*" element={<div className="text-white">Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
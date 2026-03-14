import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
});

// Automatically attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log("Token in Storage:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Full Auth Header:", config.headers.Authorization);
  }
  return config;
});

export default apiClient;
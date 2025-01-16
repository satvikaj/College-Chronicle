// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/auth',  // Replace with the URL of your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
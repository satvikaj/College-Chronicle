import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // General API routes (e.g., studentinfo, posts, etc.)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
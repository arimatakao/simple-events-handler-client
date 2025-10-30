import axios from 'axios';

// Base axios instance for communicating with the Go backend.
// Defaults to http://localhost:8080/api but can be overridden with
// REACT_APP_API_BASE_URL in a .env file.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;

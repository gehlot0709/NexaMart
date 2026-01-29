import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios';

// Set the base URL for axios requests
// In development, this will be strictly ignored if using proxy, but good for production
// However, to make it work seamlessly with the proxy in dev and Vercel in prod:
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
});

// ✳️ Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✳️ Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            console.warn("Unauthorized — redirecting to login...");
            // logout(); // npr. briše token i redirect
            window.location.href = "/login";
        }

        if (status === 403) {
            console.warn("Forbidden");
        }

        return Promise.reject(error);
    }
);

export default api;

import axios from 'axios';

const apiClientPublic = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClientPublic; 
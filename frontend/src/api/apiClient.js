import axios from 'axios';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
    baseURL: 'http://localhost:8084/api', // This is, like, where our backend lives.
    headers: {
        'Content-Type': 'application/json'
    }
});

// This is, like, a super smart interceptor!
// It, like, checks if we have a token and, like, adds it to the headers. So cool.
apiClient.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient; 
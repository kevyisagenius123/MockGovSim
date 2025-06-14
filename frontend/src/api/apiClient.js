import axios from 'axios';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://agile-crag-41434-380373ddbfd4.herokuapp.com/api',
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
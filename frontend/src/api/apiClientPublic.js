import axios from 'axios';

const apiClientPublic = axios.create({
    baseURL: 'http://localhost:8084/api',
});

export default apiClientPublic; 
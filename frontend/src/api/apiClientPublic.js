import axios from 'axios';

const apiClientPublic = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClientPublic; 
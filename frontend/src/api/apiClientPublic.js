import axios from 'axios';

const apiClientPublic = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://agile-crag-41434-380373ddbfd4.herokuapp.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClientPublic; 
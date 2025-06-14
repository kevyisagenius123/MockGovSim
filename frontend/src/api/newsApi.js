import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// In a real app, you would intercept requests to add the auth token
// apiClient.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export const createNewsAgency = (agencyData) => {
    return apiClient.post('/news/agencies', agencyData);
};

export const createArticle = (articleData) => {
    return apiClient.post('/news/articles', articleData);
};

export const getArticles = (params) => {
    return apiClient.get('/news/articles', { params });
};

export const getArticleById = (articleId) => {
    return apiClient.get(`/news/articles/${articleId}`);
};

export const getCommentsForArticle = (articleId) => {
    return apiClient.get(`/articles/${articleId}/comments`);
};

export const createComment = (commentData) => {
    return apiClient.post('/comments', commentData);
};

export const getNewsAgencies = (params) => {
    return apiClient.get('/news/agencies', { params });
};

export const getDetailedStateResults = (stateCode) => {
    return apiClient.get(`/results/state/${stateCode}`);
};

export const getElectionNews = async () => {
    // ... existing code ...
}; 
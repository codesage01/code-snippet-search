import axios from 'axios';

const API_BASE = '/api'; 

const api = axios.create({ 
    baseURL: API_BASE, 
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const searchSnippets = (params) => api.get('/search', { params });
export const getSnippets = () => api.get('/snippets');
export const getSnippet = (id) => api.get(`/snippets/${id}`);
export const createSnippet = (data) => api.post('/snippets', data);
export const rateSnippet = (id, rating) => api.put(`/snippets/${id}/rate`, { rating });
export const favoriteSnippet = (id, sessionId) => api.put(`/snippets/${id}/favorite`, { sessionId });
export const getAISuggestion = (query, snippets) =>
    api.post('/ai/suggest', { query, snippets });

export default api;

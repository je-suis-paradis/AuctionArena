import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5147/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export const getAuctions = (search) => api.get('/auction', { params: { search } });
export const getAuction = (id) => api.get(`/auction/${id}`);
export const createAuction = (data) => api.post('/auction', data);
export const updateAuction = (id, data) => api.put(`/auction/${id}`, data);
export const deactivateAuction = (id) => api.delete(`/auction/${id}`);

export const getBids = (auctionId) => api.get(`/bid/auction/${auctionId}`);
export const placeBid = (auctionId, data) => api.post(`/bid/auction/${auctionId}`, data);
export const withdrawBid = (bidId) => api.delete(`/bid/${bidId}`);

export default api;

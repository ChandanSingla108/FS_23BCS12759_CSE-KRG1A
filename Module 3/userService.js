import api from './api';

// Add a new user
export const addUser = (userData) => api.post('/users/add', userData);

// Get all users
export const getAllUsers = () => api.get('/users/all');

// Get user by email
export const getUserByEmail = (email) => api.get(`/users/${email}`);

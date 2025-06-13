import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/apiClient';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: true,
            
            initializeAuth: () => {
                try {
                    const token = localStorage.getItem('authToken');
                    if (token) {
                        const decodedUser = jwtDecode(token);
                        if (decodedUser.exp * 1000 > Date.now()) {
                            set({ token, user: decodedUser, isAuthenticated: true, isLoading: false });
                            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        } else {
                            set({ token: null, user: null, isAuthenticated: false, isLoading: false });
                            localStorage.removeItem('authToken');
                        }
                    } else {
                        set({ isLoading: false });
                    }
                } catch (error) {
                    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
                }
            },
            
            // This is, like, how we register
            register: async (username, email, password) => {
                const response = await apiClient.post('/auth/register', { username, email, password });
                const { token } = response.data;
                const decodedUser = jwtDecode(token);
                
                set({ token, user: decodedUser, isAuthenticated: true });
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                localStorage.setItem('authToken', token);
            },
            
            // This is, like, how we log in
            login: async (username, password) => {
                const response = await apiClient.post('/auth/login', { username, password });
                const { token } = response.data;
                const decodedUser = jwtDecode(token);
                
                set({ token, user: decodedUser, isAuthenticated: true });
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                localStorage.setItem('authToken', token);
            },
            
            // And, like, this is how we log out. As if!
            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
                localStorage.removeItem('authToken');
                delete apiClient.defaults.headers.common['Authorization'];
            }
        }),
        {
            name: 'auth-storage', // The key in localStorage
            onRehydrateStorage: (state) => {
                // Like, when the page reloads, check if our token is still, like, valid
                const token = localStorage.getItem('authToken');
                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        if (decoded.exp * 1000 > Date.now()) {
                            state.token = token;
                            state.user = decoded;
                            state.isAuthenticated = true;
                        } else {
                           // Token is, like, so expired.
                           localStorage.removeItem('authToken');
                        }
                    } catch (e) {
                        // Like, whatever, token is bad.
                        localStorage.removeItem('authToken');
                    }
                }
            }
        }
    )
);

export default useAuthStore; 
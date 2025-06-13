import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import useAuthStore from './store/authStore';

function App() {
    const { initializeAuth, isLoading } = useAuthStore();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl text-primary">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-text-primary">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default App; 
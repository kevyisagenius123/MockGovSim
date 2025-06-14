// Cache bust v2.1.1 - 2025-06-14T06:45:00Z - Force complete rebuild
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import useAuthStore from './store/authStore';

// Force fresh deployment - v2.1 with enhanced error handling
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
        <ErrorBoundary>
            <div className="flex flex-col min-h-screen bg-background text-text-primary">
                <Header />
                <main className="flex-grow container mx-auto px-6 py-8">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </main>
            </div>
        </ErrorBoundary>
    );
}

export default App; 
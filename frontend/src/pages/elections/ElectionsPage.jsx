import React from 'react';
import ElectionTabs from './ElectionTabs';

const ElectionsPage = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Elections</h1>
                <p className="mt-2 text-lg text-text-secondary">
                    Explore upcoming, ongoing, and past elections. Participate, view results, and manage campaigns.
                </p>
            </header>
            
            <ElectionTabs />
        </div>
    );
};

export default ElectionsPage; 
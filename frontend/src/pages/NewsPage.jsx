import React from 'react';
import NewsSidebar from '../components/news/NewsSidebar';
import NewsGrid from '../components/news/NewsGrid';

// Hero component defined directly for simplicity, since file creation failed
const NewsHero = () => {
    return (
        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden h-96 mb-8 col-span-1 md:col-span-2 lg:col-span-3">
             <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative p-8 h-full flex flex-col justify-end">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">BREAKING NEWS</span>
                <h1 className="text-4xl font-extrabold text-white mt-4 shadow-lg">Massive Election Fraud Scandal Rocks the Nation</h1>
                <p className="text-gray-200 mt-2 text-lg">Sources inside the election commission have leaked documents suggesting widespread irregularities.</p>
            </div>
        </div>
    );
};


const NewsPage = () => {
    return (
        <div className="page-container news-page bg-background-darker text-text-primary">
            <header className="text-center py-8">
                <h1 className="text-5xl font-extrabold text-white tracking-tighter">MockGovSim News Network</h1>
                <p className="text-lg text-text-secondary mt-2">Your Most Trusted Source in Simulated Politics</p>
            </header>

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Main Content */}
                    <main className="w-full md:w-2/3 lg:w-3/4">
                        <NewsHero />
                        
                        <h2 className="text-3xl font-bold text-text-primary mb-6 border-b-2 border-accent pb-2">Top Stories</h2>
                        <NewsGrid />
                    </main>

                    {/* Sidebar */}
                    <NewsSidebar />
                </div>
            </div>
        </div>
    );
};

export default NewsPage; 
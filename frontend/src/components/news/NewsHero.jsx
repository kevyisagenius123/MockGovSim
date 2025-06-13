import React from 'react';

const NewsHero = () => {
    return (
        <div className="relative bg-background-light rounded-lg shadow-xl overflow-hidden h-96 mb-8">
            {/* Placeholder for an image */}
            <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
            <div className="relative p-8 h-full flex flex-col justify-end">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">BREAKING NEWS</span>
                <h1 className="text-4xl font-extrabold text-white mt-4">Massive Election Fraud Scandal Rocks the Nation</h1>
                <p className="text-gray-300 mt-2">Sources inside the election commission have leaked documents suggesting widespread irregularities. The government has yet to comment.</p>
            </div>
        </div>
    );
};

export default NewsHero; 
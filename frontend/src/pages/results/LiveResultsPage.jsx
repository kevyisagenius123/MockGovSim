import React from 'react';
import StateResultPanel from '../../components/results/StateResultPanel';

const LiveResultsPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-white tracking-tighter">Live State View</h1>
                <p className="text-gray-400 mt-2 text-lg">Detailed results for a selected state.</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
                {/* This could be made dynamic based on a URL parameter in the future */}
                <StateResultPanel stateCode="CA" />
            </div>
        </div>
    );
};

export default LiveResultsPage; 
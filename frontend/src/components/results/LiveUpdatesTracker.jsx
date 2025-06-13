import React from 'react';

const LiveUpdatesTracker = ({ precinctsReporting, totalPrecincts, lastUpdated }) => {
    
    const reportingPercentage = totalPrecincts > 0 ? (precinctsReporting / totalPrecincts) * 100 : 0;

    return (
        <div className="my-6">
            <div className="flex justify-between items-center text-sm text-text-secondary mb-1">
                <span>Precincts Reporting</span>
                <span>{reportingPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-accent h-2.5 rounded-full" 
                    style={{ width: `${reportingPercentage}%` }}
                ></div>
            </div>
            <div className="text-xs text-right text-text-secondary mt-1">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
        </div>
    );
};

export default LiveUpdatesTracker; 
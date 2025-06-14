import React from 'react';
import { safeCall, safeCallAsync } from '../../utils/safeCall';

const LiveUpdatesTracker = ({ precinctsReporting, totalPrecincts, lastUpdated }) => {
    
    const reportingPercentage = safeCall(() => {
        const total = totalPrecincts || 0;
        const reporting = precinctsReporting || 0;
        return total > 0 ? (reporting / total) * 100 : 0;
    }) || 0;

    const formattedTime = safeCall(() => {
        const date = new Date(lastUpdated);
        return date.toLocaleTimeString();
    }) || 'Unknown';

    return (
        <div className="my-6">
            <div className="flex justify-between items-center text-sm text-text-secondary mb-1">
                <span>Precincts Reporting</span>
                <span>{safeCall(() => reportingPercentage.toFixed(0)) || '0'}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-accent h-2.5 rounded-full" 
                    style={{ width: `${reportingPercentage}%` }}
                ></div>
            </div>
            <div className="text-xs text-right text-text-secondary mt-1">
                Last updated: {formattedTime}
            </div>
        </div>
    );
};

export default LiveUpdatesTracker; 
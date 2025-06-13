import React, { useState, useEffect } from 'react';

const WhipBreakdownChart = ({ billId, initialData }) => {
    const [breakdown, setBreakdown] = useState(initialData);

    // This component now assumes data is fetched by the parent.
    // A useEffect could be added back if it needs to be self-sufficient.

    if (!breakdown) {
        return <div className="text-center p-4">Loading Whip Count...</div>;
    }

    const totalVotes = Object.values(breakdown).reduce((a, b) => a + b, 0);
    const yeaVotes = breakdown['YEA'] || 0;
    const nayVotes = breakdown['NAY'] || 0;
    const abstainVotes = breakdown['ABSTAIN'] || 0;

    const getBarWidth = (votes) => {
        return totalVotes > 0 ? `${(votes / totalVotes) * 100}%` : '0%';
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Whip Breakdown (Pledged)</h3>
            {totalVotes === 0 ? (
                <p className="text-gray-500">No pledged votes have been recorded for this bill.</p>
            ) : (
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-green-700">Yea</span>
                            <span className="text-sm font-medium text-green-700">{yeaVotes}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: getBarWidth(yeaVotes) }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-red-700">Nay</span>
                            <span className="text-sm font-medium text-red-700">{nayVotes}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: getBarWidth(nayVotes) }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-gray-700">Abstain</span>
                            <span className="text-sm font-medium text-gray-700">{abstainVotes}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: getBarWidth(abstainVotes) }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhipBreakdownChart; 
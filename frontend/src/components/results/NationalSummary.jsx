import React from 'react';

const NationalSummary = () => {
    // Mock data, to be replaced by API call
    const summaryData = {
        demCandidate: { name: 'Joseph R. Biden', votes: 237 },
        repCandidate: { name: 'Donald J. Trump', votes: 213 },
        neededToWin: 270,
        otherVotes: 0,
        totalVotes: 538,
    };
    
    const demPercentage = (summaryData.demCandidate.votes / summaryData.totalVotes) * 100;
    const repPercentage = (summaryData.repCandidate.votes / summaryData.totalVotes) * 100;


    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-white">President</h2>
                <div className="text-right">
                    <div className="text-lg font-bold text-gray-300">Race to {summaryData.neededToWin}</div>
                    <div className="text-sm text-gray-400">538 total electoral votes</div>
                </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-8 mb-4 flex overflow-hidden">
                <div style={{ width: `${demPercentage}%` }} className="bg-blue-600 h-8"></div>
                <div style={{ width: `${repPercentage}%` }} className="bg-red-600 h-8"></div>
            </div>

            <div className="flex justify-between text-white">
                <div className="text-left">
                    <div className="text-lg font-semibold">{summaryData.demCandidate.name}</div>
                    <div className="text-3xl font-bold text-blue-400">{summaryData.demCandidate.votes}</div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-semibold">{summaryData.repCandidate.name}</div>
                    <div className="text-3xl font-bold text-red-400">{summaryData.repCandidate.votes}</div>
                </div>
            </div>
        </div>
    );
};

export default NationalSummary; 
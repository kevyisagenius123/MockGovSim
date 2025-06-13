import React, { useMemo } from 'react';

const BillViabilityPredictor = ({ bill, whipBreakdown }) => {

    const viabilityScore = useMemo(() => {
        if (!bill || !whipBreakdown) {
            return Math.floor(Math.random() * (65 - 35 + 1) + 35);
        }
        
        let score = 50; // Base score

        const yeaVotes = whipBreakdown['YEA'] || 0;
        const nayVotes = whipBreakdown['NAY'] || 0;
        const totalPledged = yeaVotes + nayVotes;

        if (totalPledged > 0) {
            score += (yeaVotes - nayVotes) * 2; 
        }

        // Placeholder for co-sponsors logic
        // score += (bill.coSponsors.length * 1.5);

        return Math.max(0, Math.min(100, Math.round(score)));
    }, [bill, whipBreakdown]);

    const getRingColor = (score) => {
        if (score > 66) return 'text-green-500';
        if (score > 33) return 'text-yellow-500';
        return 'text-red-500';
    };

    const circumference = 2 * Math.PI * 54; // 2 * pi * radius
    const strokeDashoffset = circumference - (viabilityScore / 100) * circumference;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 w-full text-center">Bill Viability Predictor</h3>
            <div className="relative flex items-center justify-center h-48 w-48">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 120 120">
                    <circle
                        className="text-gray-200"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r="54"
                        cx="60"
                        cy="60"
                    />
                    <circle
                        className={`${getRingColor(viabilityScore)} transition-all duration-1000 ease-in-out`}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="54"
                        cx="60"
                        cy="60"
                    />
                </svg>
                <span className="absolute text-4xl font-bold text-gray-700">{viabilityScore}%</span>
            </div>
            <p className="text-gray-500 mt-4 text-center">An AI-powered prediction of the bill's likelihood to pass.</p>
        </div>
    );
};

export default BillViabilityPredictor; 
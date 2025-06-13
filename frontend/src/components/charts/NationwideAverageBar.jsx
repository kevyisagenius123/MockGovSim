import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const NationwideAverageBar = ({ nationalAverages }) => {
    if (!Array.isArray(nationalAverages) || nationalAverages.length === 0) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 my-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Nationwide Average</h3>
                <div className="text-gray-400">Awaiting polling data...</div>
            </div>
        );
    }

    const getPartyColor = (party) => {
        if (party === 'right') return 'bg-red-500';
        if (party === 'left') return 'bg-blue-500';
        return 'bg-yellow-500';
    };

    const TrendArrow = ({ trend }) => {
        if (trend > 0) return <FiArrowUp className="text-green-400 ml-2" />;
        if (trend < 0) return <FiArrowDown className="text-red-400 ml-2" />;
        return <div className="ml-2 w-4" />; // Placeholder for alignment
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 my-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Nationwide Average</h3>
            <div className="space-y-3">
                {nationalAverages.map((candidate, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1 text-gray-300">
                            <span className="font-bold">{candidate.name}</span>
                            <div className="flex items-center">
                                <span className="font-mono text-lg">
                                    {typeof candidate.percentage === 'number' ? candidate.percentage.toFixed(1) : '0.0'}%
                                </span>
                                <TrendArrow trend={candidate.trend} />
                            </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                            <motion.div
                                className={`${getPartyColor(candidate.party)} h-4 rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${typeof candidate.percentage === 'number' ? candidate.percentage : 0}%` }}
                                transition={{ duration: 1, delay: 0.2 * index, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NationwideAverageBar; 
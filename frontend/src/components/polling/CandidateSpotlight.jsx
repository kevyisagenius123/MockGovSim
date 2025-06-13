import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CandidateSpotlight = ({ candidate, onClose }) => {
    if (!candidate) return null;

    const partyColors = {
        left: 'from-blue-500 to-blue-700',
        right: 'from-red-500 to-red-700',
        center: 'from-yellow-500 to-yellow-600',
    };

    const partyStripe = {
        left: 'bg-blue-600',
        right: 'bg-red-600',
        center: 'bg-yellow-500',
    };

    return (
        <AnimatePresence>
            {candidate && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-gray-800 rounded-lg shadow-2xl overflow-hidden border-2 border-gray-700 mt-6 relative`}
                >
                    <div className={`absolute top-0 left-0 h-full w-2 ${partyStripe[candidate.party] || 'bg-gray-500'}`} />
                    <div className="p-6 pl-8">
                        <div className="flex items-center">
                            <img
                                src={candidate.photoUrl || 'https://via.placeholder.com/100'}
                                alt={candidate.name}
                                className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover mr-6"
                            />
                            <div>
                                <h3 className="text-3xl font-bold text-white">{candidate.name}</h3>
                                <p className={`text-lg font-semibold ${partyStripe[candidate.party]?.replace('bg', 'text')} `}>{candidate.partyName}</p>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-4">
                            {candidate.bio || 'No biography available. This candidate is focusing on the issues.'}
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <h4 className="text-sm uppercase font-bold text-gray-500 mb-2">Polling Trajectory</h4>
                            <p className="text-lg text-gray-300">
                                {candidate.trajectory || 'Polling data is being analyzed...'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CandidateSpotlight; 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlayCircle, FiPauseCircle, FiRepeat, FiEdit } from 'react-icons/fi';

const SimulationControls = () => {
    const [simMode, setSimMode] = useState('live'); // live, custom, replay

    const modes = [
        { id: 'live', name: 'Live Mode', icon: <FiPlayCircle /> },
        { id: 'custom', name: 'Scenario Builder', icon: <FiEdit /> },
        { id: 'replay', name: 'Historical Replay', icon: <FiRepeat /> },
    ];

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Simulation Controls</h3>
            <div className="flex flex-col sm:flex-row items-center bg-gray-900 rounded-lg p-1 space-y-1 sm:space-y-0 sm:space-x-1">
                {modes.map(mode => (
                    <button
                        key={mode.id}
                        onClick={() => setSimMode(mode.id)}
                        className={`w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            simMode === mode.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        {mode.icon}
                        <span>{mode.name}</span>
                    </button>
                ))}
            </div>
            {/* Future content based on mode will go here */}
            {simMode === 'custom' && (
                <div className="mt-4 text-center text-gray-400">
                    <p>Scenario Builder coming soon.</p>
                </div>
            )}
            {simMode === 'replay' && (
                <div className="mt-4 text-center text-gray-400">
                    <p>Historical Replay coming soon.</p>
                </div>
            )}
        </div>
    );
};

export default SimulationControls; 
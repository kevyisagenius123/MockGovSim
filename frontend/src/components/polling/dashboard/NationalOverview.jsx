import React, { useState } from 'react';
import TimelineControls from './TimelineControls';
import VotingSystemToggle from './VotingSystemToggle';

const NationalOverview = () => {
    const [selectedRace, setSelectedRace] = useState('Presidential');
    const [pollingMethod, setPollingMethod] = useState('raw');
    const [votingSystem, setVotingSystem] = useState('FPTP');

    const handleRaceChange = (e) => {
        setSelectedRace(e.target.value);
    };

    const handlePollingMethodChange = (e) => {
        setPollingMethod(e.target.value);
    };



    return (
        <div className="bg-card p-6 rounded-lg shadow-lg h-full">
            <h2 className="text-2xl font-bold text-white mb-4">National Overview</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="race-select" className="block text-sm font-medium text-text-secondary mb-1">Race</label>
                    <select 
                        id="race-select" 
                        className="w-full bg-background-dark text-text-primary p-2 rounded"
                        value={selectedRace}
                        onChange={handleRaceChange}
                    >
                        <option value="Presidential">Presidential</option>
                        <option value="Senate">Senate</option>
                        <option value="Gubernatorial">Gubernatorial</option>
                    </select>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Polling Average</h3>
                    <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                            <input 
                                id="raw" 
                                type="radio" 
                                name="average-toggle" 
                                value="raw" 
                                checked={pollingMethod === 'raw'}
                                onChange={handlePollingMethodChange}
                                className="mr-2"
                            />
                            <label htmlFor="raw" className="text-text-primary">Raw</label>
                        </div>
                        <div className="flex items-center">
                            <input 
                                id="weighted" 
                                type="radio" 
                                name="average-toggle" 
                                value="weighted" 
                                checked={pollingMethod === 'weighted'}
                                onChange={handlePollingMethodChange}
                                className="mr-2"
                            />
                            <label htmlFor="weighted" className="text-text-primary">Weighted</label>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Timeline</h3>
                    <TimelineControls />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Voting System</h3>
                    <VotingSystemToggle onChange={setVotingSystem} />
                </div>

            </div>
        </div>
    );
};

export default NationalOverview;
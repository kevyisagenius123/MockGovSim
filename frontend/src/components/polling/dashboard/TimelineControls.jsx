import React, { useState } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const TimelineControls = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentDate, setCurrentDate] = useState("2023-11-01");
    const [speed, setSpeed] = useState("normal");

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
        // In a real implementation, this would start/stop an animation timer
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Current Date: {currentDate}</span>
                <button 
                    onClick={togglePlayback}
                    className="bg-accent bg-opacity-20 hover:bg-opacity-30 p-1 rounded-full"
                >
                    {isPlaying ? 
                        <PauseIcon className="h-5 w-5 text-accent" /> : 
                        <PlayIcon className="h-5 w-5 text-accent" />
                    }
                </button>
            </div>
            
            <div className="w-full bg-background-dark rounded-full h-2">
                <div 
                    className="bg-accent h-2 rounded-full" 
                    style={{ width: '35%' }}
                ></div>
            </div>
            
            <div className="flex justify-between text-xs text-text-secondary">
                <span>Election Start</span>
                <span>Election Day</span>
            </div>
            
            <div className="flex justify-end mt-1">
                <select 
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    className="text-xs bg-background-dark text-text-secondary p-1 rounded"
                >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                </select>
            </div>
        </div>
    );
};

export default TimelineControls; 
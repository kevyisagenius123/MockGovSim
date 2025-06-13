import React from 'react';

const KeyRaces = () => {
    // Mock data for key races
    const races = [
        { state: 'Pennsylvania', dem: 49.8, rep: 49.1, margin: '+0.7 D' },
        { state: 'Arizona', dem: 49.4, rep: 49.0, margin: '+0.4 D' },
        { state: 'Georgia', dem: 49.3, rep: 49.2, margin: '+0.1 D' },
        { state: 'Wisconsin', dem: 49.0, rep: 49.5, margin: '+0.5 R' },
        { state: 'Nevada', dem: 48.7, rep: 48.8, margin: '+0.1 R' }
    ];

    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-700 mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">Key Battlegrounds</h3>
            <div className="space-y-4">
                {races.map(race => (
                    <div key={race.state}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white">{race.state}</span>
                            <span className={`text-sm font-semibold px-2 py-0.5 rounded ${race.margin.includes('D') ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}`}>
                                {race.margin}
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 flex">
                            <div className="bg-blue-600 h-2.5 rounded-l-full" style={{ width: `${race.dem}%` }}></div>
                            <div className="bg-red-600 h-2.5 rounded-r-full" style={{ width: `${race.rep}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeyRaces; 
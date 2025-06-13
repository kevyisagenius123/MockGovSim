import React, { useState } from 'react';
import StateResultPanel from '../../components/results/StateResultPanel';
import NationalSummary from '../../components/results/NationalSummary';
import NationalResultsMap from '../../components/results/NationalResultsMap';
import BalanceOfPower from '../../components/results/BalanceOfPower';

const LiveTicker = () => {
    const tickerItems = [
        { type: 'race-call', party: 'dem', text: 'CALIFORNIA goes to A. Smith (D)' },
        { type: 'update', party: 'neutral', text: '95% of votes now in from Maricopa County, AZ' },
        { type: 'race-call', party: 'rep', text: 'FLORIDA goes to B. Jones (R)' },
        { type: 'update', party: 'neutral', text: 'Key Race Alert: Pennsylvania margin narrows to 0.5%' },
        { type: 'race-call', party: 'dem', text: 'NEW YORK goes to A. Smith (D)' },
    ];

    const partyColorMap = {
        dem: 'bg-blue-500',
        rep: 'bg-red-500',
        neutral: 'bg-yellow-500',
    };

    return (
        <div className="relative flex overflow-x-hidden bg-gray-900 border-y-2 border-accent py-2 mb-8">
            <div className="animate-marquee whitespace-nowrap flex">
                {tickerItems.map((item, i) => (
                    <div key={i} className="flex items-center mx-4">
                        <span className={`w-3 h-3 rounded-full mr-3 ${partyColorMap[item.party]}`}></span>
                        <span className="text-white font-semibold text-lg">{item.text}</span>
                    </div>
                ))}
            </div>
             <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex">
                {tickerItems.map((item, i) => (
                    <div key={i} className="flex items-center mx-4">
                        <span className={`w-3 h-3 rounded-full mr-3 ${partyColorMap[item.party]}`}></span>
                        <span className="text-white font-semibold text-lg">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const KeyRaces = () => {
    const races = [
        { state: 'Pennsylvania', margin: '+0.5% DEM', reporting: '92%' },
        { state: 'Arizona', margin: '+1.2% REP', reporting: '88%' },
        { state: 'Georgia', margin: '-0.2% REP', reporting: '95%' },
        { state: 'Wisconsin', margin: '+2.1% DEM', reporting: '99%' },
    ];

    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 mt-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">Key Races</h3>
            <ul>
                {races.map((race, index) => (
                    <li key={index} className="border-b border-gray-700 last:border-b-0 py-3">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg text-white">{race.state}</span>
                            <span className={`text-lg font-mono ${race.margin.includes('DEM') ? 'text-blue-400' : 'text-red-400'}`}>
                                {race.margin}
                            </span>
                        </div>
                        <div className="text-right text-gray-400 text-sm">
                            {race.reporting} reporting
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const LiveResultsHubPage = () => {
    const [selectedState, setSelectedState] = useState(null);
    const [viewLevel, setViewLevel] = useState('states'); // 'states' or 'counties'

    const handleStateSelect = (stateAbbreviation) => {
        setSelectedState(stateAbbreviation);
        setViewLevel('counties');
    };

    const handleReturnToNational = () => {
        setSelectedState(null);
        setViewLevel('states');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <LiveTicker />
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-white tracking-tighter">Live Results Hub</h1>
                <p className="text-gray-400 mt-2 text-lg">National and state results as they are reported.</p>
                {viewLevel === 'counties' && (
                    <button 
                        onClick={handleReturnToNational} 
                        className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-80 transition shadow-md"
                    >
                        ← Back to National View
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {viewLevel === 'states' && <NationalSummary />}
                    <NationalResultsMap 
                        onStateSelect={handleStateSelect} 
                        viewLevel={viewLevel}
                        selectedState={selectedState}
                    />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    { selectedState &&
                        <div className="bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                {viewLevel === 'counties' && selectedState ? `${selectedState} Spotlight` : 'State Spotlight'}
                            </h3>
                            <StateResultPanel stateCode={selectedState} />
                        </div>
                    }
                    {viewLevel === 'states' && (
                        <>
                            <KeyRaces />
                            <BalanceOfPower />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveResultsHubPage; 
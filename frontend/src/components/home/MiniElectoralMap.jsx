import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MiniElectoralMap = () => {
  const [hoveredState, setHoveredState] = useState(null);

  const stateData = {
    'CA': { name: 'California', votes: 55, leader: 'D+15', color: '#2f81f7' },
    'TX': { name: 'Texas', votes: 38, leader: 'R+8', color: '#f85149' },
    'FL': { name: 'Florida', votes: 29, leader: 'R+3', color: '#f78a85' },
    'NY': { name: 'New York', votes: 29, leader: 'D+20', color: '#2f81f7' },
    'PA': { name: 'Pennsylvania', votes: 20, leader: 'Toss-up', color: '#d29922' }
  };

  const electoralCount = { democrat: 226, republican: 219, tossup: 93 };

  return (
    <div className="bg-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Electoral Map Preview</h3>
        <Link to="/polling/dashboard" className="text-accent hover:underline">View Full Map</Link>
      </div>

      <div className="mb-6 p-4 bg-background rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{electoralCount.democrat}</div>
            <div className="text-sm text-gray-400">Democrat</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{electoralCount.tossup}</div>
            <div className="text-sm text-gray-400">Toss-up</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{electoralCount.republican}</div>
            <div className="text-sm text-gray-400">Republican</div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">270 needed to win</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stateData).map(([code, state]) => (
          <div key={code} 
               className="bg-background p-3 rounded cursor-pointer hover:border-accent border border-border transition-colors"
               onMouseEnter={() => setHoveredState(code)}
               onMouseLeave={() => setHoveredState(null)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{state.name}</div>
                <div className="text-sm text-gray-400">{state.votes} votes</div>
              </div>
              <div className="text-right">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: state.color }}></div>
                <div className="text-xs mt-1">{state.leader}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Democratic</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span>Toss-up</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span>Republican</span>
        </div>
      </div>
    </div>
  );
};

export default MiniElectoralMap;

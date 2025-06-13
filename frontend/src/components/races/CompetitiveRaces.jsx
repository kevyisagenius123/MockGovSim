import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const CompetitiveRaces = ({ races }) => {
  if (!races || races.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
        <h3 className="text-lg font-bold mb-4">Top Competitive Races</h3>
        <p className="text-gray-400">No competitive race data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <h3 className="text-lg font-bold mb-4">Top Competitive Races</h3>
      <ul className="space-y-3">
        {races.map((race, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200 cursor-pointer">
            <div>
              <p className="font-semibold">{race.name}</p>
              <p className="text-sm text-gray-400">{race.state} - {race.type}</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${parseFloat(race.margin) > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                    {Math.abs(parseFloat(race.margin) || 0).toFixed(1)}%
                </span>
                <FiChevronRight className="text-gray-400" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompetitiveRaces;
import React from 'react';

const ElectionCard = ({ election }) => {
  const { name, country, region, office, electionType, startDate, endDate, status } = election;

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-500';
      case 'ONGOING': return 'bg-green-500';
      case 'CLOSED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-accent/40 hover:scale-[1.02] border border-gray-700/50">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white leading-tight">{name}</h3>
          <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusChipColor(status)}`}>
            {status}
          </span>
        </div>
        <div className="mt-2 text-sm text-text-secondary">
          <p>{office} - {region}, {country}</p>
          <p className="mt-1">Type: <span className="font-semibold text-gray-300">{electionType}</span></p>
        </div>
        <div className="mt-4 border-t border-gray-700 pt-4 text-xs text-gray-400">
            <p>Starts: {new Date(startDate).toLocaleString()}</p>
            <p>Ends: {new Date(endDate).toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-gray-900/50 px-5 py-3 flex justify-end">
        <button className="bg-accent text-white font-bold py-2 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ElectionCard; 
import React from 'react';

const partyColors = {
  left: 'bg-party-left',
  right: 'bg-party-right',
  center: 'bg-party-center',
  libertarian: 'bg-party-libertarian',
  green: 'bg-party-green',
  socialist: 'bg-party-socialist',
  nationalist: 'bg-party-nationalist',
  independent: 'bg-party-independent',
};

const PartyLegend = () => {
  return (
    <div className="p-4 rounded-lg bg-card border border-border shadow-lg">
      <h3 className="mb-4 text-lg font-bold text-text-primary">Party Legend</h3>
      <div className="space-y-2">
        {Object.entries(partyColors).map(([party, colorClass]) => (
          <div key={party} className="flex items-center">
            <div className={`w-5 h-5 mr-3 rounded-full ${colorClass}`}></div>
            <span className="capitalize text-text-secondary">{party}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartyLegend; 
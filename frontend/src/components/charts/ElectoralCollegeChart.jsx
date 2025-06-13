import React from 'react';

const ElectoralCollegeChart = ({ pollingData }) => {
  const calculateTotals = () => {
    let doeVotes = 0;
    let smithVotes = 0;
    const totalElectoralVotes = 538;

    pollingData?.states?.forEach(state => {
      if (!state || typeof state.support !== 'object' || state.electoralVotes === undefined) {
        return; 
      }
      const supportKeys = Object.keys(state.support);
      if(supportKeys.length === 0) return;

      const leadingCandidate = supportKeys.reduce((a, b) => state.support[a] > state.support[b] ? a : b);
      if (leadingCandidate.includes("Doe")) {
        doeVotes += state.electoralVotes;
      } else if (leadingCandidate.includes("Smith")) {
        smithVotes += state.electoralVotes;
      }
    });

    const undecidedVotes = totalElectoralVotes - doeVotes - smithVotes;
    return { doeVotes, smithVotes, undecidedVotes, totalElectoralVotes };
  };

  const { doeVotes, smithVotes, undecidedVotes, totalElectoralVotes } = calculateTotals();

  const doePercentage = totalElectoralVotes > 0 ? (doeVotes / totalElectoralVotes) * 100 : 0;
  const smithPercentage = totalElectoralVotes > 0 ? (smithVotes / totalElectoralVotes) * 100 : 0;
  const undecidedPercentage = totalElectoralVotes > 0 ? (undecidedVotes / totalElectoralVotes) * 100 : 0;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <h3 className="text-lg font-bold mb-4">Electoral College Projection</h3>
      <div className="flex w-full h-8 bg-gray-700 rounded-full overflow-hidden">
        <div style={{ width: `${doePercentage}%` }} className="bg-blue-500 transition-all duration-500 flex items-center justify-center font-bold">
          {doeVotes > 0 && doeVotes}
        </div>
        <div style={{ width: `${smithPercentage}%` }} className="bg-red-500 transition-all duration-500 flex items-center justify-center font-bold">
          {smithVotes > 0 && smithVotes}
        </div>
        <div style={{ width: `${undecidedPercentage}%` }} className="bg-gray-500 transition-all duration-500 flex items-center justify-center font-bold">
          {undecidedVotes > 0 && undecidedVotes}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <div className="text-blue-400">
          <span className="font-bold">John Doe</span>
        </div>
        <div className="text-gray-400">
          <span className="font-bold">Undecided</span>
        </div>
        <div className="text-red-400">
          <span className="font-bold">Jane Smith</span>
        </div>
      </div>
      <div className="text-center mt-2 text-xs text-gray-400 border-t border-gray-700 pt-2">
        270 to win
      </div>
    </div>
  );
};

export default ElectoralCollegeChart; 
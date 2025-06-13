import React from 'react';

const BillRulesCard = () => {
    return (
        <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 text-sm text-zinc-400">
            <h3 className="text-lg text-blue-300 font-semibold mb-2">🧾 Chamber Rules</h3>
            <ul className="list-disc list-inside space-y-1">
                <li>Each member may sponsor 1 primary bill per cycle</li>
                <li>Bills must be assigned a committee before advancing</li>
                <li>Once submitted, amendments must go through formal motion</li>
                <li>Co-sponsors increase passage chance in tight chambers</li>
            </ul>
        </div>
    );
};

export default BillRulesCard; 
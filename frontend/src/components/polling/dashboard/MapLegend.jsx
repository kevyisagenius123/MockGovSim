import React from 'react';

const MapLegend = ({ partyColors }) => {
    const legendItems = [
        { label: 'Strong D', color: partyColors.left.strong },
        { label: 'Lean D', color: partyColors.left.lean },
        { label: 'Toss-up', color: partyColors.tossup },
        { label: 'Lean R', color: partyColors.right.lean },
        { label: 'Strong R', color: partyColors.right.strong },
        { label: 'Unpolled', color: '#30363d' },
    ];

    return (
        <div className="absolute bottom-4 left-4 bg-card bg-opacity-80 p-3 rounded-lg shadow-xl text-text-primary text-sm">
            <h4 className="font-bold mb-2">Margin</h4>
            <div className="space-y-1">
                {legendItems.map(item => (
                    <div key={item.label} className="flex items-center">
                        <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapLegend; 
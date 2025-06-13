import React, { useState } from 'react';

const VotingSystemToggle = ({ onChange }) => {
    const [activeSystem, setActiveSystem] = useState('FPTP');
    
    const systems = [
        { id: 'FPTP', label: 'FPTP' },
        { id: 'RANKED', label: 'Ranked' },
        { id: 'APPROVAL', label: 'Approval' }
    ];
    
    const handleSystemChange = (systemId) => {
        setActiveSystem(systemId);
        if (onChange) {
            onChange(systemId);
        }
    };
    
    return (
        <div className="flex space-x-1 bg-background-dark p-1 rounded-lg">
            {systems.map(system => (
                <button
                    key={system.id}
                    onClick={() => handleSystemChange(system.id)}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                        activeSystem === system.id 
                            ? 'bg-accent text-white font-medium' 
                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                    }`}
                >
                    {system.label}
                </button>
            ))}
        </div>
    );
};

export default VotingSystemToggle; 
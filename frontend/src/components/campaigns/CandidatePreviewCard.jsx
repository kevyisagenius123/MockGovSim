import React from 'react';

const CandidatePreviewCard = ({ candidate }) => {
    return (
        <div className="bg-background-light p-4 rounded-lg shadow-md flex items-center">
            <img 
                src={candidate.photoUrl || 'https://via.placeholder.com/80'} 
                alt={candidate.fullName}
                className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-accent"
            />
            <div>
                <h3 className="text-xl font-bold text-text-primary">{candidate.fullName}</h3>
                <p className="text-md text-text-secondary">{candidate.party}</p>
                <p className="text-sm text-text-secondary mt-2 italic">
                    "{candidate.platformStatement ? `${candidate.platformStatement.slice(0, 100)}...` : 'No platform statement provided.'}"
                </p>
            </div>
        </div>
    );
};

export default CandidatePreviewCard; 
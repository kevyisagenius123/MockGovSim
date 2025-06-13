import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const PollDetailsCard = ({ poll }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Helper to format dates
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    };

    // Helper to generate star rating based on firm's reputation score
    const getStarRating = (score) => {
        const stars = Math.round(score / 20); // 0-100 score to 0-5 stars
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    };

    return (
        <div className="bg-background p-3 rounded-lg transition-all duration-300">
            <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-accent hover:underline">{poll.firm.name}</h3>
                        <p className="text-sm text-text-primary">{poll.title}</p>
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
                    {/* Poll Rating */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-text-secondary">Rating</span>
                        <span>
                            <span className="text-yellow-400">{getStarRating(poll.firm.reputationScore || 75)}</span>
                            <span className="ml-2 text-text-secondary">({poll.firm.biasRating || 'Center'})</span>
                        </span>
                    </div>

                    {/* Date Range */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-text-secondary">Date</span>
                        <span>{formatDate(poll.startDate)} - {formatDate(poll.endDate)}</span>
                    </div>

                    {/* Methodology */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-text-secondary">Methodology</span>
                        <span>{poll.methodology}, {poll.sampleSize} LV, ±{poll.marginOfError}%</span>
                    </div>

                    {/* Results */}
                    <div className="pt-2">
                        {poll.results.map(result => (
                            <div key={result.candidateName} className="flex justify-between items-center text-base mb-1">
                                <span className="font-bold">{result.candidateName}</span>
                                <span className="font-bold text-accent">{result.percentage.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PollDetailsCard; 
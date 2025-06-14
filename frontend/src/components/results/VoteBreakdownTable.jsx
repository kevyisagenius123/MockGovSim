import React from 'react';
import { safeCall, safeCallAsync } from '../../utils/safeCall';

const VoteBreakdownTable = ({ title, results }) => {

    const formatNumber = (num) => safeCall(() => new Intl.NumberFormat('en-US').format(num)) || num;
    const formatPercentage = (num) => safeCall(() => `${num.toFixed(1)}%`) || '0.0%';
    const formatChange = (num) => {
        const sign = safeCall(() => num > 0 ? '▲' : '▼') || '';
        const color = safeCall(() => num > 0 ? 'text-green-500' : 'text-red-500') || 'text-gray-500';
        const absNum = safeCall(() => Math.abs(num).toFixed(1)) || '0.0';
        return <span className={color}>{sign} {absNum}%</span>;
    };

    const safeResults = safeCall(() => Array.isArray(results) ? results : []) || [];

    return (
        <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">{title}</h3>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-700 text-sm text-text-secondary">
                        <th className="py-2">Candidate</th>
                        <th className="py-2 text-right">Votes</th>
                        <th className="py-2 text-right">%</th>
                        <th className="py-2 text-right">Change</th>
                    </tr>
                </thead>
                <tbody>
                    {safeResults.map((candidate, index) => {
                        const candidateName = safeCall(() => candidate.candidateName) || 'Unknown';
                        const party = safeCall(() => candidate.party) || 'N/A';
                        const votes = safeCall(() => candidate.votes) || 0;
                        const percentage = safeCall(() => candidate.percentage) || 0;
                        const changeFromLastElection = safeCall(() => candidate.changeFromLastElection) || 0;
                        
                        return (
                            <tr key={index} className="border-b border-gray-800">
                                <td className="py-2">
                                    <div className="font-bold">{candidateName}</div>
                                    <div className="text-sm text-text-secondary">{party}</div>
                                </td>
                                <td className="py-2 text-right font-mono">{formatNumber(votes)}</td>
                                <td className="py-2 text-right font-mono">{formatPercentage(percentage)}</td>
                                <td className="py-2 text-right font-mono">{formatChange(changeFromLastElection)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default VoteBreakdownTable; 
import React from 'react';

const VoteBreakdownTable = ({ title, results }) => {

    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);
    const formatPercentage = (num) => `${num.toFixed(1)}%`;
    const formatChange = (num) => {
        const sign = num > 0 ? '▲' : '▼';
        const color = num > 0 ? 'text-green-500' : 'text-red-500';
        return <span className={color}>{sign} {Math.abs(num).toFixed(1)}%</span>;
    };

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
                    {results.map((candidate, index) => (
                        <tr key={index} className="border-b border-gray-800">
                            <td className="py-2">
                                <div className="font-bold">{candidate.candidateName}</div>
                                <div className="text-sm text-text-secondary">{candidate.party}</div>
                            </td>
                            <td className="py-2 text-right font-mono">{formatNumber(candidate.votes)}</td>
                            <td className="py-2 text-right font-mono">{formatPercentage(candidate.percentage)}</td>
                            <td className="py-2 text-right font-mono">{formatChange(candidate.changeFromLastElection)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VoteBreakdownTable; 
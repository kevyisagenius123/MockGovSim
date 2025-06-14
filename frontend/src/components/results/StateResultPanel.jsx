import React, { useEffect, useState } from 'react';
import resultsApi from '../../api/resultsApi';
import VoteBreakdownTable from './VoteBreakdownTable';
import LiveUpdatesTracker from './LiveUpdatesTracker';
import VoteTrendLineChart from './VoteTrendLineChart';
import CountyMap from './CountyMap';

const StateResultPanel = ({ stateCode }) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await resultsApi.getDetailedStateResults(stateCode);
                setResults(response.data);
                setError(null);
            } catch (err) {
                setError(`Failed to load results for ${stateCode}.`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (stateCode) {
            fetchResults();
        }
    }, [stateCode]);

    if (loading) return <div className="p-4 text-center">Loading state results...</div>;
    if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
    if (!results) return null;

    return (
        <div className="bg-background-light p-6 rounded-lg shadow-2xl border border-gray-700">
            <h2 className="text-4xl font-extrabold text-accent mb-2">{results.stateName}</h2>
            <p className="text-text-secondary mb-6">Live Election Results</p>
            
            <LiveUpdatesTracker 
                precinctsReporting={results.precinctsReporting}
                totalPrecincts={results.totalPrecincts}
                lastUpdated={results.lastUpdated}
            />
            
            <div className="space-y-8">
                {results.presidentialResults && (
                    <VoteBreakdownTable title="Presidential Results" results={Array.isArray(results.presidentialResults) ? results.presidentialResults : []} />
                )}

                {/* Placeholder for Gubernatorial results if they exist */}
                {results.gubernatorialResults && (
                     <VoteBreakdownTable title="Gubernatorial Results" results={Array.isArray(results.gubernatorialResults) ? results.gubernatorialResults : []} />
                )}

                {results.voteTrend && (
                    <VoteTrendLineChart data={Array.isArray(results.voteTrend) ? results.voteTrend : []} />
                )}

                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-white mb-4">County Breakdown</h3>
                    <CountyMap stateCode={stateCode} />
                </div>
            </div>

        </div>
    );
};

export default StateResultPanel; 
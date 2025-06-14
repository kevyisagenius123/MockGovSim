import React, { useEffect, useState } from 'react';
import resultsApi from '../../api/resultsApi';
import VoteBreakdownTable from './VoteBreakdownTable';
import LiveUpdatesTracker from './LiveUpdatesTracker';
import VoteTrendLineChart from './VoteTrendLineChart';
import CountyMap from './CountyMap';
import { safeCall, safeCallAsync } from '../../utils/safeCall';

const StateResultPanel = ({ stateCode }) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await safeCallAsync(() => resultsApi.getDetailedStateResults(stateCode));
                setResults(safeCall(() => response.data) || null);
                setError(null);
            } catch (err) {
                setError(`Failed to load results for ${stateCode}.`);
                console.error(err);
                // Set fallback data
                setResults(null);
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

    const stateName = safeCall(() => results.stateName) || stateCode;
    const precinctsReporting = safeCall(() => results.precinctsReporting) || 0;
    const totalPrecincts = safeCall(() => results.totalPrecincts) || 0;
    const lastUpdated = safeCall(() => results.lastUpdated) || new Date().toISOString();
    const presidentialResults = safeCall(() => Array.isArray(results.presidentialResults) ? results.presidentialResults : []) || [];
    const gubernatorialResults = safeCall(() => Array.isArray(results.gubernatorialResults) ? results.gubernatorialResults : []) || [];
    const voteTrend = safeCall(() => Array.isArray(results.voteTrend) ? results.voteTrend : []) || [];

    return (
        <div className="bg-background-light p-6 rounded-lg shadow-2xl border border-gray-700">
            <h2 className="text-4xl font-extrabold text-accent mb-2">{stateName}</h2>
            <p className="text-text-secondary mb-6">Live Election Results</p>
            
            <LiveUpdatesTracker 
                precinctsReporting={precinctsReporting}
                totalPrecincts={totalPrecincts}
                lastUpdated={lastUpdated}
            />
            
            <div className="space-y-8">
                {presidentialResults.length > 0 && (
                    <VoteBreakdownTable title="Presidential Results" results={presidentialResults} />
                )}

                {/* Placeholder for Gubernatorial results if they exist */}
                {gubernatorialResults.length > 0 && (
                     <VoteBreakdownTable title="Gubernatorial Results" results={gubernatorialResults} />
                )}

                {voteTrend.length > 0 && (
                    <VoteTrendLineChart data={voteTrend} />
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
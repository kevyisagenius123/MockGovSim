import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';

const FirmDetailPage = () => {
    const { firmId } = useParams();
    const [firm, setFirm] = useState(null);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch firm details
                const firmResponse = await apiClient.get(`/polling/firms/${firmId}`);
                setFirm(firmResponse.data);

                // Fetch polls for the firm
                const pollsResponse = await apiClient.get(`/polling/polls/firm/${firmId}`);
                setPolls(pollsResponse.data);
                
                setError(null);
            } catch (err) {
                setError('Failed to fetch firm details and polls.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [firmId]);

    if (loading) return <div className="text-center p-8">Loading firm details...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!firm) return <div className="text-center p-8">Firm not found.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-6">
                <img src={firm.logoUrl || '/default-logo.png'} alt={`${firm.name} Logo`} className="w-24 h-24 mr-6 rounded-full" />
                <div>
                    <h1 className="text-4xl font-bold text-primary">{firm.name}</h1>
                    <p className="text-lg text-text-secondary">{firm.description}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Published Polls</h2>
                {polls.length > 0 ? (
                    <div className="space-y-4">
                        {polls.map(poll => (
                            <div key={poll.id} className="bg-background-light p-4 rounded-lg shadow">
                                <h3 className="text-xl font-bold text-accent">Poll for Election ID: {poll.election.id}</h3>
                                <p>Methodology: {poll.methodology}</p>
                                <p>Sample Size: {poll.sampleSize}</p>
                                <p>Dates: {poll.startDate} to {poll.endDate}</p>
                                {/* We would need a component to render the pollData JSON */}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>This firm has not published any polls yet.</p>
                )}
            </div>
        </div>
    );
};

export default FirmDetailPage; 
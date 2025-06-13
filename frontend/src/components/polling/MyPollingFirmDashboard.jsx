import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

const MyPollingFirmDashboard = ({ firm }) => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!firm) return;
        const fetchPolls = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/polling/polls/firm/${firm.id}`);
                setPolls(response.data);
            } catch (err) {
                setError('Failed to load your polls.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, [firm]);

    if (!firm) {
        return <div className="text-center p-8 text-red-500">No firm data provided.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-background-light p-6 rounded-lg shadow-md mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">{firm.name}</h1>
                        <p className="text-lg text-text-secondary mt-1">{firm.description}</p>
                        <div className="mt-2 text-sm text-text-secondary">
                            <span>Reputation: {firm.reputationScore}/100</span>
                            <span className="mx-2">|</span>
                            <span>Bias: {firm.biasRating || 'Not Yet Rated'}</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                         {/* Placeholder for Edit Firm button */}
                        <button className="btn-secondary mr-2">Edit Details</button>
                        <button onClick={() => navigate('/polling/submit')} className="btn-primary">
                            Submit New Poll
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">My Published Polls</h2>
                {loading && <p>Loading polls...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && polls.length === 0 && (
                    <p>You haven't published any polls yet. Submit your first one!</p>
                )}
                <div className="space-y-4">
                    {polls.map(poll => (
                        <div key={poll.id} className="bg-background-light p-4 rounded-lg shadow">
                            <h3 className="text-xl font-bold text-accent">{poll.title}</h3>
                            <p className="text-sm text-text-secondary">
                                {poll.region} | {poll.startDate} to {poll.endDate} | Sample: {poll.sampleSize}
                            </p>
                            {/* Further details or actions per poll can go here */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyPollingFirmDashboard; 
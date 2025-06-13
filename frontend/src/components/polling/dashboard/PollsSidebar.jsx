import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import PollDetailsCard from './PollDetailsCard';

const PollsSidebar = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/polling/polls');
                // Sort by end date, newest first
                const sortedPolls = response.data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
                setPolls(sortedPolls);
            } catch (err) {
                setError('Failed to fetch polls.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, []);

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Latest Polls</h2>
            <div className="space-y-2">
                {loading && <p>Loading polls...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {polls.length > 0 && polls.map(poll => (
                    <PollDetailsCard key={poll.id} poll={poll} />
                ))}
            </div>
        </div>
    );
};

export default PollsSidebar; 
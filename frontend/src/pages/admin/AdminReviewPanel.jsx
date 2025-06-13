import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

const AdminReviewPanel = () => {
    const [pendingCandidates, setPendingCandidates] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPendingCandidates = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/candidates/pending');
            setPendingCandidates(response.data);
        } catch (err) {
            setError('Failed to fetch pending candidates.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingCandidates();
    }, []);

    const handleApproval = async (id, action) => {
        try {
            await apiClient.post(`/candidates/${action}?id=${id}`);
            // Refresh the list after action
            fetchPendingCandidates();
        } catch (err) {
            console.error(`Failed to ${action} candidate`, err);
        }
    };

    if (isLoading) return <p>Loading pending candidates...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-background-light p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-accent">Pending Candidacy Review</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-background-dark">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Party</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Office</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Region</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {pendingCandidates.length > 0 ? (
                            pendingCandidates.map(c => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.party}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.office}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.regionCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleApproval(c.id, 'approve')} className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mr-2">✅ Approve</button>
                                        <button onClick={() => handleApproval(c.id, 'reject')} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">❌ Reject</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-text-secondary">No pending candidates for review.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReviewPanel; 
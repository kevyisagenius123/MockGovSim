import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

const AdminCandidacyPanel = () => {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPendingCandidates = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/candidates/pending');
            setCandidates(response.data);
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

    const handleApprove = async (id) => {
        try {
            await apiClient.post(`/candidates/${id}/approve`);
            // Refresh the list after action
            fetchPendingCandidates();
        } catch (err) {
            setError('Failed to approve candidate.');
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        try {
            await apiClient.post(`/candidates/${id}/reject`);
            // Refresh the list after action
            fetchPendingCandidates();
        } catch (err) {
            setError('Failed to reject candidate.');
            console.error(err);
        }
    };

    if (isLoading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Pending Candidacy Applications</h2>
            {candidates.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No pending applications at this time.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Full Name</th>
                                <th scope="col" className="px-6 py-3">Office</th>
                                <th scope="col" className="px-6 py-3">Party</th>
                                <th scope="col" className="px-6 py-3">Declared At</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map(candidate => (
                                <tr key={candidate.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{candidate.fullName}</td>
                                    <td className="px-6 py-4">{candidate.office}</td>
                                    <td className="px-6 py-4">{candidate.party}</td>
                                    <td className="px-6 py-4">{new Date(candidate.declaredAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleApprove(candidate.id)} className="font-medium text-green-600 dark:text-green-500 hover:underline mr-4">Approve</button>
                                        <button onClick={() => handleReject(candidate.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminCandidacyPanel; 
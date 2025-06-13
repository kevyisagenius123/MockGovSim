import React, { useState, useEffect } from 'react';
// import { getUnapprovedFirms, approveFirm } from '../../services/pollingService'; // Will be used later

const AdminPollingDashboard = () => {
    const [unapprovedFirms, setUnapprovedFirms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // MOCK DATA
    const mockFirms = [
        { id: 1, name: 'Insight Polls', description: 'Focus on regional elections.', owner: { username: 'testuser1' } },
        { id: 2, name: 'National Outlook', description: 'Weekly national polling.', owner: { username: 'testuser2' } },
    ];

    useEffect(() => {
        setLoading(true);
        // MOCK API CALL
        setTimeout(() => {
            setUnapprovedFirms(mockFirms);
            setLoading(false);
        }, 1000);
    }, []);

    const handleApprove = (firmId) => {
        console.log(`Approving firm ${firmId}`);
        // Here we would call the approveFirm API
        setUnapprovedFirms(unapprovedFirms.filter(firm => firm.id !== firmId));
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin - Polling Firm Approvals</h1>
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">Pending Applications</h2>
                {unapprovedFirms.length === 0 ? (
                    <p>No pending applications.</p>
                ) : (
                    <ul className="space-y-4">
                        {unapprovedFirms.map(firm => (
                            <li key={firm.id} className="p-4 border rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg">{firm.name}</p>
                                    <p className="text-sm text-gray-600">{firm.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">Owner: {firm.owner.username}</p>
                                </div>
                                <button
                                    onClick={() => handleApprove(firm.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Approve
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AdminPollingDashboard; 
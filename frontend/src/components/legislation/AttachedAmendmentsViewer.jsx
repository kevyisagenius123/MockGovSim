import React, { useState, useEffect } from 'react';
import { getAmendmentsForBill } from '../../api/legislationApi';
import { safeCall, safeCallAsync } from '../../utils/safeCall';

const AttachedAmendmentsViewer = ({ billId }) => {
    const [amendments, setAmendments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!billId) return;
        
        const fetchAmendments = async () => {
            setIsLoading(true);
            try {
                const response = await safeCallAsync(() => getAmendmentsForBill(billId));
                setAmendments(response?.data || []);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch amendments:', error);
                setError('Could not load amendments for this bill.');
                setAmendments([]);
            } finally {
                setIsLoading(false);
            }
        };

        safeCall(fetchAmendments);
    }, [billId]);

    if (isLoading) {
        return <div className="text-center p-4">Loading amendments...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Attached Amendments</h3>
            {amendments.length === 0 ? (
                <p className="text-gray-500">No amendments have been attached to this bill yet.</p>
            ) : (
                <ul className="space-y-4">
                    {amendments.map(amendment => (
                        <li key={amendment.id} className="p-4 bg-gray-50 rounded-md border border-gray-100">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">{amendment.title}</h4>
                                <span className={`px-3 py-1 text-sm rounded-full ${
                                    amendment.status === 'PROPOSED' ? 'bg-yellow-200 text-yellow-800' :
                                    amendment.status === 'APPROVED' ? 'bg-green-200 text-green-800' :
                                    'bg-red-200 text-red-800'
                                }`}>
                                    {amendment.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-2">{amendment.text}</p>
                            <p className="text-xs text-gray-400 mt-2">Sponsor ID: {amendment.sponsorId}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AttachedAmendmentsViewer; 
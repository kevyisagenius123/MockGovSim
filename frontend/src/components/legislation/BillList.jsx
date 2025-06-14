import React, { useState, useEffect } from 'react';
import { getBills } from '../../api/legislationApi';
import { safeCall, safeCallAsync } from '../../utils/safeCall';
import BillCard from './BillCard';

const BillList = ({ onBillsLoaded }) => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await safeCallAsync(getBills);
                const fetchedBills = Array.isArray(response?.data) ? response.data : [];
                setBills(fetchedBills);
                safeCall(onBillsLoaded, fetchedBills);
            } catch (error) {
                console.error('Failed to fetch bills:', error);
                setError('Could not load bills.');
                safeCall(onBillsLoaded, []);
            } finally {
                setLoading(false);
            }
        };

        safeCall(fetchBills);
    }, [onBillsLoaded]);

    if (loading) {
        return <p className="text-center text-zinc-400">Loading bills...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (bills.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bills.map((bill) => (
                <BillCard key={bill.id} bill={bill} />
            ))}
        </div>
    );
};

export default BillList; 
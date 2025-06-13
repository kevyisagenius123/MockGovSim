import React, { useState, useEffect } from 'react';
import { getBills } from '../../api/legislationApi';
import BillCard from './BillCard';

const BillList = ({ onBillsLoaded }) => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getBills()
            .then(response => {
                setBills(response.data);
                if (onBillsLoaded) {
                    onBillsLoaded(response.data);
                }
            })
            .catch(error => {
                console.error('Failed to fetch bills:', error);
                setError('Could not load bills.');
                if (onBillsLoaded) {
                    onBillsLoaded([]);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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
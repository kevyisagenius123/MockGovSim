import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient'; // Adjust this import to your actual API client
import { Link } from 'react-router-dom';
import MyPollingFirmDashboard from './MyPollingFirmDashboard'; // Import the new dashboard

const MyFirmPage = () => {
    const [firm, setFirm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyFirm = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/polling/firms/my-firm');
                setFirm(response.data);
                setError(null);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setFirm(null); // User doesn't have a firm
                } else {
                    setError('Failed to fetch firm data. Please try logging in again.');
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyFirm();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading your firm details...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    if (!firm) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">You don't own a polling firm yet.</h2>
                <p className="mb-6">Apply to create one and start publishing your own polls.</p>
                <Link to="/polling/apply" className="btn-primary">
                    Apply for a Firm
                </Link>
            </div>
        );
    }

    return <MyPollingFirmDashboard firm={firm} />;
};

export default MyFirmPage; 
import React, { useState, useEffect } from 'react';
import pollingService from '../../services/pollingService'; // Assumes this exists
import PollingFirmApplicationForm from './PollingFirmApplicationForm';
import MyPollingFirmDashboard from './MyPollingFirmDashboard'; // Will be created next

const PollingTabs = () => {
    const [activeTab, setActiveTab] = useState('myFirm');
    const [userFirm, setUserFirm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This function will fetch the user's firm status from the backend
        const fetchUserFirm = async () => {
            try {
                // We need to create this service and endpoint
                // const response = await pollingService.getMyFirm(); 
                // setUserFirm(response.data);
                setUserFirm(null); // MOCK: assume user has no firm initially
            } catch (error) {
                console.error("Error fetching user's firm:", error);
                // If 404, it just means they don't have one, which is fine
                if (error.response?.status !== 404) {
                    // Handle other errors if necessary
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserFirm();
    }, []);

    const handleApplicationSuccess = (newFirm) => {
        setUserFirm(newFirm); // Update state to show the pending firm status
    };

    const renderMyFirmContent = () => {
        if (loading) {
            return <div>Loading your firm status...</div>;
        }
        if (userFirm) {
            return <MyPollingFirmDashboard firm={userFirm} />;
        }
        return <PollingFirmApplicationForm onApplicationSuccess={handleApplicationSuccess} />;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'aggregate':
                return <div className="p-4">Aggregate Averages View (coming soon)</div>;
            case 'allPolls':
                return <div className="p-4">All Released Polls (coming soon)</div>;
            case 'myFirm':
                return renderMyFirmContent();
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('aggregate')}
                        className={`${
                            activeTab === 'aggregate'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                    >
                        Aggregate Averages
                    </button>
                    {/* Add more tabs here */}
                    <button
                        onClick={() => setActiveTab('myFirm')}
                        className={`${
                            activeTab === 'myFirm'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                    >
                        My Polling Firm
                    </button>
                </nav>
            </div>
            <div className="mt-6">{renderContent()}</div>
        </div>
    );
};

export default PollingTabs; 
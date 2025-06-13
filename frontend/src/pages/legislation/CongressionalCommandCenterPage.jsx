import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBillById, getWhipBreakdown } from '../../api/legislationApi';
import AttachedAmendmentsViewer from '../../components/legislation/AttachedAmendmentsViewer';
import WhipBreakdownChart from '../../components/legislation/WhipBreakdownChart';
import LiveBillTracker from '../../components/legislation/LiveBillTracker';
import BillViabilityPredictor from '../../components/legislation/BillViabilityPredictor';
import ThreeDChamberVisualization from '../../components/legislation/ThreeDChamberVisualization';

const CongressionalCommandCenterPage = () => {
    const { billId } = useParams();
    const [bill, setBill] = useState(null);
    const [whipBreakdown, setWhipBreakdown] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const billPromise = getBillById(billId);
                const whipPromise = getWhipBreakdown(billId);
                
                const [billResponse, whipResponse] = await Promise.all([billPromise, whipPromise]);
                
                setBill(billResponse.data);
                setWhipBreakdown(whipResponse.data);
            } catch (err) {
                console.error("Failed to fetch command center data:", err);
                setError("Could not load bill details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [billId]);

    if (isLoading) {
        return <div className="text-center p-8">Loading Command Center...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    if (!bill) {
        return <div className="text-center p-8">Bill not found.</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">{bill.title}</h1>
                <p className="text-lg text-gray-500 mt-2">{bill.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                     <span className={`px-4 py-1 text-sm font-semibold rounded-full ${
                        bill.status === 'INTRODUCED' ? 'bg-blue-100 text-blue-800' :
                        bill.status === 'IN_COMMITTEE' ? 'bg-yellow-100 text-yellow-800' :
                        bill.status === 'PASSED_HOUSE' ? 'bg-green-100 text-green-800' :
                        bill.status === 'PASSED_SENATE' ? 'bg-purple-100 text-purple-800' :
                        bill.status === 'SIGNED_INTO_LAW' ? 'bg-green-200 text-green-900' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {bill.status}
                    </span>
                    <span className="text-sm text-gray-600">Sponsor: {bill.sponsor.username}</span>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <LiveBillTracker bill={bill} />
                    <ThreeDChamberVisualization />
                </div>

                <aside className="space-y-8">
                    <BillViabilityPredictor bill={bill} whipBreakdown={whipBreakdown} />
                    <WhipBreakdownChart billId={billId} initialData={whipBreakdown} />
                    <AttachedAmendmentsViewer billId={billId} />
                </aside>
            </main>
        </div>
    );
};

export default CongressionalCommandCenterPage; 
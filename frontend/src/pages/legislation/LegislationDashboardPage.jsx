import React, { useState, useRef, useEffect } from 'react';
import BillList from '../../components/legislation/BillList';
import BillIntroductionPortal from '../../components/legislation/BillIntroductionPortal';
import { ArrowDownIcon } from '@heroicons/react/24/solid';

const LegislationDashboardPage = () => {
    const [billListKey, setBillListKey] = useState(Date.now());
    const billListRef = useRef(null);
    const [hasBills, setHasBills] = useState(false);

    const handleBillSubmitted = () => {
        console.log('New bill submitted, refreshing list...');
        setBillListKey(Date.now());
    };

    const handleBillsLoaded = (bills) => {
        setHasBills(bills.length > 0);
    };

    const scrollToBills = () => {
        billListRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto p-4">
            <BillIntroductionPortal onBillSubmitted={handleBillSubmitted} />

            <div className="text-center my-10">
                {hasBills ? (
                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-white">View Active Legislation</h2>
                        <p className="text-lg text-zinc-300 mb-6">Click on a bill below to open its Congressional Command Center.</p>
                        <button onClick={scrollToBills} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition-transform duration-200 hover:scale-105">
                            <ArrowDownIcon className="h-6 w-6 mr-2" />
                            See Bills
                        </button>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto p-8 bg-zinc-800 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-white">No Bills in Chamber</h2>
                        <p className="text-zinc-300">The legislative chamber is currently empty. Use the form above to be the first to introduce a new bill and shape the future of the nation!</p>
                    </div>
                )}
            </div>

            <hr className="my-10 border-zinc-700" />

            <div ref={billListRef} className="max-w-5xl mx-auto">
                <BillList key={billListKey} onBillsLoaded={handleBillsLoaded} />
            </div>
        </div>
    );
};

export default LegislationDashboardPage; 
import React from 'react';
import RoleBanner from './RoleBanner';
import BillSubmissionCard from './BillSubmissionCard';
import BillProgressTrack from './BillProgressTrack';
import BillRulesCard from './BillRulesCard';

const BillIntroductionPortal = ({ onBillSubmitted }) => {
    return (
        <div className="max-w-5xl mx-auto p-2 md:p-6 space-y-10">
            <RoleBanner />
            <BillSubmissionCard onBillSubmitted={onBillSubmitted} />
            <BillProgressTrack />
            <BillRulesCard />
        </div>
    );
};

export default BillIntroductionPortal; 
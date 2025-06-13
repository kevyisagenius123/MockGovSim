import React from 'react';
import CandidateForm from '../../components/forms/CandidateForm';

const DeclareCandidacyPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Declare Candidacy</h1>
      <p className="text-text-secondary mb-6">
        Complete the form below to officially declare your candidacy for an upcoming election. Fill out your platform, goals, and personal details to appeal to voters.
      </p>
      <div className="bg-card shadow-xl rounded-lg p-8">
        <CandidateForm />
      </div>
    </div>
  );
};

export default DeclareCandidacyPage; 
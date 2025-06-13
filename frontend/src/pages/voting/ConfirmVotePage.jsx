import React from 'react';

const ConfirmVotePage = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-4">Confirm Your Vote</h1>
        <div className="bg-background-light p-6 rounded-lg shadow-lg">
          <p className="text-text-secondary">This page will show a summary of the user's choices before they are final.</p>
          {/* Placeholder for vote summary */}
        </div>
      </div>
    </div>
  );
};

export default ConfirmVotePage; 
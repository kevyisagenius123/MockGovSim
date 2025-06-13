import React from 'react';

const MyRolesHistoryPage = () => {
  return (
    <div className="text-white">
      <h2 className="text-3xl font-semibold mb-4">My Roles & History</h2>
      <p className="text-gray-400 mb-6">
        This page will show the user's current political position and a history of past offices held.
      </p>
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Current Role</h3>
        <p className="text-center text-gray-400">No active role.</p>
        <hr className="my-6 border-gray-600" />
        <h3 className="text-xl font-semibold mb-4">Past Roles</h3>
        <p className="text-center text-gray-400">No past roles found.</p>
      </div>
    </div>
  );
};

export default MyRolesHistoryPage; 
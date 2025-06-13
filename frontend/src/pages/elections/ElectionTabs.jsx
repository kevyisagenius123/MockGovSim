import React, { useState, useEffect } from 'react';
import ElectionCard from './ElectionCard';
import ElectionAdminForm from './ElectionAdminForm';
import apiClient from '../../api/apiClient';

const tabs = [
  { name: 'Upcoming Elections', id: 'upcoming' },
  { name: 'Ongoing Elections', id: 'ongoing' },
  { name: 'Past Elections', id: 'past' },
  { name: 'My Elections', id: 'my-elections' },
  { name: 'Admin Dashboard', id: 'admin', admin: true },
];

const ElectionTabs = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/elections');
        setElections(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch elections. Please make sure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const handleSaveElection = async (electionData) => {
    try {
      // For now, this only handles creation. We can add update logic later.
      const response = await apiClient.post('/elections', electionData);
      setElections(prevElections => [...prevElections, response.data]);
      setShowAdminForm(false);
    } catch (err) {
      setError('Failed to save the election. Check console for details.');
      console.error(err);
    }
  };

  // TODO: Add logic to check if user is admin
  const isAdmin = true;

  const upcomingElections = elections.filter(e => e.status === 'UPCOMING');
  const ongoingElections = elections.filter(e => e.status === 'ONGOING');
  const pastElections = elections.filter(e => e.status === 'CLOSED' || e.status === 'ARCHIVED');

  const renderElectionList = (list) => {
    if (list.length === 0) {
        return <p className="text-gray-400">No elections in this category.</p>;
    }
    return list.map(e => <ElectionCard key={e.id} election={e} />);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-600 bg-gray-800 text-white focus:border-accent focus:ring-accent"
          onChange={(e) => setActiveTab(e.target.value)}
          value={activeTab}
        >
          {tabs.map((tab) => (
            (!tab.admin || isAdmin) && <option key={tab.id} value={tab.id}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              (!tab.admin || isAdmin) && (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              )
            ))}
          </nav>
        </div>
      </div>
      <div className="py-6 text-white">
        {loading && <p>Loading elections...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'upcoming' && renderElectionList(upcomingElections)}
                {activeTab === 'ongoing' && renderElectionList(ongoingElections)}
                {activeTab === 'past' && renderElectionList(pastElections)}
            </div>
        )}
        
        {activeTab === 'my-elections' && <div>My Elections Content</div>}
        {activeTab === 'admin' && isAdmin && (
          <div>
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setShowAdminForm(true)}
                className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                + Create New Election
              </button>
            </div>
            {showAdminForm ? (
              <ElectionAdminForm 
                onSave={handleSaveElection}
                onCancel={() => setShowAdminForm(false)}
              />
            ) : (
              <div>
                {/* TODO: List of existing elections to edit/delete */}
                <p className="text-white">Admin dashboard to manage elections.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionTabs; 
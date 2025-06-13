import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const VotingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock elections data
    const mockElections = [
      {
        id: 1,
        name: '2024 Presidential Election',
        region: 'USA',
        office: 'President',
        electionType: 'General',
        status: 'ONGOING',
        votingSystem: 'FPTP',
        description: 'Choose the next President of the United States',
        candidateCount: 4,
        voterTurnout: 67.2
      },
      {
        id: 2,
        name: 'California Governor Election',
        region: 'CA',
        office: 'Governor',
        electionType: 'General',
        status: 'ONGOING',
        votingSystem: 'RCV',
        description: 'Select the Governor of California',
        candidateCount: 3,
        voterTurnout: 72.1
      }
    ];
    
    setElections(mockElections);
    setIsLoading(false);
  }, []);

  const handleVoteClick = (election) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/vote/${election.region}/${election.office}/${election.electionType}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Voting Center</h1>
          <p className="text-xl text-gray-400 mb-6">
            Participate in democracy by casting your vote in available elections
          </p>
          
          {!user && (
            <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <InformationCircleIcon className="w-6 h-6 text-blue-500 mr-3" />
                <div className="text-left">
                  <h3 className="font-semibold text-blue-500">Login Required</h3>
                  <p className="text-blue-400">You must be logged in to vote in elections.</p>
                </div>
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/voting/register"
            className="bg-card p-6 rounded-xl border border-border hover:border-accent transition-colors group"
          >
            <div className="flex items-center mb-4">
              <UserGroupIcon className="w-8 h-8 text-accent mr-3" />
              <h3 className="text-lg font-semibold text-white">Voter Registration</h3>
            </div>
            <p className="text-gray-400 group-hover:text-gray-300">
              Register to vote and set your voting preferences
            </p>
          </Link>

          <Link
            to="/elections"
            className="bg-card p-6 rounded-xl border border-border hover:border-accent transition-colors group"
          >
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-8 h-8 text-accent mr-3" />
              <h3 className="text-lg font-semibold text-white">Election Calendar</h3>
            </div>
            <p className="text-gray-400 group-hover:text-gray-300">
              View all upcoming and past elections
            </p>
          </Link>

          <Link
            to="/results"
            className="bg-card p-6 rounded-xl border border-border hover:border-accent transition-colors group"
          >
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="w-8 h-8 text-accent mr-3" />
              <h3 className="text-lg font-semibold text-white">Election Results</h3>
            </div>
            <p className="text-gray-400 group-hover:text-gray-300">
              View live and final election results
            </p>
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            Active Elections
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {elections.map(election => (
              <div
                key={election.id}
                className="bg-card p-6 rounded-xl border border-border hover:border-accent transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{election.name}</h3>
                    <div className="flex items-center text-gray-400 mb-2">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      <span>{election.region}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl mb-2">🗳️</div>
                    <span className="text-sm text-gray-400">{election.votingSystem}</span>
                  </div>
                </div>

                <p className="text-gray-400 mb-4">{election.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">
                    <span>{election.candidateCount} candidates</span>
                    <span className="ml-4">{election.voterTurnout}% turnout</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleVoteClick(election)}
                    className="flex items-center px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Cast Your Vote
                  </button>
                  
                  <Link
                    to="/results"
                    className="text-accent hover:underline"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VotingPage; 
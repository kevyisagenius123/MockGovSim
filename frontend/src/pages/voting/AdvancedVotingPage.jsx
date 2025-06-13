import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import useAuthStore from '../../store/authStore';
import CandidatePreviewCard from '../../components/campaigns/CandidatePreviewCard';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LockClosedIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdvancedVotingPage = () => {
  const { region, office, electionType } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [votingSystem, setVotingSystem] = useState('FPTP');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Voting selections
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  const [scoredCandidates, setScoredCandidates] = useState({});

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, name: 'Race Selection', description: 'Choose your race and voting system' },
    { id: 2, name: 'Cast Ballot', description: 'Make your candidate selections' },
    { id: 3, name: 'Review & Confirm', description: 'Review your choices before submitting' },
    { id: 4, name: 'Confirmation', description: 'Vote submitted successfully' }
  ];

  const votingSystems = [
    { 
      id: 'FPTP', 
      name: 'First Past the Post', 
      description: 'Select one candidate. Winner takes all.',
      icon: '🗳️'
    },
    { 
      id: 'RCV', 
      name: 'Ranked Choice Voting', 
      description: 'Rank candidates in order of preference.',
      icon: '📊'
    },
    { 
      id: 'APPROVAL', 
      name: 'Approval Voting', 
      description: 'Approve as many candidates as you like.',
      icon: '✅'
    },
    { 
      id: 'SCORE', 
      name: 'Score Voting', 
      description: 'Rate each candidate from 0-10.',
      icon: '⭐'
    }
  ];

  useEffect(() => {
    loadElectionData();
    checkVotingStatus();
  }, [region, office, electionType]);

  const loadElectionData = async () => {
    try {
      setIsLoading(true);
      const candidatesRes = await apiClient.get('/candidates/region', {
        params: { regionCode: region, office, electionType }
      });
      setCandidates(candidatesRes.data);
      
      setElection({
        name: `${office} Election`,
        region,
        office,
        electionType,
        votingSystem: 'FPTP',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (err) {
      setError('Failed to load election data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVotingStatus = async () => {
    try {
      setHasVoted(false);
    } catch (err) {
      console.error('Error checking voting status:', err);
    }
  };

  const handleRankedVote = (candidateId, rank) => {
    const newRanked = [...rankedCandidates];
    const existingIndex = newRanked.findIndex(r => r.candidateId === candidateId);
    
    if (existingIndex >= 0) {
      newRanked[existingIndex].rank = rank;
    } else {
      newRanked.push({ candidateId, rank });
    }
    
    setRankedCandidates(newRanked.sort((a, b) => a.rank - b.rank));
  };

  const handleApprovalVote = (candidateId) => {
    setApprovedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleScoreVote = (candidateId, score) => {
    setScoredCandidates(prev => ({
      ...prev,
      [candidateId]: score
    }));
  };

  const validateBallot = () => {
    switch (votingSystem) {
      case 'FPTP':
        return selectedCandidate !== null;
      case 'RCV':
        return rankedCandidates.length > 0;
      case 'APPROVAL':
        return approvedCandidates.length > 0;
      case 'SCORE':
        return Object.keys(scoredCandidates).length > 0;
      default:
        return false;
    }
  };

  const submitVote = async () => {
    if (!validateBallot()) {
      alert('Please make your selections before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ballotData = {
        voterId: user?.sub,
        region,
        electionType,
        votingSystem,
        rankedCandidates: votingSystem === 'RCV' ? rankedCandidates.map(r => r.candidateId) : [selectedCandidate].filter(Boolean),
        approvedCandidates: votingSystem === 'APPROVAL' ? approvedCandidates : [],
        scoredCandidates: votingSystem === 'SCORE' ? scoredCandidates : {}
      };

      await apiClient.post('/api/vote', ballotData);
      setCurrentStep(4);
      setHasVoted(true);
    } catch (err) {
      alert(err.response?.data || 'Failed to submit vote');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-accent border-accent text-white' 
                  : 'border-gray-600 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 ml-4 ${
                  currentStep > step.id ? 'bg-accent' : 'bg-gray-600'
                }`} />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );

  const renderElectionHeader = () => (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {election?.name || 'Loading...'}
          </h1>
          <p className="text-gray-300">
            {region} • {electionType} • {votingSystem}
          </p>
        </div>
        <div className="flex items-center text-accent">
          <ClockIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">7 days remaining</span>
        </div>
      </div>
    </div>
  );

  const renderVotingSystemSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Choose Voting System</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {votingSystems.map((system) => (
          <button
            key={system.id}
            onClick={() => setVotingSystem(system.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              votingSystem === system.id
                ? 'border-accent bg-accent/10 text-white'
                : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{system.icon}</span>
              <h4 className="font-semibold">{system.name}</h4>
            </div>
            <p className="text-sm opacity-80">{system.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFPTPBallot = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        🗳️ Select One Candidate
      </h3>
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedCandidate === candidate.id
              ? 'border-accent bg-accent/10'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
          onClick={() => setSelectedCandidate(candidate.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                selectedCandidate === candidate.id
                  ? 'border-accent bg-accent'
                  : 'border-gray-400'
              }`}>
                {selectedCandidate === candidate.id && (
                  <CheckCircleIcon className="w-3 h-3 text-white" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-white">{candidate.name}</h4>
                <p className="text-gray-400 text-sm">{candidate.party}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRankedChoiceBallot = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        📊 Rank Candidates in Order of Preference
      </h3>
      {candidates.map((candidate) => {
        const currentRank = rankedCandidates.find(r => r.candidateId === candidate.id)?.rank || '';
        return (
          <div
            key={candidate.id}
            className="p-4 rounded-lg border-2 border-gray-600 bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <select
                    value={currentRank}
                    onChange={(e) => handleRankedVote(candidate.id, parseInt(e.target.value))}
                    className="mr-4 pl-3 pr-8 py-1 bg-gray-700 border border-gray-600 rounded text-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Rank</option>
                    {[...Array(candidates.length).keys()].map(rank => (
                      <option key={rank + 1} value={rank + 1}>{rank + 1}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{candidate.name}</h4>
                  <p className="text-gray-400 text-sm">{candidate.party}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderApprovalBallot = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        ✅ Approve All Candidates You Support
      </h3>
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            approvedCandidates.includes(candidate.id)
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
          onClick={() => handleApprovalVote(candidate.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded border-2 mr-4 flex items-center justify-center ${
                approvedCandidates.includes(candidate.id)
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-400'
              }`}>
                {approvedCandidates.includes(candidate.id) && (
                  <CheckCircleIcon className="w-3 h-3 text-white" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-white">{candidate.name}</h4>
                <p className="text-gray-400 text-sm">{candidate.party}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderScoreBallot = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        ⭐ Rate Each Candidate (0-10)
      </h3>
      {candidates.map((candidate) => {
        const score = scoredCandidates[candidate.id] || 0;
        return (
          <div
            key={candidate.id}
            className="p-4 rounded-lg border-2 border-gray-600 bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="mr-4">
                  <h4 className="font-semibold text-white">{candidate.name}</h4>
                  <p className="text-gray-400 text-sm">{candidate.party}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold w-8">{score}</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={score}
                  onChange={(e) => handleScoreVote(candidate.id, parseInt(e.target.value))}
                  className="w-32 accent-accent"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderBallotContent = () => {
    switch (votingSystem) {
      case 'FPTP':
        return renderFPTPBallot();
      case 'RCV':
        return renderRankedChoiceBallot();
      case 'APPROVAL':
        return renderApprovalBallot();
      case 'SCORE':
        return renderScoreBallot();
      default:
        return null;
    }
  };

  const renderConfirmationStep = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Vote Submitted Successfully!</h2>
        <p className="text-gray-400">
          Your vote has been securely recorded and cannot be changed.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Vote Summary</h3>
        <div className="text-left space-y-2">
          <p className="text-gray-300">
            <span className="font-semibold">Election:</span> {election?.name}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Voting System:</span> {votingSystem}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Submitted:</span> {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/vote')}
          className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
        >
          View Other Elections
        </button>
        <button
          onClick={() => navigate('/results')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          View Results
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading election data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Election</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/vote')}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="text-center">
          <LockClosedIcon className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-400 mb-4">You must be logged in to vote.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
          >
            Login to Vote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {renderStepIndicator()}
        {renderElectionHeader()}

        {currentStep === 1 && (
          <div>
            {renderVotingSystemSelector()}
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
              >
                Continue to Ballot
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            {renderBallotContent()}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!validateBallot()}
                className="flex items-center px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Ballot
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Review Your Ballot</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-3" />
                  <p className="text-yellow-200 text-sm">
                    Once submitted, your vote cannot be changed. Please review carefully.
                  </p>
                </div>
                
                <div className="text-gray-300">
                  <p><span className="font-semibold">Voting System:</span> {votingSystem}</p>
                  {votingSystem === 'FPTP' && selectedCandidate && (
                    <p><span className="font-semibold">Selected:</span> {candidates.find(c => c.id === selectedCandidate)?.name}</p>
                  )}
                  {votingSystem === 'RCV' && rankedCandidates.length > 0 && (
                    <div>
                      <p className="font-semibold">Ranked Choices:</p>
                      <ol className="list-decimal list-inside ml-4">
                        {rankedCandidates.map((ranked, index) => {
                          const candidate = candidates.find(c => c.id === ranked.candidateId);
                          return (
                            <li key={ranked.candidateId}>{candidate?.name}</li>
                          );
                        })}
                      </ol>
                    </div>
                  )}
                  {votingSystem === 'APPROVAL' && approvedCandidates.length > 0 && (
                    <div>
                      <p className="font-semibold">Approved Candidates:</p>
                      <ul className="list-disc list-inside ml-4">
                        {approvedCandidates.map(candidateId => {
                          const candidate = candidates.find(c => c.id === candidateId);
                          return (
                            <li key={candidateId}>{candidate?.name}</li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {votingSystem === 'SCORE' && Object.keys(scoredCandidates).length > 0 && (
                    <div>
                      <p className="font-semibold">Candidate Scores:</p>
                      <ul className="list-disc list-inside ml-4">
                        {Object.entries(scoredCandidates).map(([candidateId, score]) => {
                          const candidate = candidates.find(c => c.id === parseInt(candidateId));
                          return (
                            <li key={candidateId}>{candidate?.name}: {score}/10</li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Ballot
              </button>
              <button
                onClick={submitVote}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-4 h-4 mr-2" />
                    Submit Vote
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && renderConfirmationStep()}
      </div>
    </div>
  );
};

export default AdvancedVotingPage; 
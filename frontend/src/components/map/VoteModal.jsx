import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import CandidatePreviewCard from '../campaigns/CandidatePreviewCard';
import useAuthStore from '../../store/authStore';

const VoteModal = ({ isOpen, onClose, region, office, electionType }) => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen && region && office && electionType) {
        const fetchCandidates = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('/candidates/region', {
                    params: { regionCode: region, office, electionType }
                });
                setCandidates(response.data);
            } catch (err) {
                setError('Failed to fetch candidates for this election.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidates();
    }
  }, [isOpen, region, office, electionType]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
        alert('Please select a candidate to vote for.');
        return;
    }
    
    const voteDto = {
      voterId: user?.sub,
      regionCode: region,
      electionType: electionType,
      office: office,
      candidateId: selectedCandidate,
    };

    try {
        await apiClient.post('/votes/cast', voteDto);
        alert(`Vote for ${voteDto.candidateId} in ${region} submitted successfully!`);
        onClose();
    } catch (err) {
        alert(err.response?.data || 'An error occurred while submitting your vote.');
        console.error(err);
    }
  };
  
  const renderBallot = () => {
    if (isLoading) return <p className="text-center">Loading candidates...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (candidates.length === 0) return <p className="text-center">No approved candidates for this election.</p>;

    return candidates.map((candidate) => (
        <label key={candidate.id} className={`p-2 rounded-lg cursor-pointer border-2 ${selectedCandidate === candidate.id ? 'border-accent' : 'border-transparent'}`} onClick={() => setSelectedCandidate(candidate.id)}>
            <CandidatePreviewCard candidate={candidate} />
            <input type="radio" name="candidate" value={candidate.id} className="hidden" />
        </label>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
        <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
             <div className="p-6 sm:p-8">
                <header className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Vote in {region}</h1>
                    <p className="text-lg text-text-secondary">{office} - {electionType} Election</p>
                </header>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-xl" style={{border: "1px solid rgba(255, 255, 255, 0.1)"}}>
                        <h2 className="text-xl font-semibold border-b border-gray-700 pb-3 mb-4 text-white">Select a Candidate</h2>
                        <div className="space-y-3" style={{maxHeight: '50vh', overflowY: 'auto'}}>{renderBallot()}</div>
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 bg-accent text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:opacity-90">
                        Submit Vote
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}

export default VoteModal; 
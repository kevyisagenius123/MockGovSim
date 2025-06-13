import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import CandidatePreviewCard from '../components/campaigns/CandidatePreviewCard';

const CandidatesPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get('/candidates/approved');
                setCandidates(response.data);
            } catch (err) {
                setError('Failed to fetch candidates.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter(c => 
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.office.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-2 text-center text-accent">Candidates</h1>
            <p className="text-lg text-text-secondary text-center mb-8">Browse all approved candidates running for office.</p>
            
            <div className="mb-8 max-w-md mx-auto">
                <input 
                    type="text"
                    placeholder="Search by name, party, or office..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-background-dark border border-border rounded-md focus:ring-accent focus:border-accent"
                />
            </div>

            {isLoading && <p className="text-center">Loading candidates...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCandidates.length > 0 ? (
                    filteredCandidates.map(candidate => (
                        <CandidatePreviewCard key={candidate.id} candidate={candidate} />
                    ))
                ) : (
                    !isLoading && <p className="col-span-full text-center text-text-secondary">No candidates found.</p>
                )}
            </div>
        </div>
    );
};

export default CandidatesPage; 
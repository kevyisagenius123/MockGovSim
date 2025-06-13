import React from 'react';
import { useParams } from 'react-router-dom';

const CandidateProfilePage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Candidate Profile: {id}</h1>
      <p>This is the public-facing campaign site for a candidate, showing their bio, policies, and region map.</p>
    </div>
  );
};

export default CandidateProfilePage; 
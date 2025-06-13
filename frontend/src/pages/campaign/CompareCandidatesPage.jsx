import React from 'react';
import { useParams } from 'react-router-dom';

const CompareCandidatesPage = () => {
  const { raceId } = useParams();

  return (
    <div>
      <h1>Compare Candidates for Race: {raceId}</h1>
      <p>This page will provide a head-to-head view of candidates in a specific race.</p>
    </div>
  );
};

export default CompareCandidatesPage; 
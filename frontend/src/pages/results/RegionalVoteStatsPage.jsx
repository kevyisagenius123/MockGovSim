import React from 'react';
import { useParams } from 'react-router-dom';

const RegionalVoteStatsPage = () => {
  const { regionId } = useParams();

  return (
    <div>
      <h1>Live Results for {regionId}</h1>
      <p>This page will show live results for a specific state or district.</p>
    </div>
  );
};

export default RegionalVoteStatsPage; 
import React from 'react';
import { useParams } from 'react-router-dom';

const LiveDebateViewerPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Live Debate Viewer: {id}</h1>
      <p>This page will provide a live AMA/debate experience for a specific event.</p>
    </div>
  );
};

export default LiveDebateViewerPage; 
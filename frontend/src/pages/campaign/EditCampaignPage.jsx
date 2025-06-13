import React from 'react';
import { useParams } from 'react-router-dom';

const EditCampaignPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Edit Campaign Page</h1>
      <p>Editing campaign for candidate ID: {id}</p>
      <p>This is where a candidate can update their platform, slogan, and bio.</p>
    </div>
  );
};

export default EditCampaignPage; 
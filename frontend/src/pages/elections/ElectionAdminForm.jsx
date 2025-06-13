import React, { useState, useEffect } from 'react';

const ElectionAdminForm = ({ election, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    region: '',
    office: '',
    electionType: 'GENERAL',
    votingSystem: 'FPTP',
    startDate: '',
    endDate: '',
    status: 'UPCOMING'
  });

  useEffect(() => {
    if (election) {
      setFormData({
        name: election.name || '',
        country: election.country || '',
        region: election.region || '',
        office: election.office || '',
        electionType: election.electionType || 'GENERAL',
        votingSystem: election.votingSystem || 'FPTP',
        startDate: election.startDate ? election.startDate.substring(0, 16) : '',
        endDate: election.endDate ? election.endDate.substring(0, 16) : '',
        status: election.status || 'UPCOMING'
      });
    }
  }, [election]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputStyle = "mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent";
  const labelStyle = "block text-sm font-medium text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white">{election ? 'Edit Election' : 'Create New Election'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={labelStyle}>Election Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
        </div>
        <div>
          <label htmlFor="office" className={labelStyle}>Office</label>
          <input type="text" name="office" id="office" value={formData.office} onChange={handleChange} className={inputStyle} required />
        </div>
        <div>
          <label htmlFor="country" className={labelStyle}>Country</label>
          <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="region" className={labelStyle}>Region</label>
          <input type="text" name="region" id="region" value={formData.region} onChange={handleChange} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="electionType" className={labelStyle}>Election Type</label>
          <select name="electionType" id="electionType" value={formData.electionType} onChange={handleChange} className={inputStyle}>
            <option>GENERAL</option>
            <option>PRIMARY</option>
            <option>RUNOFF</option>
            <option>RECALL</option>
          </select>
        </div>
        <div>
          <label htmlFor="votingSystem" className={labelStyle}>Voting System</label>
          <select name="votingSystem" id="votingSystem" value={formData.votingSystem} onChange={handleChange} className={inputStyle}>
            <option>FPTP</option>
            <option>RCV</option>
            <option>APPROVAL</option>
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className={labelStyle}>Start Date</label>
          <input type="datetime-local" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="endDate" className={labelStyle}>End Date</label>
          <input type="datetime-local" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className={inputStyle} />
        </div>
         <div>
          <label htmlFor="status" className={labelStyle}>Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyle}>
            <option>UPCOMING</option>
            <option>ONGOING</option>
            <option>CLOSED</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700">
          Cancel
        </button>
        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:opacity-90">
          Save Election
        </button>
      </div>
    </form>
  );
};

export default ElectionAdminForm; 
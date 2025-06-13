import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const SubmitPollForm = () => {
    const navigate = useNavigate();
    const [myFirm, setMyFirm] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        electionType: 'Presidential',
        region: 'National',
        startDate: '',
        endDate: '',
        sampleSize: '',
        marginOfError: '',
        methodology: 'Online Panel',
        results: [{ candidateName: '', percentage: '' }]
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the user's firm to get the firmId and pollster name
        const fetchMyFirm = async () => {
            try {
                const response = await apiClient.get('/polling/firms/my-firm');
                setMyFirm(response.data);
            } catch (err) {
                setError('You must have a polling firm to submit a poll. Please apply for one first.');
            }
        };
        fetchMyFirm();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResultChange = (index, e) => {
        const { name, value } = e.target;
        const newResults = [...formData.results];
        newResults[index][name] = value;
        setFormData(prev => ({ ...prev, results: newResults }));
    };

    const addResultField = () => {
        setFormData(prev => ({
            ...prev,
            results: [...prev.results, { candidateName: '', percentage: '' }]
        }));
    };

    const removeResultField = (index) => {
        const newResults = formData.results.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, results: newResults }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!myFirm) {
            setError('Could not find your polling firm.');
            return;
        }

        const pollData = {
            ...formData,
            firmId: myFirm.id,
            pollster: myFirm.name,
            sampleSize: parseInt(formData.sampleSize, 10),
            marginOfError: parseFloat(formData.marginOfError),
            isPublished: true, // Or add a form field for this
            results: formData.results.map(r => ({
                ...r,
                percentage: parseFloat(r.percentage)
            }))
        };

        try {
            await apiClient.post('/polling/polls/submit', pollData);
            setSuccess('Poll submitted successfully!');
            setTimeout(() => navigate('/polling/my-firm'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit poll.');
            console.error(err);
        }
    };

    if (!myFirm) {
        return <div className="text-center p-8 text-red-500">{error || 'Loading firm details...'}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-background-light rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-primary mb-6">Submit a New Poll</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Poll Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Poll Title (e.g., National Tracking Poll)" className="input" required />
                    <input name="region" value={formData.region} onChange={handleInputChange} placeholder="Region (e.g., National, CA-ON)" className="input" required />
                    <input name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="input" required />
                    <input name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} className="input" required />
                    <input name="sampleSize" type="number" value={formData.sampleSize} onChange={handleInputChange} placeholder="Sample Size" className="input" required />
                    <input name="marginOfError" type="number" step="0.1" value={formData.marginOfError} onChange={handleInputChange} placeholder="Margin of Error" className="input" />
                    <select name="methodology" value={formData.methodology} onChange={handleInputChange} className="input">
                        <option>Online Panel</option>
                        <option>Interactive Voice Response (IVR)</option>
                        <option>Live Agent</option>
                        <option>Mixed-Mode</option>
                    </select>
                </div>
                
                {/* Candidate Results */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-primary">Results</h2>
                    {formData.results.map((result, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input name="candidateName" value={result.candidateName} onChange={(e) => handleResultChange(index, e)} placeholder="Candidate Name" className="input flex-grow" required />
                            <input name="percentage" type="number" step="0.1" value={result.percentage} onChange={(e) => handleResultChange(index, e)} placeholder="Percentage (%)" className="input w-32" required />
                            <button type="button" onClick={() => removeResultField(index)} className="btn-danger-sm">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addResultField} className="btn-secondary">Add Candidate</button>
                </div>

                {/* Submission */}
                <div className="pt-4">
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                    <button type="submit" className="btn-primary w-full">Submit Poll</button>
                </div>
            </form>
        </div>
    );
};

export default SubmitPollForm; 
import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';

const CandidateForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        party: '',
        office: 'President', // Default value
        regionCode: 'USA', // Default value
        electionType: 'GENERAL', //Default value
        slogan: '',
        platformStatement: '',
        previousPoliticalExperience: '',
        photoUrl: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await apiClient.post('/candidates/declare', formData);
            setSuccess('Candidacy declared successfully! You will be redirected shortly.');
            setTimeout(() => navigate('/dashboard'), 2000); // Redirect to dashboard after 2s
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while declaring candidacy.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-3 py-2 bg-background-dark border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-text-primary";
    const labelClass = "block text-sm font-bold text-text-secondary mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">{error}</div>}
            {success && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fullName" className={labelClass}>Full Name</label>
                    <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="party" className={labelClass}>Party Affiliation</label>
                    <input type="text" name="party" id="party" value={formData.party} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="slogan" className={labelClass}>Campaign Slogan</label>
                    <input type="text" name="slogan" id="slogan" value={formData.slogan} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="photoUrl" className={labelClass}>Profile Picture URL</label>
                    <input type="text" name="photoUrl" id="photoUrl" value={formData.photoUrl} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="office" className={labelClass}>Office</label>
                     <select name="office" id="office" value={formData.office} onChange={handleChange} className={inputClass} required>
                        <option value="President">President</option>
                        <option value="Senator">Senator</option>
                        <option value="Governor">Governor</option>
                        <option value="Mayor">Mayor</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="regionCode" className={labelClass}>Region</label>
                     <select name="regionCode" id="regionCode" value={formData.regionCode} onChange={handleChange} className={inputClass} required>
                        <option value="USA">USA</option>
                        <option value="CAN">Canada</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="platformStatement" className={labelClass}>Platform Statement</label>
                <textarea name="platformStatement" id="platformStatement" value={formData.platformStatement} onChange={handleChange} rows="6" className={inputClass} required></textarea>
            </div>

             <div>
                <label htmlFor="previousPoliticalExperience" className={labelClass}>Previous Political Experience</label>
                <textarea name="previousPoliticalExperience" id="previousPoliticalExperience" value={formData.previousPoliticalExperience} onChange={handleChange} rows="4" className={inputClass}></textarea>
            </div>


            <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="bg-accent hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-gray-600">
                    {isLoading ? 'Submitting...' : 'Declare Candidacy'}
                </button>
            </div>
        </form>
    );
};

export default CandidateForm; 
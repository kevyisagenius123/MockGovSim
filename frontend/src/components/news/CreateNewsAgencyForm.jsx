import React, { useState } from 'react';
import { createNewsAgency } from '../../api/newsApi';

const CreateNewsAgencyForm = () => {
    const [name, setName] = useState('');
    const [slogan, setSlogan] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const response = await createNewsAgency({ name, slogan });
            setSuccess(`News agency "${response.data.name}" created successfully!`);
            setName('');
            setSlogan('');
        } catch (err) {
            setError('Failed to create news agency. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="bg-background-light p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Create a News Agency</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="agency-name" className="block text-sm font-medium text-text-secondary mb-1">Agency Name</label>
                    <input
                        id="agency-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-background border border-gray-600 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
                <div>
                    <label htmlFor="agency-slogan" className="block text-sm font-medium text-text-secondary mb-1">Slogan</label>
                    <input
                        id="agency-slogan"
                        type="text"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-gray-600 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-accent text-white font-semibold rounded-md hover:opacity-90 transition-opacity">
                    Found Agency
                </button>
            </form>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
        </div>
    );
};

export default CreateNewsAgencyForm; 
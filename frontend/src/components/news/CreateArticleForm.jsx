import React, { useState, useEffect } from 'react';
import { createArticle, getNewsAgencies } from '../../api/newsApi';

const CreateArticleForm = () => {
    const [headline, setHeadline] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState('');
    const [newsAgencyId, setNewsAgencyId] = useState('');
    const [agencies, setAgencies] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const response = await getNewsAgencies();
                setAgencies(response.data);
                if (response.data.length > 0) {
                    setNewsAgencyId(response.data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch news agencies", err);
                // Optionally set an error state here to show in the UI
            }
        };
        fetchAgencies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!newsAgencyId) {
            setError('You must select a news agency. If none are available, please create one first.');
            return;
        }
        try {
            const response = await createArticle({ headline, body, tags, newsAgencyId });
            setSuccess(`Article "${response.data.headline}" created successfully!`);
            setHeadline('');
            setBody('');
            setTags('');
        } catch (err) {
            setError('Failed to create article. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="bg-background-light p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Write an Article</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="news-agency" className="block text-sm font-medium text-text-secondary mb-1">News Agency</label>
                    <select 
                        id="news-agency" 
                        value={newsAgencyId} 
                        onChange={(e) => setNewsAgencyId(e.target.value)} 
                        required
                        className="w-full px-3 py-2 bg-background border border-gray-600 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        {agencies.length === 0 ? (
                            <option>No agencies found. Create one first!</option>
                        ) : (
                            agencies.map(agency => (
                                <option key={agency.id} value={agency.id}>{agency.name}</option>
                            ))
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="article-headline" className="block text-sm font-medium text-text-secondary mb-1">Headline</label>
                    <input
                        id="article-headline"
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-background border border-gray-600 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
                <div>
                    <label htmlFor="article-body" className="block text-sm font-medium text-text-secondary mb-1">Body</label>
                    <textarea
                        id="article-body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-background border border-gray-600 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        rows="6"
                    />
                </div>
                <div>
                    <label htmlFor="article-tags" className="block text-sm font-medium text-text-secondary mb-1">Tags (comma-separated)</label>
                    <input
                        id="article-tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-gray-600 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-accent text-white font-semibold rounded-md hover:opacity-90 transition-opacity">
                    Publish Article
                </button>
            </form>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
        </div>
    );
};

export default CreateArticleForm; 
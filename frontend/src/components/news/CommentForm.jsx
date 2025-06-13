import React, { useState } from 'react';
import { createComment } from '../../api/newsApi';

const CommentForm = ({ articleId, parentCommentId, onCommentPosted }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await createComment({ articleId, parentCommentId, content });
            onCommentPosted(response.data);
            setContent('');
        } catch (err) {
            setError('Failed to post comment. Please try again.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                required
            />
            <div className="flex justify-end mt-2">
                <button type="submit" className="py-2 px-4 bg-accent text-white font-semibold rounded-md hover:opacity-90 transition-opacity">
                    Post Comment
                </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </form>
    );
};

export default CommentForm; 
import React, { useEffect, useState } from 'react';
import { getCommentsForArticle } from '../../api/newsApi';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';

const CommentSection = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await getCommentsForArticle(articleId);
            if (Array.isArray(response.data)) {
                setComments(response.data);
            } else {
                setComments([]);
                console.error("Comments API did not return an array:", response.data);
            }
        } catch (err) {
            console.error("Failed to load comments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (articleId) {
            fetchComments();
        }
    }, [articleId]);

    const handleCommentPosted = (newComment) => {
        // This is a simple way to update. A more sophisticated approach would be to insert the new comment into the state directly.
        fetchComments();
    };

    return (
        <div className="mt-8 bg-background-light p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Comments</h2>
            {/* Form to post a new top-level comment */}
            <CommentForm articleId={articleId} onCommentPosted={handleCommentPosted} />
            <div className="mt-6 space-y-6">
                {loading ? (
                    <p className="text-text-secondary">Loading comments...</p>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentThread 
                            key={comment.id} 
                            comment={comment} 
                            articleId={articleId} 
                            onCommentPosted={handleCommentPosted} 
                        />
                    ))
                ) : (
                    <p className="text-text-secondary">Be the first to comment.</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection; 
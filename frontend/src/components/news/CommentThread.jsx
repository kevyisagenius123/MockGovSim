import React, { useState } from 'react';
import CommentForm from './CommentForm';

const CommentThread = ({ comment, articleId, onCommentPosted }) => {
    const [isReplying, setIsReplying] = useState(false);

    const handleReplySuccess = (newReply) => {
        onCommentPosted(newReply);
        setIsReplying(false);
    };

    return (
        <div className="py-4 border-b border-gray-700">
            <div className="flex items-start space-x-3">
                {/* Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-600"></div>
                <div className="flex-1">
                    <p className="font-semibold text-text-primary">{comment.authorName}</p>
                    <p className="text-sm text-text-secondary">{new Date(comment.createdAt).toLocaleString()}</p>
                    <p className="mt-2 text-text-primary">{comment.content}</p>
                    <button onClick={() => setIsReplying(!isReplying)} className="text-sm text-accent mt-2">
                        {isReplying ? 'Cancel' : 'Reply'}
                    </button>
                </div>
            </div>

            {isReplying && (
                <div className="ml-12 mt-4">
                    <CommentForm
                        articleId={articleId}
                        parentCommentId={comment.id}
                        onCommentPosted={handleReplySuccess}
                    />
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 mt-4 space-y-4">
                    {comment.replies.map(reply => (
                        <CommentThread 
                            key={reply.id} 
                            comment={reply} 
                            articleId={articleId} 
                            onCommentPosted={onCommentPosted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentThread; 
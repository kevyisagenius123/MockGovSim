import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById } from '../api/newsApi';
import CommentSection from '../components/news/CommentSection';

const ArticleDetailPage = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await getArticleById(articleId);
                setArticle(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load article. It may not exist or the server is unavailable.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    if (loading) return <div className="text-center p-8">Loading article...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!article) return <div className="text-center p-8">Article not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-background-light p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-extrabold text-text-primary mb-4">{article.headline}</h1>
                <div className="flex items-center space-x-4 text-sm text-text-secondary mb-6">
                    <span>By {article.authorName}</span>
                    <span>|</span>
                    <span>{article.newsAgencyName}</span>
                    <span>|</span>
                    <span>{new Date(article.publishedAt).toLocaleString()}</span>
                </div>
                <div className="prose prose-invert max-w-none text-text-primary">
                    {/* This is where the rich text would be rendered */}
                    {article.body}
                </div>
            </div>
            
            <CommentSection articleId={articleId} />
        </div>
    );
};

export default ArticleDetailPage; 
import React, { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
import { getArticles } from '../../api/newsApi';

const NewsGrid = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await getArticles();
                setArticles(response.data);
            } catch (err) {
                console.error("Failed to load articles", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);


    if (loading) {
        return <div className="text-center text-text-secondary">Loading stories...</div>;
    }

    if (articles.length === 0) {
        return <div className="text-center text-text-secondary">No articles have been published yet.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
    );
};

export default NewsGrid; 
import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    return (
        <Link to={`/articles/${article.id}`} className="block">
            <div className="bg-background-light rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-200 h-full">
                {/* Placeholder for image */}
                <div className="h-40 bg-gray-700"></div>
                <div className="p-4 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold text-accent uppercase">{article.agencyName}</span>
                        <h3 className="text-lg font-bold text-text-primary mt-1 h-16 line-clamp-2">{article.headline}</h3>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">{new Date(article.publishedAt).toLocaleDateString()}</p>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard; 
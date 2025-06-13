import React from 'react';
import CreateNewsAgencyForm from './CreateNewsAgencyForm';
import CreateArticleForm from './CreateArticleForm';

const NewsSidebar = () => {
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-8">
            <CreateNewsAgencyForm />
            <CreateArticleForm />
        </aside>
    );
};

export default NewsSidebar; 
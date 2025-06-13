import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  let title = 'An error occurred!';
  let message = 'Something went wrong.';

  if (error.status === 404) {
    title = '404 Not Found';
    message = 'Sorry, the page you are looking for could not be found.';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-4">
      <h1 className="text-6xl font-bold mb-4">{title}</h1>
      <p className="text-xl mb-8">{message}</p>
      {error.statusText && <p className="text-gray-400 italic mb-8">{error.statusText}</p>}
      <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
        Go to Homepage
      </Link>
    </div>
  );
};

export default ErrorPage; 
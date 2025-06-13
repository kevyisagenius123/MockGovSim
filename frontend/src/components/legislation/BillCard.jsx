import React from 'react';
import { Link } from 'react-router-dom';

const BillCard = ({ bill }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{bill.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{bill.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Sponsor: {bill.sponsor ? bill.sponsor.username : 'N/A'}</p>
                <p className="text-sm text-gray-700 truncate">{bill.description}</p>
            </div>
            <Link to={`/legislation/bill/${bill.id}`} className="mt-4 text-center">
                <button className="w-full bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300">
                    View Command Center
                </button>
            </Link>
        </div>
    );
};

export default BillCard;

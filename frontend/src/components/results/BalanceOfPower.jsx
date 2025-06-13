import React from 'react';

const BalanceOfPower = () => {
    const senate = { dem: 48, rep: 50, ind: 2, total: 100 };
    const house = { dem: 210, rep: 225, total: 435 };

    const ProgressBar = ({ seats, total, party }) => {
        const percentage = (seats / total) * 100;
        const color = party === 'dem' ? 'bg-blue-600' : 'bg-red-600';
        // Note: The progress bar itself is a flex container for the party segments
        // This component represents just one of those segments.
        return (
            <div className={`${color} h-full`} style={{ width: `${percentage}%` }}></div>
        );
    };

    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 mt-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">Balance of Power</h3>
            {/* Senate */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg text-white">Senate</h4>
                    <span className="text-sm text-gray-400">51 to control</span>
                </div>
                <div className="flex items-center">
                    <span className="text-blue-400 font-bold text-xl w-10 text-center">{senate.dem}</span>
                    <div className="flex-grow h-6 bg-gray-700 mx-2 flex">
                        <ProgressBar seats={senate.dem} total={senate.total} party="dem" />
                        <ProgressBar seats={senate.rep} total={senate.total} party="rep" />
                    </div>
                    <span className="text-red-400 font-bold text-xl w-10 text-center">{senate.rep}</span>
                </div>
            </div>
            {/* House */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg text-white">House</h4>
                    <span className="text-sm text-gray-400">218 to control</span>
                </div>
                <div className="flex items-center">
                    <span className="text-blue-400 font-bold text-xl w-10 text-center">{house.dem}</span>
                    <div className="flex-grow h-6 bg-gray-700 mx-2 flex">
                        <ProgressBar seats={house.dem} total={house.total} party="dem" />
                        <ProgressBar seats={house.rep} total={house.total} party="rep" />
                    </div>
                    <span className="text-red-400 font-bold text-xl w-10 text-center">{house.rep}</span>
                </div>
            </div>
        </div>
    );
};

export default BalanceOfPower; 
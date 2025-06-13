import React from 'react';

const BillProgressTrack = () => {
    const steps = ['Drafted', 'In Committee', 'Debated', 'Voting', 'Passed'];
    const currentStepIndex = 0; // This will be dynamic later

    return (
        <div className="bg-zinc-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Legislative Process</h3>
            <div className="flex justify-between items-center text-sm text-zinc-300">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${index <= currentStepIndex ? 'bg-blue-500' : 'bg-zinc-700'}`}>
                                {index < currentStepIndex && <span className="text-white font-bold text-xs">✓</span>}
                            </div>
                            <span className={`mt-2 ${index === currentStepIndex ? 'text-blue-300 font-bold' : ''}`}>{step}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 ${index < currentStepIndex ? 'bg-blue-500' : 'bg-zinc-700'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default BillProgressTrack; 
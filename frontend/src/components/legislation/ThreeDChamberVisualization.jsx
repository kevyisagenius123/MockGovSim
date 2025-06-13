import React from 'react';
import { CubeTransparentIcon } from '@heroicons/react/24/outline';

const ThreeDChamberVisualization = () => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">3D Chamber Visualization</h3>
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                <CubeTransparentIcon className="h-16 w-16 text-gray-400" />
                <p className="mt-4 text-gray-500">3D visualization component coming soon.</p>
            </div>
        </div>
    );
};

export default ThreeDChamberVisualization; 
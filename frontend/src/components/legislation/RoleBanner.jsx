import React from 'react';
import useAuthStore from '../../store/authStore';

const RoleBanner = () => {
    const { user } = useAuthStore();

    // Placeholder for more complex role logic
    const primaryRole = "Senator"; 
    const party = "Liberty Bloc";
    const chamber = "Senate";

    return (
        <div className="flex items-center justify-between bg-zinc-900 rounded-lg p-4 border border-zinc-700 shadow-lg">
            <div>
                <h3 className="text-xl font-bold text-blue-400">{primaryRole}. {user?.sub || 'Alessio Moretti'}</h3>
                <p className="text-sm italic text-zinc-400">{party} • Chamber Leader</p>
            </div>
            <div className="flex gap-2">
                <span className="bg-purple-700 text-white px-3 py-1 rounded-full text-sm font-semibold">Majority Leader</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{chamber}</span>
            </div>
        </div>
    );
};

export default RoleBanner; 
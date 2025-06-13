import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { FaUsers, FaLandmark, FaBullhorn, FaUserCheck, FaSquarePen } from 'react-icons/fa6';

const StatCard = ({ icon, label, value, to }) => (
    <div className="bg-card shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-text-primary">{label}</h2>
        <p className="text-text-secondary">{value}</p>
    </div>
);

const DashboardPage = () => {
    const location = useLocation();

    const navLinks = [
        { to: '/dashboard/campaigns', label: 'My Campaigns' },
        { to: '/dashboard/profile', label: 'Edit Profile' },
        { to: '/dashboard/roles', label: 'Roles History' },
        { to: '/dashboard/declare-candidacy', label: 'Declare Candidacy', isAction: true },
    ];

    return (
        <div className="bg-background text-text-primary min-h-screen p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">My Dashboard</h1>
                <p className="text-lg text-text-secondary">
                    Your central hub for managing your political career in MockGovSim.
                </p>
            </header>

            <div className="flex flex-col md:flex-row -mx-4">
                <aside className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
                    <nav className="flex flex-col space-y-2 bg-card p-4 rounded-lg shadow-md">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={classnames(
                                    'px-4 py-2 rounded-md text-md font-medium transition-all duration-200 ease-in-out',
                                    {
                                        'bg-accent text-white shadow-sm': !link.isAction && location.pathname.startsWith(link.to),
                                        'hover:bg-background-light': !location.pathname.startsWith(link.to) && !link.isAction,
                                        'bg-green-500 hover:bg-green-600 text-white font-bold text-center mt-4 transform hover:scale-105': link.isAction
                                    }
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="w-full md:w-3/4 px-4">
                    <div className="bg-card p-6 rounded-lg shadow-md min-h-[400px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage; 
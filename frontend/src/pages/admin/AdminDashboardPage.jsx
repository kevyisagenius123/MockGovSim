import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import classnames from 'classnames';

const AdminDashboardPage = () => {
    const location = useLocation();

    const navLinks = [
        { to: '/admin/users', label: 'User Management' },
        { to: '/admin/content', label: 'Content Moderation' },
        { to: 'admin/roles', label: 'Role Manager' },
        { to: '/admin/data', label: 'Data Tools' },
        { to: '/admin/candidacy', label: 'Candidacy Review', isAction: true },
    ];

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Admin Dashboard</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Oversee and manage the simulation environment.
                </p>
            </header>

            <div className="flex flex-col md:flex-row -mx-4">
                <aside className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
                    <nav className="flex flex-col space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={classnames(
                                    'px-4 py-2 rounded-md text-md font-medium transition-all duration-200 ease-in-out',
                                    {
                                        'bg-red-600 text-white shadow-sm': location.pathname.startsWith(link.to),
                                        'hover:bg-gray-200 dark:hover:bg-gray-700': !location.pathname.startsWith(link.to) && !link.isAction,
                                        'bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-center mt-4 transform hover:scale-105': link.isAction
                                    }
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="w-full md:w-3/4 px-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[400px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage; 
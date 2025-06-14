import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Dropdown, { DropdownItem } from './Dropdown';
import { getLatestBill } from '../api/legislationApi';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [latestBillId, setLatestBillId] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        getLatestBill()
            .then(response => {
                if (response.data && response.data.id) {
                    setLatestBillId(response.data.id);
                }
            })
            .catch(error => {
                console.log("No latest bill found, hiding direct link.");
                setLatestBillId(null);
            });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClasses = "text-zinc-300 hover:bg-zinc-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeNavLinkClasses = "bg-zinc-900 text-white";

    const navContent = (
        <>
            <NavLink to="/map" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Map</NavLink>
            <Dropdown title="Elections">
                <DropdownItem to="/elections">Browse Elections</DropdownItem>
                <DropdownItem to="/candidates">View Candidates</DropdownItem>
                <DropdownItem to="/vote">Vote Now</DropdownItem>
            </Dropdown>
            <Dropdown title="Legislation">
                <DropdownItem to="/legislation">Legislation Hub</DropdownItem>
                {latestBillId && (
                    <DropdownItem to={`/legislation/bill/${latestBillId}`}>Command Center (Latest)</DropdownItem>
                )}
            </Dropdown>
            <Dropdown title="Results & Data">
                <DropdownItem to="/results">Live Hub</DropdownItem>
            </Dropdown>
            <Dropdown title="Polling">
                <DropdownItem to="/polling">Polling Dashboard</DropdownItem>
            </Dropdown>
            <NavLink to="/news" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>News</NavLink>
            
            <div className="md:ml-auto flex items-center flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                {isAuthenticated ? (
                    <>
                        <Dropdown title={user?.sub || 'Dashboard'}>
                            <DropdownItem to="/dashboard">Dashboard</DropdownItem>
                        </Dropdown>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-text-secondary hover:text-text-primary">
                            Login
                        </Link>
                        <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </>
    );

    return (
        <header className="bg-primary-dark shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-bold text-text-primary">
                        MockGovSim
                    </Link>
                    {/* Hamburger Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                        </button>
                    </div>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navContent}
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <nav className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navContent}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header; 
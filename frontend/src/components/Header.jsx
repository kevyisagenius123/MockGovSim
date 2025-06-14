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
                setLatestBillId(response.data.id);
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

    return (
        <header className="bg-primary-dark shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-bold text-text-primary">
                        MockGovSim
                    </Link>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-300 hover:text-white focus:outline-none">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <NavLink to="/map" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Map</NavLink>
                        
                        <Dropdown title="Country Maps">
                            <DropdownItem to="/map/USA">USA</DropdownItem>
                            <DropdownItem to="/map/CAN">Canada</DropdownItem>
                            <DropdownItem to="/map/UK">UK</DropdownItem>
                        </Dropdown>

                        <Dropdown title="Major Cities">
                            <DropdownItem to="/map/NY">New York</DropdownItem>
                        </Dropdown>

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
                            <DropdownItem to="/results/live">Live State View</DropdownItem>
                            <DropdownItem to="/results/leaderboards">Leaderboards</DropdownItem>
                            <DropdownItem to="/results/regional-stats">Regional Stats</DropdownItem>
                        </Dropdown>

                        <Dropdown title="Polling">
                            <DropdownItem to="/polling">Polling Dashboard</DropdownItem>
                            <DropdownItem to="/polling/my-firm">My Firm</DropdownItem>
                            <DropdownItem to="/polling/apply">Apply for Firm</DropdownItem>
                        </Dropdown>

                        <NavLink to="/news" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>News</NavLink>
                        <NavLink to="/about" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>About</NavLink>
                        
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                 <Dropdown title={user?.sub || 'Dashboard'}>
                                    <DropdownItem to="/dashboard">Dashboard Home</DropdownItem>
                                    <DropdownItem to="/dashboard/profile">Edit Profile</DropdownItem>
                                    <DropdownItem to="/dashboard/campaigns">My Campaigns</DropdownItem>
                                    <DropdownItem to="/dashboard/declare-candidacy">Declare Candidacy</DropdownItem>
                                </Dropdown>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-primary-dark transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                 <Link to="/login" className="text-text-secondary hover:text-text-primary">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90">
                                    Register
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink to="/map" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Map</NavLink>
                        <NavLink to="/elections" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Elections</NavLink>
                        <NavLink to="/legislation" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Legislation</NavLink>
                        <NavLink to="/results" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Results</NavLink>
                        <NavLink to="/polling" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Polling</NavLink>
                        <NavLink to="/news" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>News</NavLink>
                        <NavLink to="/about" className={({ isActive }) => `block ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>About</NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header; 
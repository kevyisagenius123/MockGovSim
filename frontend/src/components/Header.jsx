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
        const fetchBill = async () => {
            try {
                const response = await getLatestBill();
                if (response.data && response.data.id) {
                    setLatestBillId(response.data.id);
                }
            } catch (error) {
                console.log("No latest bill found, hiding direct link.");
                setLatestBillId(null);
            }
        };
        fetchBill();
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const closeMenu = () => setIsMenuOpen(false);

    const navLinkClasses = "text-zinc-300 hover:bg-zinc-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeNavLinkClasses = "bg-zinc-900 text-white";
    const mobileNavLinkClasses = "block text-zinc-300 hover:bg-zinc-700 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors";

    const commonNavLinks = (isMobile = false) => (
        <>
            <NavLink to="/map" className={({ isActive }) => `${isMobile ? mobileNavLinkClasses : navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={closeMenu}>Map</NavLink>
            <Dropdown title="Elections" isMobile={isMobile} closeMenu={closeMenu}>
                <DropdownItem to="/elections" onClick={closeMenu}>Browse Elections</DropdownItem>
                <DropdownItem to="/candidates" onClick={closeMenu}>View Candidates</DropdownItem>
                <DropdownItem to="/vote" onClick={closeMenu}>Vote Now</DropdownItem>
            </Dropdown>
            <Dropdown title="Legislation" isMobile={isMobile} closeMenu={closeMenu}>
                <DropdownItem to="/legislation" onClick={closeMenu}>Legislation Hub</DropdownItem>
                {latestBillId && (
                    <DropdownItem to={`/legislation/bill/${latestBillId}`} onClick={closeMenu}>Command Center (Latest)</DropdownItem>
                )}
            </Dropdown>
            <Dropdown title="Results & Data" isMobile={isMobile} closeMenu={closeMenu}>
                <DropdownItem to="/results" onClick={closeMenu}>Live Hub</DropdownItem>
            </Dropdown>
            <Dropdown title="Polling" isMobile={isMobile} closeMenu={closeMenu}>
                <DropdownItem to="/polling" onClick={closeMenu}>Polling Dashboard</DropdownItem>
            </Dropdown>
            <NavLink to="/news" className={({ isActive }) => `${isMobile ? mobileNavLinkClasses : navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={closeMenu}>News</NavLink>
        </>
    );

    const authLinks = (isMobile = false) => (
        <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'space-x-4'}`}>
            {isAuthenticated ? (
                <>
                    <Dropdown title={user?.sub || 'Dashboard'} isMobile={isMobile} closeMenu={closeMenu}>
                        <DropdownItem to="/dashboard" onClick={closeMenu}>Dashboard</DropdownItem>
                    </Dropdown>
                    <button
                        onClick={handleLogout}
                        className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className={isMobile ? mobileNavLinkClasses : "text-text-secondary hover:text-text-primary"} onClick={closeMenu}>
                        Login
                    </Link>
                    <Link to="/register" className="w-full md:w-auto text-center px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90" onClick={closeMenu}>
                        Register
                    </Link>
                </>
            )}
        </div>
    );

    return (
        <header className="bg-card shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-bold text-text-primary" onClick={closeMenu}>
                        MockGovSim
                    </Link>
                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {commonNavLinks()}
                        <div className="pl-4">
                           {authLinks()}
                        </div>
                    </nav>
                    {/* Hamburger Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open main menu">
                            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <nav className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {commonNavLinks(true)}
                        <div className="pt-4 border-t border-zinc-700">
                           {authLinks(true)}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header; 
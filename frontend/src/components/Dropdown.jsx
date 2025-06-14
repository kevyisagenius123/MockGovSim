import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ title, children, isMobile, closeMenu }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    if (isMobile) {
        return (
            <div>
                <button
                    onClick={toggleOpen}
                    className="flex justify-between items-center w-full px-3 py-2 text-text-secondary hover:text-text-primary"
                >
                    <span>{title}</span>
                    <FaChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-4"
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center space-x-2 text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none">
                <span>{title}</span>
                <FaChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-48 bg-card rounded-md shadow-lg z-20"
                    >
                        <div className="py-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const DropdownItem = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-zinc-700"
    >
        {children}
    </Link>
);

export default Dropdown; 
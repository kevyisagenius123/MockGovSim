import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center space-x-2 text-text-secondary hover:text-text-primary focus:outline-none">
                <span>{title}</span>
                <FaChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-48 bg-background-dark rounded-md shadow-lg z-10"
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

export const DropdownItem = ({ to, children }) => (
    <Link
        to={to}
        className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-700"
    >
        {children}
    </Link>
);

export default Dropdown; 
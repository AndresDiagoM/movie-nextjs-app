"use client"

import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useState, useEffect, useRef } from "react";

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Focus search input after animation completes
            setTimeout(() => {
                searchRef.current?.focus();
            }, 300);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50 p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <div 
                className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-black/95 shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full pt-20 pb-6 px-6">
                    <div className="flex-1 space-y-6">
                        <SearchBar ref={searchRef} />
                        <nav className="space-y-8">
                            <Link 
                                href="/home" 
                                onClick={() => setIsOpen(false)}
                                className="block text-lg hover:text-gray-300 transition-colors"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/movies" 
                                onClick={() => setIsOpen(false)}
                                className="block text-lg hover:text-gray-300 transition-colors"
                            >
                                Movies
                            </Link>
                            <Link 
                                href="/series" 
                                onClick={() => setIsOpen(false)}
                                className="block text-lg hover:text-gray-300 transition-colors"
                            >
                                Series
                            </Link>
                            <Link 
                                href="/trending" 
                                onClick={() => setIsOpen(false)}
                                className="block text-lg hover:text-gray-300 transition-colors"
                            >
                                Trending
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto">
                        <button className="w-full bg-white text-black py-3 px-6 rounded-full hover:bg-gray-200 transition-colors">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;

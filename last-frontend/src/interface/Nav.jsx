import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Menu, X, } from "lucide-react";
import axios from 'axios';
export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);
   

    return (


        <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-16 py-4">

                {/* Logo */}
                <h2 className="text-xl sm:text-2xl font-bold text-emerald-600">
                    HealthCare Portal
                </h2>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
                    <li><Link to="/web" className="hover:text-emerald-600 transition">Home</Link></li>
                    <li><Link to="/web/doctor" className="hover:text-emerald-600 transition">Doctor</Link></li>
                    <li><Link to="/web/about" className="hover:text-emerald-600 transition">About</Link></li>
                    <li><Link to="/web/contact" className="hover:text-emerald-600 transition">Contact</Link></li>
                </ul>

                {/* Hamburger Button */}
                <button
                    className="md:hidden text-gray-800"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden px-6 transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 py-4" : "max-h-0 overflow-hidden"
                    }`}
            >
                <ul className="flex flex-col gap-4 text-gray-700 font-medium">
                    <li><Link to="/web" onClick={() => setIsOpen(false)} className="block hover:text-emerald-600">Home</Link></li>
                    <li><Link to="/web/doctor" onClick={() => setIsOpen(false)} className="block hover:text-emerald-600">Doctor</Link></li>
                    <li><Link to="/web/about" onClick={() => setIsOpen(false)} className="block hover:text-emerald-600">About</Link></li>
                    <li><Link to="/web/contact" onClick={() => setIsOpen(false)} className="block hover:text-emerald-600">Contact</Link></li>
                </ul>
            </div>
        </nav>

    )
}

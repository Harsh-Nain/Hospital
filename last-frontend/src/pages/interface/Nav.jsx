import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";
import { Menu, X, } from "lucide-react";
export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-16 py-4">

                {/* Logo */}
                <h2 className="text-xl sm:text-2xl font-bold text-emerald-600">
                    HealthCare Portal
                </h2>

                <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
                    <li> <NavLink to="/" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold border-b-2 border-emerald-600" : "hover:text-emerald-600 transition"}    >    Home </NavLink></li>
                    <li> <NavLink to="/doctors" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold border-b-2 border-emerald-600" : "hover:text-emerald-600 transition"} >     Doctors </NavLink></li>
                    <li> <NavLink to="/about" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold border-b-2 border-emerald-600" : "hover:text-emerald-600 transition"} > About    </NavLink></li>
                    <li> <NavLink to="/contact" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold border-b-2 border-emerald-600" : "hover:text-emerald-600 transition"} > Contact</NavLink></li>
                    <li>  <NavLink to="/patient/login" onClick={() => setIsOpen(false)} className="block bg-emerald-600 text-white px-3 py-1 rounded-lg text-center  hover:bg-emerald-700" > Log in </NavLink> </li>

                </ul>

                <button className="md:hidden text-gray-800" onClick={() => setIsOpen(!isOpen)} > {isOpen ? <X size={28} /> : <Menu size={28} />} </button>
            </div>

            <div className={`md:hidden px-6 transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 py-4" : "max-h-0 overflow-hidden"}`}>
                <ul className="flex flex-col gap-4 text-gray-700 font-medium">
                    <li><NavLink to="/" onClick={() => setIsOpen(false)} className="block hover:text-emerald-600">Home</NavLink></li>
                    <li><NavLink to="/doctors" onClick={() => setIsOpen(false)} className="block hover:text-emerald-600">Doctors</NavLink></li>
                    <li><NavLink to="/about" onClick={() => setIsOpen(false)} className="block hover:text-emerald-600">About</NavLink></li>
                    <li><NavLink to="/contact" onClick={() => setIsOpen(false)} className="block hover:text-emerald-600">Contact</NavLink></li>
                    <li><NavLink to="/RoleSelection" onClick={() => setIsOpen(false)} className="block bg-emerald-600 text-white px-4 py-2 rounded-lg text-center  hover:bg-emerald-700" > Log in</NavLink> </li>
                </ul>
            </div>
        </nav>

    )
}

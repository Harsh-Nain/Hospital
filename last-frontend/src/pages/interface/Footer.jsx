import React from 'react'
import { Link } from "react-router-dom";
import { Phone, Mail, } from "lucide-react";

export default function Footer() {
  return (
<footer className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-500 text-white">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            HealthCare Portal
          </h2>
          <p className="mt-4 text-white text-sm leading-relaxed">
            Your trusted health partner for doctors and patients. We provide
            reliable healthcare solutions with modern technology.
          </p>

        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-white text-sm">
            <li><Link to="/" className="hover:text-white/90 transition">Home</Link></li>
            <li><Link to="/doctor" className="hover:text-white/90 transition">Doctor</Link></li>
            <li><Link to="/about" className="hover:text-white/90 transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-white/90 transition">Contact</Link></li>

          </ul>
        </div>

         <div>
          <h4 className="text-lg font-semibold mb-4 text-white">
            For professionals 
          </h4>
          <ul className="space-y-2 text-white text-sm">
            <li><Link to="/doctor/register" className="hover:text-white/90 transition">Register as doctor</Link></li>
      
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">
            Contact
          </h4>
          <div className="space-y-3 text-white text-sm">
            <p className="flex items-center gap-2">
              <Mail size={16} /> support@healthcare.com
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> +1 234 567 890
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-emerald-700 text-center py-4 text-sm text-white">
        © {new Date().getFullYear()} HealthCare Portal. All rights reserved.
      </div>
    </footer>
  )
}

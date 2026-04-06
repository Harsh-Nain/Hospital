import React from 'react'
import { Link } from "react-router-dom";
import { Phone, Mail, } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white ">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-3">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-emerald-300">
            HealthCare Portal
          </h2>
          <p className="mt-4 text-gray-300 text-sm leading-relaxed">
            Your trusted health partner for doctors and patients. We provide
            reliable healthcare solutions with modern technology.
          </p>

        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
            <li><Link to="/doctor" className="hover:text-emerald-400 transition">Doctor</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition">Contact</Link></li>

          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">
            Contact
          </h4>
          <div className="space-y-3 text-gray-300 text-sm">
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
      <div className="border-t border-emerald-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} HealthCare Portal. All rights reserved.
      </div>
    </footer>
  )
}

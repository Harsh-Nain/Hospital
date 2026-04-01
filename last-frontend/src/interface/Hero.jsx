import React from "react";
import { Phone, Calendar, Stethoscope } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-28 bg-gradient-to-r from-indigo-50 via-white to-sky-50">
      
      {/* Left Content */}
      <div className="max-w-xl text-center md:text-left space-y-6">
        
        {/* Tagline */}
        <p className="text-indigo-600 font-semibold uppercase tracking-wide">
          Trusted Healthcare Service
        </p>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Your Health, <span className="text-indigo-600">Our Priority</span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg md:text-xl">
          Experience world-class healthcare with expert doctors, modern
          facilities, and personalized care tailored just for you.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
          
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
            <Calendar size={18} />
            Book Appointment
          </button>

          <button className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105">
            <Phone size={18} />
            Emergency
          </button>

          <button className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105">
            <Stethoscope size={18} />
            Consultation
          </button>
        </div>

        {/* Stats */}
        <div className="mt-10 flex gap-10 justify-center md:justify-start text-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">500+</h3>
            <p className="text-gray-500 text-sm">Doctors</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">10k+</h3>
            <p className="text-gray-500 text-sm">Happy Patients</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">24/7</h3>
            <p className="text-gray-500 text-sm">Support</p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="mb-10 md:mb-0 relative flex justify-center md:justify-end">
        {/* Background Accent */}
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-emerald-100 rounded-full blur-2xl opacity-40"></div>

        <img
          src="https://images.unsplash.com/photo-1758691462126-2ee47c8bf9e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwYXRpZW50JTIwY29uc3VsdGF0aW9uJTIwY2FyZXxlbnwxfHx8fDE3NzIwMDU4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Doctor"
          className="relative w-72 md:w-96 rounded-3xl shadow-2xl"
        />
      </div>
    </section>
  );
}
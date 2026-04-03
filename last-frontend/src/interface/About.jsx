import React from "react";
import Footer from "./Footer";
import Nav from "./Nav";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      <Nav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-emerald-50 to-green-100 py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">

          {/* Text */}
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
              About Our Hospital
            </h2>
            <p className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed">
              At our hospital, we are committed to providing world-class healthcare
              with compassion, innovation, and dedication. Our team of expert doctors
              and staff work tirelessly to ensure the best care for every patient.
            </p>
            <p className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed">
              We believe in a holistic approach to health, combining modern medicine
              with personalized care to improve your well-being and quality of life.
            </p>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://img.freepik.com/free-vector/medical-good-team-hospital-staff-doctors-nurse-illustration_1284-53038.jpg"
              alt="Hospital staff"
              className="w-full max-w-md md:max-w-full rounded-3xl shadow-2xl object-cover h-80 sm:h-96 md:h-full transform transition-transform hover:scale-105"
            />
          </div>

        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-center">

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 text-base sm:text-lg">
              To provide compassionate, accessible, high-quality healthcare to our community.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 text-base sm:text-lg">
              To be a leading hospital recognized for excellence in patient care and innovation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h3>
            <p className="text-gray-600 text-base sm:text-lg">
              Compassion, Integrity, Excellence, Collaboration, and Innovation guide everything we do.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
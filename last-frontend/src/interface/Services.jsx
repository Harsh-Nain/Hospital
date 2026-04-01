import React from "react";
import { Phone, UserCheck } from "lucide-react";

const services = [
  {
    title: "Emergency Care",
    description: "24/7 emergency care with highly trained medical professionals.",
    icon: <Phone size={28} className="text-white" />,
    color: "bg-red-500",
  },
  {
    title: "Lab Tests",
    description: "Comprehensive lab tests using modern equipment for accurate results.",
    // icon: <Flasks size={28} className="text-white" />,
    color: "bg-blue-500",
  },
  {
    title: "Qualified Doctors",
    description: "Expert doctors with years of experience providing personalized care.",
    icon: <UserCheck size={28} className="text-white" />,
    color: "bg-emerald-500",
  },
];

export default function Services() {
  return (
    <section className="px-6 md:px-20 py-16 bg-gradient-to-b from-sky-50 to-white">
      {/* Section Title */}
      <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
        Our Services
      </h3>
      <p className="text-center text-gray-600 mt-4 max-w-xl mx-auto">
        We provide a wide range of healthcare services to ensure your well-being.
      </p>

      {/* Service Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full ${service.color} mb-4`}
            >
              {service.icon}
            </div>
            <h4 className="text-xl font-semibold text-gray-900">{service.title}</h4>
            <p className="mt-2 text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
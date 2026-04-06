import React, { useState } from "react";
import { Phone, MapPin, Mail } from "lucide-react";
import Nav from "./Nav";
import Footer from "./Footer";
import toast from "react-hot-toast";
import axios from "axios";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status) return;

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const name = formData.name?.trim();
    const email = formData.email?.trim();
    const message = formData.message?.trim();

    if (!name) return toast.error("Name is required");
    if (!email) return toast.error("Email is required");
    if (!message) return toast.error("Message is required");

    if (message.length < 10) {
      return toast.error("Message must be at least 10 characters");
    }

    try {
      setStatus(true);

      const response = await axios.post(
        `${API_URL}/admin/contact_messages`,
        { name, email, message },
        { withCredentials: true }
      );

      const data = response?.data;

      if (data?.success) {
        toast.success("Message sent successfully 🎉");

        setFormData({ name: "", email: "", message: "" });
       
      } else {
        throw new Error(data?.message || "Something went wrong");
      }

    } catch (error) {
      console.error("Submit error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Server error! Please try again.";

      toast.error(errorMessage);

    } finally {
     
      setStatus(false);
      
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Nav />

      <section className="bg-gradient-to-br from-white via-emerald-50 to-green-100 py-16 px-6 sm:px-10 lg:px-16">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Contact Us
          </h2>
          <p className="text-gray-600 mt-3">
            Have questions or need assistance? Reach out to our team and we'll get back to you promptly.
          </p>
        </div>

        {/* Content Grid */}
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-emerald-600" size={24} />
              <div>
                <h4 className="font-semibold text-gray-900">Address</h4>
                <p className="text-gray-600">123 Health Street, Wellness City, State, 12345</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-emerald-600" size={24} />
              <div>
                <h4 className="font-semibold text-gray-900">Phone</h4>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="text-emerald-600" size={24} />
              <div>
                <h4 className="font-semibold text-gray-900">Email</h4>
                <p className="text-gray-600">contact@hospital.com</p>
              </div>
            </div>

            {/* Optional Google Map */}
            <div className="mt-6">
              <iframe
                title="Hospital Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019468!2d-122.42067968468125!3d37.77928087975865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c9a5c1f47%3A0x21d3a3b5a3b5c3b6!2sHospital!5e0!3m2!1sen!2sus!4v1618390123456!5m2!1sen!2sus"
                className="w-full h-64 rounded-2xl shadow-md"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                ></textarea>
              </div>
           
            
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
              >
              {status ? "Sending.." : "Send Message"} 
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
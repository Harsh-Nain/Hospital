import { useState } from "react";
import { Phone, Mail, MapPin, Clock3, Send, ArrowRight, Building2, } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value, }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name) return toast.error("Please enter your full name");
    if (!email) return toast.error("Please enter your email address");
    if (!message) return toast.error("Please enter your message");

    if (message.length < 10) {
      return toast.error("Message should be at least 10 characters");
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/contact_messages`, { name, email, message, }, { withCredentials: true, });

      if (response?.data?.success) {
        toast.success("Your message has been sent successfully");

        setFormData({ name: "", email: "", message: "", });
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">

      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-sky-200/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2 shadow-sm">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700"> Contact & Support</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"> Get in Touch With Our Team</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We are here to answer your questions, provide guidance, and support
            you whenever needed. Send us a message and our team will respond as
            soon as possible.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900"> Contact Information</h2>
              <p className="mt-3 text-slate-600">Reach out to us through any of the following channels.</p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-sky-200 hover:bg-sky-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <MapPin size={24} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900"> Office Address</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600"> 123 Health Street, <br /> Wellness City, State 12345</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Phone size={24} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900"> Phone Number</h3>
                  <p className="mt-1 text-sm text-slate-600"> +1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-sky-200 hover:bg-sky-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <Mail size={24} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900"> Email Address</h3>
                  <p className="mt-1 text-sm text-slate-600"> support@hospital.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Clock3 size={24} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900"> Working Hours</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600"> Monday - Saturday <br /> 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
              <iframe title="Location Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019468!2d-122.42067968468125!3d37.77928087975865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c9a5c1f47%3A0x21d3a3b5a3b5c3b6!2sHospital!5e0!3m2!1sen!2sus!4v1618390123456!5m2!1sen!2sus" className="h-65 w-full" loading="lazy" allowFullScreen />
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">  Send a Message</h2>
              <p className="mt-3 text-slate-600">  Fill out the form below and we will get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">  Full Name</label>
                <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input type="email" name="email" placeholder="Enter your email address" value={formData.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">  Message</label>
                <textarea name="message" rows="7" placeholder="Write your message here..." value={formData.message} onChange={handleChange} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"></textarea>
              </div>

              <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-sky-600 to-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? ("Sending Message...") : (
                  <>
                    <Send size={18} />  Send Message   <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
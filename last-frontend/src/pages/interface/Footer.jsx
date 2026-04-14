import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, ShieldCheck, Globe, ChevronRight, Briefcase, Star, Clock3, } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Professionals", path: "/professionals" },
    { label: "Services", path: "/services" },
    { label: "Pricing", path: "/pricing" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const serviceLinks = [
    { label: "Register as Doctors", path: "/doctors" },
    { label: "Register as Lawyers", path: "/lawyers" },
    { label: "Register as Salons", path: "/salons" },
    { label: "Register as Plumbers", path: "/plumbers" },
    { label: "Register as Mechanics", path: "/mechanics" },
    { label: "Register as Electricians", path: "/electricians" },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, path: "#", color: "hover:bg-blue-50 hover:text-blue-600", },
    { icon: <Instagram size={18} />, path: "#", color: "hover:bg-pink-50 hover:text-pink-600", },
    { icon: <Twitter size={18} />, path: "#", color: "hover:bg-sky-50 hover:text-sky-600", },
    { icon: <Linkedin size={18} />, path: "#", color: "hover:bg-indigo-50 hover:text-indigo-600", },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-linear-to-br from-slate-50 via-white to-purple-50/40">

      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
      <div className="absolute top-20 right-1/3 h-52 w-52 rounded-full bg-pink-200/10 blur-3xl" />

      <div className="relative">

        <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-10">
          <div className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-linear-to-r from-purple-600 via-indigo-500 to-cyan-500 p-8 md:p-12 shadow-2xl shadow-purple-100">
            <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-cyan-200/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
                  <Sparkles size={16} />Trusted by 50,000+ Customers
                </div>
                <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">Ready To Book Trusted Professionals?</h2>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                  Find verified doctors, lawyers, salons, mechanics,
                  electricians, and more — all in one premium platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/logins" className="rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">  Explore Services</Link>
                <Link to="/join" className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20">  Join as Professional</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-5 lg:px-10">

          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-purple-600 via-indigo-500 to-cyan-500 text-white shadow-xl shadow-purple-200">
                <Sparkles size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black bg-linear-to-r from-purple-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  ServiceHub
                </h2>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">Premium Marketplace</p>
              </div>
            </div>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-600">
              ServiceHub is your all-in-one platform for finding trusted
              professionals near you. From healthcare to legal support, salons,
              home services, and repairs — everything is available in one place.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="flex items-center gap-2 text-purple-600">
                  <Briefcase size={18} />
                  <span className="text-sm font-bold">10K+</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Professionals</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="flex items-center gap-2 text-cyan-600">
                  <Star size={18} />
                  <span className="text-sm font-bold">4.9★</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Average Rating</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Clock3 size={18} />
                  <span className="text-sm font-bold">24/7</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Support</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((item, index) => (
                <Link key={index} to={item.path} className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${item.color}`}>  {item.icon}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-bold text-slate-900">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <Link to={item.path} className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-purple-600">
                    <ChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />   {item.label} </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-bold text-slate-900">Popular Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((item, index) => (
                <li key={index}>
                  <Link to={item.path} className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-cyan-600">
                    <ChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />  {item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-bold text-slate-900">Contact Us </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="rounded-xl bg-purple-50 p-2 text-purple-600"><Mail size={18} /></div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-700">nain@service.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="rounded-xl bg-cyan-50 p-2 text-cyan-600"><Phone size={18} /> </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Phone</p>
                  <p className="text-sm font-medium text-slate-700">+91 90346 85746</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><MapPin size={18} /></div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">  Location</p>
                  <p className="text-sm font-medium text-slate-700">  Jind, Haryana, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-sm text-slate-500 md:flex-row lg:px-10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <p>  © {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link to="/" className="transition hover:text-purple-600">  Privacy Policy</Link>
              <Link to="/" className="transition hover:text-cyan-600">  Terms & Conditions </Link>
              <Link to="/" className="transition hover:text-emerald-600" >  Security</Link>
              <div className="flex items-center gap-2 text-slate-400">  <Globe size={15} />English</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
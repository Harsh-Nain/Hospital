import { useState } from "react";
import { MapPin, Star, ArrowRight, Briefcase, Stethoscope, Wrench, Scissors, Scale, Car, ShieldCheck, Clock3, Sparkles, BadgeCheck, } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { title: "Doctors", icon: <Stethoscope size={28} />, count: "1,200+ Experts", color: "from-cyan-500 to-blue-500", },
  { title: "Lawyers", icon: <Scale size={28} />, count: "850+ Experts", color: "from-purple-500 to-indigo-500", },
  { title: "Salons", icon: <Scissors size={28} />, count: "600+ Experts", color: "from-pink-500 to-rose-500", },
  { title: "Plumbers", icon: <Wrench size={28} />, count: "950+ Experts", color: "from-emerald-500 to-teal-500", },
  { title: "Electricians", icon: <Briefcase size={28} />, count: "700+ Experts", color: "from-amber-500 to-orange-500", },
  { title: "Mechanics", icon: <Car size={28} />, count: "500+ Experts", color: "from-slate-500 to-gray-700", },
];

const professionals = [
  { id: 1, name: "Dr. Sarah Johnson", role: "Cardiologist", image: "https://randomuser.me/api/portraits/women/44.jpg", location: "Delhi", rating: 4.9, experience: "10 Years", price: "₹999", verified: true, },
  { id: 2, name: "Rajesh Kumar", role: "Electrician", image: "https://randomuser.me/api/portraits/men/32.jpg", location: "Sonipat", rating: 4.8, experience: "8 Years", price: "₹499", verified: true, },
  { id: 3, name: "Priya Sharma", role: "Lawyer", image: "https://randomuser.me/api/portraits/women/68.jpg", location: "Gurgaon", rating: 4.9, experience: "12 Years", price: "₹1499", verified: true, },
  { id: 4, name: "Aman Verma", role: "Mechanic", image: "https://randomuser.me/api/portraits/men/45.jpg", location: "Noida", rating: 4.7, experience: "6 Years", price: "₹699", verified: true, },
];

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">

      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-125 h-125 bg-purple-300/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-300/20 rounded-full blur-[120px]" />
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
            <Sparkles size={16} className="text-purple-500" />
            <span className="text-sm text-slate-600">Trusted Multi-Service Marketplace</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900">
            Find Trusted
            <span className="block bg-linear-to-r from-purple-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">Professionals</span>
            Anytime, Anywhere
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
            Book doctors, lawyers, salons, electricians, plumbers, mechanics,
            and more — all in one premium platform.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <h3 className="text-3xl font-black text-slate-900">10K+</h3>
              <p className="text-slate-500 text-sm mt-1">Professionals</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <h3 className="text-3xl font-black text-slate-900">50K+</h3>
              <p className="text-slate-500 text-sm mt-1">Customers</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <h3 className="text-3xl font-black text-slate-900">4.9★</h3>
              <p className="text-slate-500 text-sm mt-1">Average Rating</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80" alt="Professionals" className="rounded-[40px] shadow-2xl border border-slate-200" />

          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-lg">
            <p className="text-slate-500 text-sm">Verified Experts</p>
            <h3 className="text-3xl font-black text-cyan-500">12,000+</h3>
          </div>

          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-lg">
            <p className="text-slate-500 text-sm">Bookings Today</p>
            <h3 className="text-3xl font-black text-purple-600">1,250+</h3>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center mb-14">
          <p className="uppercase tracking-[0.3em] text-purple-600 font-semibold">Categories</p>
          <h2 className="text-4xl sm:text-5xl font-black mt-3 text-slate-900">Explore Popular Services</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item, index) => (
            <div key={index} onClick={() => navigate("/professionals")} className="group relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-8 shadow-sm hover:-translate-y-2 hover:shadow-xl transition duration-500">

              <div className={`w-16 h-16 rounded-2xl bg-linear-to-r ${item.color} flex items-center justify-center text-white shadow-lg`}>  {item.icon}</div>
              <h3 className="text-2xl font-bold mt-6 text-slate-900">  {item.title}</h3>
              <p className="text-slate-500 mt-2">{item.count}</p>
              <button className="mt-6 flex items-center gap-2 text-cyan-600 font-semibold group-hover:gap-3 transition-all">Explore <ArrowRight size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center mb-14">
          <p className="uppercase tracking-[0.3em] text-cyan-600 font-semibold">Featured Experts </p>
          <h2 className="text-5xl font-black mt-3 text-slate-900">Top Rated Professionals</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {professionals.map((person) => (
            <div key={person.id} className="relative rounded-md border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-2 hover:shadow-xl transition duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-cyan-500 rounded-t-4xl" />

              <div className="flex justify-center">
                <img src={person.image} alt={person.name} className="w-28 h-28 rounded-full object-cover border-4 border-slate-100" />
              </div>

              <div className="text-center mt-5">
                <h3 className="text-xl font-bold text-slate-900">{person.name}</h3>
                <p className="text-cyan-600 mt-1">{person.role}</p>

                <div className="flex items-center justify-center gap-1 mt-3 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span>{person.rating}</span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <p className="flex items-center justify-center gap-2"><MapPin size={14} />{person.location}</p>
                  <p className="flex items-center justify-center gap-2"><Clock3 size={14} />{person.experience}</p>
                  <p className="flex items-center justify-center gap-2"><BadgeCheck size={14} />{person.price} Starting Fee</p>
                </div>

                {person.verified && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-emerald-600 text-sm">
                    <ShieldCheck size={16} />
                    Verified Professional
                  </div>
                )}

                <button onClick={() => navigate("/logins")} className="mt-6 w-full py-3 rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:scale-105 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
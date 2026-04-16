import { ArrowRight, BadgeCheck, Briefcase, Calendar, Car, HeartPulse, MapPin, MessageCircle, PlayCircle, Scale, Scissors, ShieldCheck, Sparkles, Star, Users, Wrench, CheckCircle2, Search, Filter, } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfessionalsPage() {
    const navigate = useNavigate()

    const categories = [
        { icon: <HeartPulse size={22} />, title: "Doctors", count: "1,200+ Experts", color: "from-sky-500 to-cyan-500", },
        { icon: <Scale size={22} />, title: "Lawyers", count: "850+ Experts", color: "from-violet-500 to-purple-500", },
        { icon: <Scissors size={22} />, title: "Salon & Spa", count: "2,500+ Experts", color: "from-pink-500 to-rose-500", },
        { icon: <Wrench size={22} />, title: "Plumbers", count: "1,100+ Experts", color: "from-emerald-500 to-teal-500", },
        { icon: <Car size={22} />, title: "Mechanics", count: "900+ Experts", color: "from-orange-500 to-amber-500", },
        { icon: <Briefcase size={22} />, title: "Business", count: "650+ Experts", color: "from-indigo-500 to-blue-500", },
    ];

    const professionals = [
        { name: "Dr. Sarah Johnson", role: "Cardiologist", rating: "4.9", reviews: "2.1k Reviews", experience: "12 Years Experience", location: "New York, USA", category: "Doctors", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2", badge: "Top Rated", },
        { name: "Michael Adams", role: "Corporate Lawyer", rating: "4.8", reviews: "1.4k Reviews", experience: "10 Years Experience", location: "California, USA", category: "Lawyers", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", badge: "Verified", },
        { name: "Emma Wilson", role: "Beauty Specialist", rating: "4.9", reviews: "3.2k Reviews", experience: "8 Years Experience", location: "Los Angeles, USA", category: "Salon", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", badge: "Popular", },
        { name: "Daniel Smith", role: "Professional Plumber", rating: "4.7", reviews: "980 Reviews", experience: "7 Years Experience", location: "Chicago, USA", category: "Plumbing", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", badge: "Recommended", },
    ];

    const stats = [
        { value: "10K+", label: "Verified Professionals" },
        { value: "50K+", label: "Bookings Completed" },
        { value: "4.9★", label: "Average Rating" },
        { value: "24/7", label: "Customer Support" },
    ];

    return (
        <div className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-sky-50">

            <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl"></div>
            <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl"></div>

            <section className="relative px-6 pt-24 pb-20 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-5 py-2 shadow-md backdrop-blur-xl">
                            <Sparkles className="h-4 w-4 text-sky-600" />
                            <span className="text-sm font-semibold text-sky-700">Premium Verified Professionals</span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">Find The Best Experts For Every Service</h1>
                        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600">
                            Discover trusted professionals across healthcare, legal advice,
                            salon, plumbing, mechanics, business, and more.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
                        {stats.map((item, index) => (
                            <div key={index} className="rounded-[28px] border border-white/60 bg-white/70 p-5 text-center shadow-lg backdrop-blur-xl">
                                <h3 className="bg-linear-to-r from-sky-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">{item.value}</h3>
                                <p className="mt-2 text-sm font-medium text-slate-500">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-20 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Browse Categories</h2>
                            <p className="mt-2 text-slate-600">Explore professionals across top service categories</p>
                        </div>

                        <button onClick={() => navigate("/logins")} className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:text-sky-600 md:flex">
                            View All
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {categories.map((item, index) => (
                            <div key={index} className="group rounded-[30px] border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${item.color} text-white shadow-lg`}>{item.icon}</div>
                                <h3 className="mt-5 text-lg font-bold text-slate-900">{item.title} </h3>
                                <p className="mt-2 text-sm text-slate-500">{item.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-24 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Featured Professionals</h2>
                            <p className="mt-2 text-slate-600">Meet the highest-rated experts on our platform</p>
                        </div>

                        <button onClick={() => navigate("/logins")} className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:text-sky-600 md:flex">
                            Explore More
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                        {professionals.map((item, index) => (
                            <div key={index} className="group overflow-hidden rounded-4xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">
                                <div className="relative">
                                    <img src={item.image} alt={item.name} className="h-72 w-full object-cover" />

                                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-xl">
                                        {item.badge}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">{item.category}</span>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={16} fill="currentColor" />
                                            <span className="text-sm font-semibold text-slate-700">{item.rating}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                                    <p className="mt-2 text-sm font-medium text-slate-500">{item.role}</p>
                                    <div className="mt-5 space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-500"><BadgeCheck size={16} className="text-emerald-500" />{item.experience}</div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} className="text-rose-500" />{item.location}</div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500"><Users size={16} className="text-violet-500" />{item.reviews}</div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button onClick={() => navigate("/logins")} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-sky-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1">
                                            <Calendar size={16} />
                                            Book Now
                                        </button>

                                        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:text-sky-600">
                                            <MessageCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-24 sm:px-10 lg:px-16">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-linear-to-r from-sky-700 via-violet-700 to-purple-700 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.18)] lg:p-16">
                    <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-300/10 blur-3xl"></div>

                    <div className="relative grid items-center gap-14 lg:grid-cols-2">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
                                <ShieldCheck size={16} />
                                Verified & Trusted Platform
                            </div>
                            <h2 className="text-4xl font-bold leading-tight text-white">Join Thousands Of Professionals On Our Platform</h2>

                            <p className="mt-6 text-lg leading-8 text-sky-100">
                                Grow your business, connect with more customers, and build your
                                professional presence with our premium platform.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button className="rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 shadow-lg transition-all hover:scale-105">
                                    Become a Professional
                                </button>

                                <button className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-xl transition-all hover:scale-105">
                                    <PlayCircle size={18} className="mr-2 inline" />
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                            <div className="space-y-5">
                                {["Verified Professional Badge", "Higher Customer Visibility", "Secure Payments", "Advanced Booking Management", "24/7 Support",].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 text-white">
                                        <CheckCircle2 className="text-emerald-300" size={20} />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
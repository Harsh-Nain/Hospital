import { ArrowRight, BadgeCheck, Briefcase, Building2, Car, Clock3, HeartPulse, PlayCircle, Scale, Scissors, ShieldCheck, Sparkles, Star, Users, Wrench, Download, CheckCircle2, } from "lucide-react";

export default function About() {
  const stats = [
    { value: "50K+", label: "Bookings Completed" },
    { value: "10K+", label: "Verified Professionals" },
    { value: "25+", label: "Service Categories" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const categories = [
    { icon: <HeartPulse size={28} />, title: "Doctors", desc: "Book verified doctors and healthcare professionals instantly.", color: "from-sky-500 to-cyan-500", },
    { icon: <Scale size={28} />, title: "Lawyers", desc: "Get legal advice and consultation from trusted experts.", color: "from-violet-500 to-purple-500", },
    { icon: <Scissors size={28} />, title: "Salon & Spa", desc: "Premium beauty, salon, and grooming services at home.", color: "from-pink-500 to-rose-500", },
    { icon: <Wrench size={28} />, title: "Plumbers", desc: "Fast and reliable plumbing services whenever you need.", color: "from-emerald-500 to-teal-500", },
    { icon: <Car size={28} />, title: "Mechanics", desc: "Trusted vehicle repair and maintenance professionals.", color: "from-orange-500 to-amber-500", },
    { icon: <Briefcase size={28} />, title: "Business Services", desc: "Professional support for business and office solutions.", color: "from-indigo-500 to-blue-500", },
  ];

  const features = [
    { icon: <ShieldCheck size={28} />, title: "Verified Experts", desc: "Every professional on our platform is verified and trusted for quality service.", },
    { icon: <Clock3 size={28} />, title: "Fast Booking", desc: "Book appointments and services instantly with a seamless process.", },
    { icon: <BadgeCheck size={28} />, title: "Premium Experience", desc: "Enjoy a premium and modern experience with top-rated professionals.", },
  ];

  const testimonials = [
    { name: "Rahul Sharma", role: "Customer", review: "Amazing platform! I booked a plumber within minutes and the service was excellent.", },
    { name: "Priya Mehta", role: "Salon Client", review: "The salon and beauty services are so convenient and premium quality.", },
    { name: "Amit Verma", role: "Legal Consultation", review: "I found a trusted lawyer very quickly. The process was smooth and easy.", },
  ];

  const trustItems = ["Verified Professionals", "24/7 Customer Support", "Secure Payments", "Fast Booking Process", "Trusted by Thousands", "Premium Service Experience",];

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-sky-50">

      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl"></div>
      <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl"></div>

      <section className="relative px-6 pt-24 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-5 py-2 shadow-md backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-700">Premium Multi-Service Platform</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">Premium On-Demand Services For Every Need</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
              Book trusted professionals for healthcare, legal advice, salon,
              plumbing, mechanics, home services, and more — all in one premium
              platform.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="group flex items-center gap-2 rounded-2xl bg-linear-to-r from-sky-600 to-violet-600 px-7 py-4 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                Explore Services
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 text-sm font-semibold text-slate-700 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-sky-200 hover:text-sky-600 hover:shadow-lg">
                <PlayCircle size={18} />Watch Overview
              </button>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {stats.map((item, index) => (
                <div key={index} className="rounded-[28px] border border-white/60 bg-white/70 p-5 text-center shadow-lg backdrop-blur-xl">
                  <h3 className="bg-linear-to-r from-sky-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">{item.value} </h3>
                  <p className="mt-2 text-sm font-medium text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl"></div>

            <div className="relative overflow-hidden rounded-[40px] border border-white/60 bg-white/60 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216" alt="Professionals" className="h-164.2 w-full rounded-4xl object-cover" />

              <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-100 to-violet-100 text-violet-600">
                      <Users size={28} />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Trusted By 50,000+ Users</h4>
                      <p className="text-sm text-slate-500">Premium verified professionals across categories</p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
                    <Star size={16} fill="currentColor" />
                    4.9 Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 shadow-sm">
              <Building2 className="h-4 w-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-700">Explore Services</span>
            </div>

            <h2 className="text-4xl font-bold text-slate-900">Everything You Need In One Platform</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Find trusted professionals across healthcare, legal advice,
              beauty, repairs, home services, and much more.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((item, index) => (
              <div key={index} className="group rounded-4xl border border-white/60 bg-white/70 p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${item.color} text-white shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{item.desc}</p>
                <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition-all duration-300 hover:gap-3">
                  Explore <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold text-slate-900">Why People Trust Our Platform</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              We focus on quality, trust, convenience, and a premium customer
              experience.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((item, index) => (
              <div key={index} className="group rounded-4xl border border-white/60 bg-white/70 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-100 to-violet-100 text-violet-600">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[40px] border border-white/60 bg-white/70 p-10 shadow-xl backdrop-blur-xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-slate-900">Trusted By Thousands Of Users</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need for a seamless premium service experience.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <CheckCircle2 className="text-emerald-500" size={22} />
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold text-slate-900"> What Our Customers Say</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">Thousands of customers trust our platform every day.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <div key={index} className="rounded-4xl border border-white/60 bg-white/70 p-8 shadow-lg backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill="currentColor" />))}
                </div>

                <p className="leading-7 text-slate-600">"{item.review}"</p>
                <div className="mt-6">
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-sm text-slate-500">{item.role}</p>
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

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
                <Download size={16} />
                Available On iOS & Android
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white">Download The App & Book Services Instantly</h2>
              <p className="mt-6 text-lg leading-8 text-sky-100">
                Access premium professionals, quick bookings, secure payments,
                and trusted service providers directly from your mobile.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 shadow-lg transition-all hover:scale-105">
                  Download for iPhone
                </button>

                <button className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-xl transition-all hover:scale-105">
                  Download for Android
                </button>
              </div>
            </div>

            <div className="relative">
              <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c" alt="Mobile App" className="rounded-4xl border border-white/10 bg-white/10 object-cover p-4 backdrop-blur-xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
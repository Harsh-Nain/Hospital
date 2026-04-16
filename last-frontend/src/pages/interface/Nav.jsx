import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, ChevronDown, Stethoscope, Scale, Scissors, Wrench, Car, ShieldCheck, } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const navigate = useNavigate()

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Professionals", path: "/professionals" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const services = [
    { name: "Doctors", icon: <Stethoscope size={18} />, desc: "Verified medical experts", color: "from-cyan-500 to-blue-500", },
    { name: "Lawyers", icon: <Scale size={18} />, desc: "Trusted legal advisors", color: "from-purple-500 to-indigo-500", },
    { name: "Salons", icon: <Scissors size={18} />, desc: "Beauty & grooming experts", color: "from-pink-500 to-rose-500", },
    { name: "Plumbers", icon: <Wrench size={18} />, desc: "Home repair specialists", color: "from-emerald-500 to-teal-500", },
    { name: "Mechanics", icon: <Car size={18} />, desc: "Car repair professionals", color: "from-orange-500 to-amber-500", },
  ];

  const navLinkClass = ({ isActive }) => `relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? "bg-linear-to-r from-purple-100 to-cyan-100 text-purple-700 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`;
  const handleNavClick = () => { setIsOpen(false); window.scrollTo({ top: 0, behavior: "smooth", }); };

  return (
    <nav className="sticky rounded-4xl top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-3xl shadow-[0_10px_50px_rgba(0,0,0,0.05)]">

      <div className="absolute rounded-4xl inset-0 bg-linear-to-r from-purple-50/80 via-white to-cyan-50/80 pointer-events-none" />
      <div className="absolute top-0 left-20 h-32 w-32 rounded-full bg-purple-200/20 blur-3xl" />
      <div className="absolute top-0 right-20 h-32 w-32 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl rounded-4xl items-center justify-between px-4 sm:px-6 lg:px-10 py-4">

        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-purple-600 via-indigo-500 to-cyan-500 text-white shadow-xl shadow-purple-200 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
            <Sparkles size={24} />
            <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm" />
          </div>

          <div className="flex flex-col leading-tight">
            <h2 className="text-xl font-black tracking-tight bg-linear-to-r from-purple-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              ServiceHub
            </h2>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-400">Premium Marketplace</span>
          </div>
        </NavLink>

        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 shadow-lg shadow-slate-100 backdrop-blur-2xl">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={navLinkClass}>{item.label}</NavLink>
            ))}

            <div className="relative z-999" onMouseEnter={() => setShowServices(true)} onMouseLeave={() => setShowServices(false)}>
              <button className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                Services
                <ChevronDown size={16} />
              </button>

              <div className={`absolute left-0 top-14 w-95 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-200 backdrop-blur-3xl transition-all duration-300 ${showServices ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
                <div className="grid gap-3">
                  {services.map((item, index) => (
                    <button key={index} onClick={() => navigate("/logins")} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-left transition hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-lg">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r ${item.color} text-white shadow-md`}>  {item.icon}</div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{item.name}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <ShieldCheck size={18} />
            Trusted Platform
          </div>

          <NavLink to="/logins" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50">
            Login
          </NavLink>
        </div>

        <button className="md:hidden flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-700 shadow-lg backdrop-blur-xl transition hover:bg-purple-50 hover:text-purple-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-500 ${isOpen ? "max-h-225 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="mx-4 mb-4 rounded-4xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-3xl">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={handleNavClick} className="block rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-purple-600">
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Popular Services</h4>

            <div className="grid grid-cols-2 gap-3">
              {services.map((item, index) => (
                <button key={index} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:shadow-md">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r ${item.color} text-white`}  >    {item.icon}  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6">
            <NavLink to="/logins" onClick={handleNavClick} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100">
              Login
            </NavLink>

            <NavLink to="/join" onClick={handleNavClick} className="rounded-2xl bg-linear-to-r from-purple-600 via-indigo-500 to-cyan-500 px-4 py-3 text-center font-semibold text-white shadow-lg transition hover:scale-[1.02]">
              Join as Professional
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
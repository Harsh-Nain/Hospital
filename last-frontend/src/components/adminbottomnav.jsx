import { Link, useLocation } from "react-router-dom";
import { ChartScatter, Home, Stethoscope, Users, } from "lucide-react";

export default function AdminBottomNav() {
    const location = useLocation();

    const navItems = [
        { path: "/admin_dashboard", icon: Home, label: "Home" },
        { path: "/admin_doctors", icon: Stethoscope, label: "Doctors" },
        { path: "/admin_patients", icon: Users, label: "Patients" },
        { path: "/admin_chat", icon: ChartScatter, label: "Chats" },
    ];

    return (
        <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;

                return (
                    <Link key={item.path} to={item.path} className={`relative flex flex-col items-center justify-center gap-1 rounded-4xl py-2 transition-all duration-300 ${active ? "bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>
                        {active && (<div className="absolute inset-0 rounded-4xl bg-white/10"></div>)}

                        <div className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-300 ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                            <Icon size={18} />
                        </div>

                        <span className="relative z-10 text-[11px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
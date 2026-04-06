import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell, ChevronRight, } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminNav({ open, setOpen }) {
    const location = useLocation();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const getTitle = () => {
        if (location.pathname.includes("dashboard")) return "Dashboard";
        if (location.pathname.includes("doctors")) return "Doctors";
        if (location.pathname.includes("patients")) return "Patients";
        if (location.pathname.includes("chat")) return "Conversations";
        return "Admin Panel";
    };
    return (
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">

            <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setOpen(!open)} className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-sm">
                    <Menu size={20} />
                </button>

                <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-linear-to-br from-sky-500 to-cyan-500 text-white font-bold shadow-lg shadow-sky-200">
                    AP
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>Admin</span>
                        <ChevronRight size={14} />
                        <span className="text-slate-500">{getTitle()}</span>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                        {getTitle()}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">

                <button className="relative flex items-center justify-center w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500"></span>
                </button>

                <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow">
                        A
                    </div>

                    <div className="leading-tight">
                        <p className="text-sm font-semibold text-slate-800"> Admin</p>
                        <p className="text-xs text-slate-500"> Super Administrator</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
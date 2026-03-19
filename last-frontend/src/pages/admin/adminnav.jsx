import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const getTitle = () => {
        if (location.pathname.includes("dashboard")) return "Dashboard";
        if (location.pathname.includes("doctors")) return "Doctors";
        if (location.pathname.includes("patients")) return "Patients";
        return "Admin Panel";
    };

    return (
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-md">

            <div className="flex items-center gap-3">

                <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition">
                    <div className="w-9 h-9 bg-linear-to-br from-sky-500 to-emerald-500 text-white flex items-center justify-center rounded-full font-bold shadow">
                        AP
                    </div>
                </button>

                <div>
                    <h1 className="text-lg font-semibold text-gray-800">
                        {getTitle()}
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">
                        Manage your system efficiently
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">

                <button onClick={() => navigate("/")} className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition">
                    <LogOut size={18} />
                    <span className="hidden sm:block text-sm">Logout</span>
                </button>

            </div>
        </div>
    );
}
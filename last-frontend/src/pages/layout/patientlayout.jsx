import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/navbar";
import PatientSidebar from "../../components/Patientsidebar";
import {
    Home,
    FileText,
    User,
    MessageCircle,
    Menu,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../../components/loading";
import { SiCompilerexplorer } from "react-icons/si";

export default function PatientLayout() {
    const location = useLocation();
    const [patientInfo, setPatientInfo] = useState([]);
    const [open, setOpen] = useState(false);

    const chat = location.pathname.startsWith("/patient-chats");

    const mobileNavItems = [
        {
            icon: Home,
            label: "Home",
            path: "/dashboard-patient",
        },
        {
            icon: MessageCircle,
            label: "Chats",
            path: "/patient-chats",
        },
        {
            icon: FileText,
            label: "Records",
            path: "/reports",
        },
        {
            icon: SiCompilerexplorer,
            label: "Doctors",
            path: "/Patient-dr.suggession",
        },
        {
            icon: User,
            label: "Profile",
            path: "/patient-profile",
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-sky-50 flex overflow-hidden">

            {open && (<div onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" />)}

            <div className={`fixed lg:static top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}     >
                <div className="relative h-full">
                    <PatientSidebar patientInfo={patientInfo} setPatientInfo={setPatientInfo} />

                    <button onClick={() => setOpen(false)} className="lg:hidden absolute top-5 right-5 w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {!chat && (
                    <div className="fixed top-0 left-0 lg:left-72 right-0 z-999 px-3 sm:px-5 pt-3">
                        <div className="rounded-[1.8rem] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center">

                                {/* <button onClick={() => setOpen(true)} className="lg:hidden ml-3 w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition">
                                    <Menu size={20} />
                                </button> */}

                                <div className="flex-1">
                                    <Navbar patientInfo={patientInfo} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <main className={`flex-1 overflow-y-auto ${!chat ? "pt-24 sm:pt-28 px-3 sm:px-5 lg:px-6 pb-24 lg:pb-6" : "h-full w-full"}`}>
                    <div className={!chat ? "max-w-450 mx-auto" : ""}>
                        <Outlet context={{ patientInfo }} />
                    </div>
                </main>
            </div>

            <div className="lg:hidden fixed bottom-3 left-3 right-3 z-50">
                <div className="rounded-4xl border border-white/70 bg-white/85 backdrop-blur-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] px-2 py-2">
                    <div className="grid grid-cols-5 gap-1">
                        {mobileNavItems.map((item) => {
                            const Icon = item.icon;
                            const active = location.pathname.startsWith(item.path);

                            return (
                                <Link key={item.path} to={item.path} className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-all duration-300 ${active ? "bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"}`}>
                                    {active && (<div className="absolute inset-0 rounded-2xl bg-white/10"></div>)}

                                    <div className="relative z-10"><Icon size={18} /></div>

                                    <span className="relative z-10 text-[11px] font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
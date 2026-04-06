import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/navbar";
import PatientSidebar from "../../components/patientsidebar";
import { Home, FileText, User, MessageCircle, Menu, X, LogOut, } from "lucide-react";
import { Link } from "react-router-dom";
import { SiCompilerexplorer } from "react-icons/si";
import toast from "react-hot-toast";
import Loading from "../../components/loading"
import axios from "axios";

export default function PatientLayout() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [patientInfo, setPatientInfo] = useState([]);
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openFix, setOpenFix] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const chat = location.pathname.startsWith("/patient-chats");

    const mobileNavItems = [
        { icon: Home, label: "Home", path: "/dashboard-patient", },
        { icon: MessageCircle, label: "Chats", path: "/patient-chats", },
        { icon: FileText, label: "Records", path: "/reports", },
        { icon: SiCompilerexplorer, label: "Doctors", path: "/Patient-dr.suggession", },
        { icon: User, label: "Profile", path: "/patient-profile", },
    ];

    const handleLogout = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_URL}/logout`, { withCredentials: true, });

            if (res.data.success) {
                setLoading(false)
                navigate("/patient/login");
            }
        } catch (err) {
            setLoading(false)
            toast.error(err.response?.data?.message || "Server error!");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-sky-50 flex overflow-hidden">
            {loading && <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/50 z-99999999999"><Loading /></div>}
            {open && (<div onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" />)}

            <div className={`fixed lg:static top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}     >
                <div className="relative h-full">
                    <PatientSidebar patientInfo={patientInfo} setPatientInfo={setPatientInfo} setShowLogoutConfirm={setShowLogoutConfirm} />
                </div>
            </div>

            <div className="flex-1 flex flex-col h-screen w-full overflow-hidden">

                {!chat && (
                    <div className={`fixed top-0 left-0 ${!openFix && "lg:left-72 px-3 sm:px-5 pt-3"} right-0 z-50`}>
                        <div className="rounded-[1.8rem] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <Navbar patientInfo={patientInfo} showDoctorDetail={openFix} setshowDoctorDetail={setOpenFix} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <main className={`flex-1 overflow-y-auto ${!chat ? "pt-24 sm:pt-28 px-3 sm:px-5 lg:px-6 pb-24 lg:pb-6" : "h-screen w-full"}`}>
                    <div className={!chat ? " mx-auto" : ""}>
                        <Outlet context={{ patientInfo, setShowLogoutConfirm }} />
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

            {showLogoutConfirm && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-4xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-red-100 to-rose-100 shadow-inner">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-rose-500 text-white shadow-lg">
                                    <LogOut size={26} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800">Logout Account</h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Are you sure you want to logout from your account? You will need to
                                login again to access your dashboard.
                            </p>

                            <div className="mt-8 flex w-full gap-3">
                                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200">
                                    Cancel
                                </button>

                                <button onClick={handleLogout} className="flex-1 rounded-2xl bg-linear-to-r from-red-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(239,68,68,0.25)] transition-all hover:scale-[1.02] hover:shadow-[0_18px_35px_rgba(239,68,68,0.35)]">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
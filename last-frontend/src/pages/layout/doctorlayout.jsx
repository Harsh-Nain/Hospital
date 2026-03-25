import { Outlet, useLocation } from "react-router-dom";
import DoctorSidebar from "../../components/doctorsidebar";
import Doctornav from "../../components/doctornav"
import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, User, MessageCircle } from "lucide-react";
import Loading from "../../components/loading"

export default function DoctorLayout() {
    const location = useLocation()
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const chat = location.pathname.startsWith("/doctor-chats")

    return (
        <div className="flex min-h-screen bg-white/70">
            {loading && <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/50 z-99999999999"><Loading /></div>}

            <div className={`fixed z-50 lg:z-auto top-0 left-0 h-screen w-72 bg-white transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <DoctorSidebar />
            </div>

            <div className={`flex-1 flex ${chat && "h-screen"} overflow-hidden flex-col lg:ml-72`}>
                {!chat ? <div className="fixed top-0 left-0 lg:left-72 right-0 z-30 bg-white shadow-sm"><Doctornav /></div>
                    : <p className="px-2 md:hidden pt-3 text-xl border-b border-black/55">Last Doctor</p>}

                <main className={`${!chat && "mt-16 overflow-y-auto"} flex-1 pb-20 md:pb-12 lg:p-0`}>
                    <Outlet context={{ setLoading }} />
                </main>
            </div>

            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">

                <Link to="/dashboard-doctor" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <Home size={20} />
                    <span className="text-xs">Home</span>
                </Link>

                <Link to="/doctor-chats" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <MessageCircle size={20} />
                    <span className="text-xs">Chats</span>
                </Link>

                <Link to="/doctor-profile" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <User size={20} />
                    <span className="text-xs">Profile</span>
                </Link>
            </div>
        </div>
    );

}
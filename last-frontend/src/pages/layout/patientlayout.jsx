import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/navbar";
import PatientSidebar from "../../components/Patientsidebar";
import { Home, Calendar, FileText, User, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientLayout() {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-white/70">

            <div className={`fixed z-50 lg:z-auto top-0 left-0 h-screen w-72 bg-white transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <PatientSidebar />
            </div>

            <div className="flex-1 flex flex-col lg:ml-72">
                <div className="fixed top-0 left-0 lg:left-72 right-0 z-30 bg-white shadow-sm">
                    <Navbar />
                </div>

                <main className="mt-16 flex-1 overflow-y-auto pb-20 lg:pb-6">
                    <Outlet />
                </main>
            </div>

            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">

                <Link to="/dashboard" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <Home size={20} />
                    <span className="text-xs">Home</span>
                </Link>

                <Link to="/chats" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <MessageCircle size={20} />
                    <span className="text-xs">Chats</span>
                </Link>

                <Link to="/reports" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <FileText size={20} />
                    <span className="text-xs">Records</span>
                </Link>

                <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <User size={20} />
                    <span className="text-xs">Profile</span>
                </Link>
            </div>
        </div>
    );
}
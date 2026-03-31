import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/navbar";
import PatientSidebar from "../../components/Patientsidebar";
import { Home, FileText, User, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../../components/loading";
import { SiCompilerexplorer } from "react-icons/si";

export default function PatientLayout() {
    const location = useLocation()
    const [loading, setLoading] = useState(false);
    const [patientInfo, setPatientInfo] = useState([]);
    const [open, setOpen] = useState(false);
    const chat = location.pathname.startsWith("/patient-chats")

    return (
        <div className="flex min-h-screen bg-white">

            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-100">
                    <Loading />
                </div>
            )}

            <div className={`fixed lg:static top-0 left-0 h-full w-72 bg-white transition-transform duration-300 
                 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <PatientSidebar patientInfo={patientInfo} setPatientInfo={setPatientInfo} />
            </div>

            <div className="flex-1 flex flex-col  h-screen">

                {!chat && (<div className="fixed top-0 left-0 lg:left-72 right-0 z-30 bg-white shadow-sm"><Navbar patientInfo={patientInfo} setPatientInfo={setPatientInfo} /></div>)}

                <main className={`flex-1 ${!chat ? "mt-16 overflow-y-auto" : "h-full w-full"} pb-15 lg:pb-0`}>
                    <Outlet context={{ setLoading, patientInfo }} />
                </main>
            </div>

            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t flex justify-around py-2 z-50">
                <Link to="/dashboard-patient" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <Home size={20} />
                    <span className="text-xs">Home</span>
                </Link>

                <Link to="/patient-chats" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <MessageCircle size={20} />
                    <span className="text-xs">Chats</span>
                </Link>

                <Link to="/reports" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <FileText size={20} />
                    <span className="text-xs">Records</span>
                </Link>

                <Link to="/Patient-dr.suggession" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <SiCompilerexplorer size={20} />
                    <span className="text-xs">Doctors</span>
                </Link>

                <Link to="/patient-profile" className="flex flex-col items-center text-gray-600 hover:text-sky-600">
                    <User size={20} />
                    <span className="text-xs">Profile</span>
                </Link>
            </div>
        </div >
    );
}
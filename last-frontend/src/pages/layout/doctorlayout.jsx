import { Outlet } from "react-router-dom";
import DoctorSidebar from "../../components/doctorsidebar";
import Doctornav from "../../components/doctornav"

export default function DoctorLayout() {
    return (
        <div className="flex bg-gray-100">

            <div className="fixed left-0 top-0 h-screen w-72">
                <DoctorSidebar />
            </div>

            <div className="flex-1 ml-72 flex flex-col min-h-screen">

                <div className="fixed top-0 left-72 right-0 z-10 bg-white">
                    <Doctornav />
                </div>

                <main className="mt-16 p-6 flex-1 overflow-y-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}
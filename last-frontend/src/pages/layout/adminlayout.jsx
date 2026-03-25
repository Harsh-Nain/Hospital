import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../../components/adminsidebar";
import Loading from "../../components/loading"
import AdminBottomNav from "../../components/adminbottomnav"
import AdminNav from "../../components/adminnav";

export default function AdminLayout() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div className="flex min-h-screen bg-white/70">
            {loading && <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/50 z-99999999999"><Loading /></div>}

            <div className={`fixed z-50 lg:z-auto top-0 left-0 h-screen w-72 bg-white transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <AdminSidebar />
            </div>

            <div className="flex-1 flex flex-col lg:ml-72">
                <div className="fixed top-0 left-0 lg:left-72 right-0 z-30 bg-white shadow-sm"><AdminNav /></div>
                <main className="mt-16 flex-1 overflow-y-auto pb-20 lg:pb-6"><Outlet context={{ setLoading }} /></main>
            </div>
            <AdminBottomNav />
        </div>
    );

}
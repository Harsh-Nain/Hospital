import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../../components/adminSidebar";
import Loading from "../../components/loading";
import AdminBottomNav from "../../components/adminBottomNav";
import AdminNav from "../../components/adminnav";

export default function AdminLayout() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-sky-50 flex overflow-hidden">

            {loading && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.18)] px-8 py-7">
                        <Loading />
                    </div>
                </div>
            )}

            {open && (<div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" />)}

            <div className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="relative h-full">
                    <AdminSidebar open={open} setOpen={setOpen} />
                </div>
            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-72">

                <div className="fixed top-0 left-0 lg:left-72 right-0 z-50 px-3 sm:px-5 pt-3 bg-linear-to-br from-slate-50 via-white to-sky-50">
                    <div className="rounded-[1.8rem] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
                        <AdminNav open={open} setOpen={setOpen} />
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto pt-24 sm:pt-28 px-3 sm:px-5 lg:px-6 pb-24 lg:pb-6">
                    <div className="w-full mx-auto">
                        <Outlet context={{ setLoading }} />
                    </div>
                </main>
            </div>

            <div className="lg:hidden fixed bottom-3 left-3 right-3 z-50">
                <div className="rounded-4xl border border-white/70 bg-white/85 backdrop-blur-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
                    <AdminBottomNav />
                </div>
            </div>
        </div>
    );
}
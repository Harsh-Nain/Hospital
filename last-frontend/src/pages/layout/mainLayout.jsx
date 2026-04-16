import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Nav from "../interface/Nav";
import Footer from "../interface/Footer";
import Loading from "../../components/loading";

export default function MainLayout() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(false);
    const [doctor, setDoctors] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [patients, setPatients] = useState(0);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/auth/main`, { withCredentials: true, });

                if (res.data.success) {
                    setDoctors(res.data.doctorsList || []);
                    setReviews(res.data.reviews || []);
                    setPatients(res.data.patients || 0);
                }
            } catch (error) {
                console.log("Home Page Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800">

            <div className="fixed inset-0 -z-50 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-purple-50/40" />
                <div className="absolute top-30 left-30 h-105 w-105 rounded-full bg-purple-300/20 blur-[140px]" />
                <div className="absolute top-[20%] right-25 h-100 w-100 rounded-full bg-cyan-300/20 blur-[140px]" />
                <div className="absolute bottom-30 left-[20%] h-95 w-95 rounded-full bg-pink-300/10 blur-[140px]" />
                <div className="absolute bottom-[10%] right-[10%] h-70 w-70 rounded-full bg-emerald-300/10 blur-[120px]" />

                <div className="absolute inset-0 bg-[linear-linear(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-linear(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
            </div>

            {loading && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-950/20 backdrop-blur-xl">
                    <div className="relative overflow-hidden rounded-4xl border border-white/40 bg-white/80 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-3xl">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-50/60 via-white to-cyan-50/60" />
                        <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-purple-200/20 blur-3xl" />
                        <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-cyan-200/20 blur-3xl" />
                        <div className="relative z-10 flex flex-col items-center gap-5"><Loading /></div>
                    </div>
                </div>
            )}

            <div className="pointer-events-none fixed left-10 top-40 hidden h-20 w-20 rounded-full border border-white/40 bg-white/20 backdrop-blur-2xl lg:block" />
            <div className="pointer-events-none fixed right-16 top-[35%] hidden h-28 w-28 rounded-full border border-white/30 bg-linear-to-br from-purple-100/30 to-cyan-100/20 backdrop-blur-3xl lg:block" />
            <div className="pointer-events-none fixed bottom-20 left-[10%] hidden h-16 w-16 rounded-full border border-white/40 bg-white/30 backdrop-blur-xl lg:block" />

            <div className="relative z-10 flex min-h-screen flex-col w-full">
                <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
                    <div className="mx-auto max-w-400 rounded-4xl">
                        <div className="border border-white/50 rounded-4xl shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-3xl">
                            <Nav />
                        </div>
                    </div>
                </header>

                <main className="relative flex-1 px-3 pb-10 pt-6 sm:px-5">
                    <div className="mx-auto max-w-400">
                        <div className="relative overflow-hidden rounded-[40px] border border-white/50 bg-white/40 shadow-[0_25px_80px_rgba(15,23,42,0.06)] backdrop-blur-3xl">
                            <div className="absolute inset-0 bg-linear-to-br from-white/80 via-white/40 to-purple-50/30" />

                            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-purple-300/50 to-transparent" />
                            <div className="absolute left-0 top-20 h-60 w-60 rounded-full bg-purple-200/10 blur-3xl" />
                            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-200/10 blur-3xl" />
                            <div className="relative z-10 min-h-[60vh]"><Outlet context={{ setLoading, doctor, reviews, patients, }} /></div>
                        </div>
                    </div>
                </main>

                <footer className="relative px-3 pb-3">
                    <div className="mx-auto max-w-400">
                        <div className="overflow-hidden rounded-[40px] border border-white/50 bg-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-3xl"><Footer /></div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
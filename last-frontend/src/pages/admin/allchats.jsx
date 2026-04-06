import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminChatDoc from "../../components/adminChatDoc";
import { FiChevronRight, FiSearch } from "react-icons/fi";

export default function Allchat() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [Doctorlist, setDoctorlist] = useState([]);
    const [DoctorChatlist, setDoctorChatlist] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const getAllDoctors = async () => {
            try {
                setPageLoading(true)
                const { data } = await axios.get(`${API_URL}/admin/admin_chatlist`);
                if (data.success) {
                    setPageLoading(false)
                    setDoctorlist(data.Doctorlist);
                }
            } catch (error) {
                setPageLoading(false)
                console.log(error);
            }
        };
        getAllDoctors();
    }, [API_URL]);

    const filteredDoctors = Doctorlist.filter((doctor) => doctor.name.toLowerCase().includes(search.toLowerCase()));

    const onSelectUser = async (user) => {
        setShowChat(true);
        setSelectedUser(user);
        try {
            const { data } = await axios.get(`${API_URL}/admin/admin_chatuser?id=${user.id}`);
            if (data.success) setDoctorChatlist(data.users);

        } catch (error) {
            console.log(error);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen w-full bg-linear-to-br from-[#fff8f1] via-[#fffaf5] to-[#fff3e6] p-3 sm:p-6 animate-pulse">
                <div className="mx-auto max-w-7xl">

                    <div className="overflow-hidden rounded-[2.5rem] border border-[#f6d8b8] bg-[#fffaf5]/95 p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                                <div className="h-8 w-40 rounded-full bg-orange-100 mb-5"></div>
                                <div className="h-10 w-72 bg-slate-200 rounded mb-4"></div>
                                <div className="h-4 w-full max-w-xl bg-slate-200 rounded mb-2"></div>
                                <div className="h-4 w-5/6 max-w-lg bg-slate-200 rounded"></div>
                            </div>

                            <div className="rounded-[1.8rem] border border-[#fde7cf] bg-white/90 p-5 shadow-sm w-full sm:w-56">
                                <div className="h-3 w-24 bg-slate-200 rounded mb-4"></div>
                                <div className="h-10 w-16 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="h-8 w-52 bg-slate-200 rounded mb-3"></div>
                            <div className="h-4 w-72 bg-slate-200 rounded"></div>
                        </div>

                        <div className="w-full max-w-xl rounded-[1.8rem] border border-orange-200/70 bg-white/80 p-5 shadow-sm">
                            <div className="h-6 w-full bg-slate-200 rounded"></div>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div key={item} className="overflow-hidden rounded-4xl border border-[#f6d8b8] bg-white/95 p-6 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="h-24 w-24 rounded-[1.8rem] bg-slate-200 mb-5"></div>

                                    <div className="h-5 w-32 bg-slate-200 rounded mb-2"></div>
                                    <div className="h-4 w-40 bg-slate-200 rounded mb-5"></div>

                                    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                                        <div className="h-7 w-16 rounded-full bg-orange-100"></div>
                                        <div className="h-7 w-20 rounded-full bg-yellow-100"></div>
                                    </div>

                                    <div className="h-12 w-full rounded-[1.3rem] bg-orange-200"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {showChat ? (
                <AdminChatDoc users={DoctorChatlist} currentUser={selectedUser} goback={() => setShowChat(false)} />
            ) : (
                <div className="min-h-screen w-full bg-linear-to-br from-[#fff8f1] via-[#fffaf5] to-[#fff3e6] p-3 sm:p-6">
                    <div className="mx-auto max-w-7xl">
                        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#f6d8b8] bg-[#fffaf5]/95 p-6 shadow-[0_25px_70px_rgba(234,88,12,0.08)] sm:p-8">
                            <div className="absolute inset-0 bg-linear-to-r from-[#fff1df] via-[#fff7ed] to-[#ffedd5]" />

                            <div className="absolute -right-10 top-0 h-56 w-56 rounded-full bg-orange-200/20 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-amber-100/30 blur-3xl" />

                            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#fdba74] bg-[#fff7ed] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ea580c]">
                                        Communication Dashboard
                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight text-[#1e293b] sm:text-4xl">Doctor Chat Management</h1>

                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                                        Monitor and manage all conversations between doctors and patients
                                        with a premium warm-tone dashboard.
                                    </p>
                                </div>

                                <div className="col-span-2 rounded-[1.8rem] border border-[#fde7cf] bg-white/90 p-5 shadow-[0_10px_25px_rgba(234,88,12,0.06)] sm:col-span-1">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Conversations</p>
                                    <h3 className="mt-3 text-3xl font-bold text-[#eab308]">{Doctorlist.length}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">All Doctors Chat</h2>
                                <p className="mt-1 text-sm text-slate-500">Select a doctor to open patient conversations</p>
                            </div>

                            <div className="group relative w-full max-w-xl overflow-hidden rounded-[1.8rem] border border-orange-200/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(249,115,22,0.10)] transition-all duration-300 hover:border-orange-400 focus-within:border-orange-500 focus-within:shadow-[0_0_0_6px_rgba(249,115,22,0.15)]">
                                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#fff7ed] via-[#fffaf5] to-[#ffedd5] opacity-90" />

                                <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-orange-200 bg-linear-to-br from-orange-100 to-amber-50 text-orange-600 shadow-sm">
                                    <FiSearch size={18} className="stroke-[2.5]" />
                                </div>

                                <input type="text" placeholder="Search doctor by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="relative z-10 w-full bg-transparent py-5 pl-20 pr-6 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none" />
                                <div className="absolute bottom-0 left-0 h-0.75 w-full origin-left scale-x-0 bg-linear-to-r from-orange-500 via-amber-400 to-yellow-400 transition-transform duration-300 group-focus-within:scale-x-100" />
                            </div>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredDoctors.map((doctor) => (
                                <div key={doctor.id} onClick={() => onSelectUser(doctor)} className="group relative cursor-pointer overflow-hidden rounded-4xl border border-[#f6d8b8] bg-white/95 p-6 shadow-[0_15px_35px_rgba(234,88,12,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#fdba74] hover:shadow-[0_25px_50px_rgba(234,88,12,0.12)]">
                                    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-100/40 blur-3xl" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="relative mb-5">
                                            <img src={doctor.image || "/default-avatar.png"} alt={doctor.name} className="h-24 w-24 rounded-[1.8rem] object-cover ring-4 ring-[#fff1df] transition-all duration-300 group-hover:ring-[#fdba74]" />

                                            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
                                                <div className="h-2 w-2 rounded-full bg-white" />
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800">Dr. {doctor.name}</h3>
                                        <p className="mt-1 line-clamp-1 text-sm text-slate-500">{doctor.email}</p>

                                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">Active</span>
                                            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-600">Premium</span>
                                        </div>

                                        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-[1.3rem] bg-linear-to-r from-[#f97316] via-[#fb923c] to-[#f59e0b] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_35px_rgba(249,115,22,0.35)]">
                                            Open Chats
                                            <FiChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
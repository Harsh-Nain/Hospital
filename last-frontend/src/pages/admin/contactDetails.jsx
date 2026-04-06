import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import ShowDoctorProfile from "../../components/showDoctorProfile";

export default function ContactDetails() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [showDoctorDetail, setshowDoctorDetail] = useState(null);
    const [contacts, setcontacts] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const modals = [showDoctorDetail];
    const isAnyModalOpen = modals.some(Boolean);

    useEffect(() => {
        const root = document.documentElement;

        if (isAnyModalOpen) {
            root.classList.add("overflow-hidden");
        } else {
            root.classList.remove("overflow-hidden");
        }

        return () => {
            root.classList.remove("overflow-hidden");
        };
    }, [isAnyModalOpen]);

    useEffect(() => {
        const getData = async () => {
            try {
                setPageLoading(true);
                const res = await axios.get(`${API_URL}/admin/admin_contacts`, { withCredentials: true, });
                console.log(res.data);

                if (res.data.success) {
                    setcontacts(res.data.contacts);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setPageLoading(false);
            }
        };

        getData();
    }, [API_URL]);

    const filteredcontacts = useMemo(() => {
        return contacts.filter((doc) => {
            const search = searchTerm.toLowerCase();
            return (doc.name?.toLowerCase().includes(search) || doc.email?.toLowerCase().includes(search));
        });
    }, [contacts, searchTerm]);

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
                <div className="space-y-6 animate-pulse">
                    <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-3 h-7 w-36 rounded-full bg-slate-200"></div>
                                <div className="h-4 w-52 rounded-full bg-slate-200"></div>
                            </div>

                            <div className="lg:text-right">
                                <div className="mb-2 h-4 w-24 rounded-full bg-slate-200 lg:ml-auto"></div>
                                <div className="h-10 w-20 rounded-full bg-slate-200 lg:ml-auto"></div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="h-14 w-full rounded-2xl bg-slate-200"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-5 flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-slate-200"></div>

                                    <div className="flex-1">
                                        <div className="mb-2 h-4 w-32 rounded-full bg-slate-200"></div>
                                        <div className="mb-2 h-3 w-24 rounded-full bg-slate-200"></div>
                                        <div className="h-3 w-40 rounded-full bg-slate-200"></div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-3 w-full rounded-full bg-slate-200"></div>
                                    <div className="h-3 w-5/6 rounded-full bg-slate-200"></div>
                                    <div className="h-3 w-2/3 rounded-full bg-slate-200"></div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <div className="h-10 flex-1 rounded-xl bg-slate-200"></div>
                                    <div className="h-10 flex-1 rounded-xl bg-slate-200"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f5ff] via-[#fdfcff] to-[#fff8f1] p-4 sm:p-6">
            {showDoctorDetail && (<ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} isAdmin={true} />)}

            <div className="space-y-8">

                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 shadow-[0_25px_80px_rgba(139,92,246,0.08)] backdrop-blur-2xl">

                    <div className="absolute inset-0 bg-linear-to-br from-violet-100/60 via-white to-amber-100/40" />
                    <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
                    <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-4 inline-flex items-center rounded-full border border-violet-200 bg-violet-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700 backdrop-blur-xl"> Premium Contact Dashboard</div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-800 sm:text-5xl"> Contact Management</h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base"> Monitor customer queries, manage communications, and reviewincoming messages through a luxury premium dashboard experience.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:min-w-85">
                            <div className="rounded-[1.8rem] border border-violet-100 bg-white/80 p-5 shadow-lg backdrop-blur-xl">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total Contacts</p>
                                <h2 className="mt-3 text-3xl font-semibold text-violet-600">{contacts.length}</h2>
                            </div>

                            <div className="rounded-[1.8rem] border border-amber-100 bg-white/80 p-5 shadow-lg backdrop-blur-xl">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Search Results</p>
                                <h2 className="mt-3 text-3xl font-semibold text-amber-500">{filteredcontacts.length} </h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/80 shadow-[0_15px_40px_rgba(139,92,246,0.08)] backdrop-blur-2xl transition-all duration-300 focus-within:border-violet-300">
                    <div className="absolute inset-0 bg-linear-to-r from-violet-50 via-white to-amber-50" />

                    <div className="pointer-events-none absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-500">
                        <Search size={18} />
                    </div>

                    <input type="text" placeholder="Search by contact name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="relative z-10 w-full bg-transparent py-5 pl-20 pr-6 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none" />

                    <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-violet-500 via-pink-500 to-amber-400 transition-transform duration-300 group-focus-within:scale-x-100" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredcontacts.length > 0 ? (
                        filteredcontacts.map((contact) => (
                            <div key={contact.id} className="group relative overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(139,92,246,0.08)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-200 hover:shadow-[0_25px_60px_rgba(139,92,246,0.15)]">
                                <div className="absolute inset-0 bg-linear-to-br from-violet-50/80 via-white to-amber-50/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-200/20 blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-amber-200/20 blur-3xl" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 to-rose-400 text-2xl font-black text-white shadow-[0_10px_30px_rgba(139,92,246,0.25)]">
                                            {contact.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex-1 overflow-hidden">
                                            <h2 className="truncate text-lg font-bold text-slate-800">{contact.name}</h2>
                                            <p className="truncate text-sm text-slate-500">{contact.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 backdrop-blur-xl">
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-600"> Message</p>
                                        <p className="mt-3 text-sm leading-7 text-slate-600"> {contact.message}</p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700">
                                            ID #{contact.id}
                                        </span>

                                        <span className="text-xs font-medium text-slate-400">
                                            {new Date(contact.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-violet-200 bg-white/80 py-24 text-center shadow-[0_15px_40px_rgba(139,92,246,0.08)] backdrop-blur-2xl">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-500">
                                    <Search size={34} />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-700">No Contacts Found</h3>
                                <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">No matching contacts were found. Try searching with anothername or email address.</p>

                                <button onClick={() => setSearchTerm("")} className="mt-8 rounded-2xl bg-linear-to-r from-violet-500 via-pink-500 to-amber-400 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_40px_rgba(236,72,153,0.25)]">
                                    Clear Search
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
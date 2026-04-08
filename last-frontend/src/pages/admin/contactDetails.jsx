import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Mail, MessageSquare, CalendarDays, Hash, } from "lucide-react";

export default function ContactDetails() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [contacts, setContacts] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [page, setPage] = useState(1);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                if (page === 1) {
                    setPageLoading(true);
                } else {
                    setLoadMoreLoading(true);
                }

                const res = await axios.get(`${API_URL}/admin/admin_contacts?page=${page}&limit=9`, { withCredentials: true });

                if (res.data.success) {
                    const newContacts = res.data.contacts;
                    setContacts((prev) => page === 1 ? newContacts : [...prev, ...newContacts]);
                    const { page: currentPage, totalPages } = res.data.pagination;

                    setHasMore(currentPage < totalPages);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setPageLoading(false);
                setLoadMoreLoading(false);
            }
        };

        getData();
    }, [API_URL, page]);

    const filteredcontacts = useMemo(() => {
        return contacts.filter((contact) => {
            const search = searchTerm.toLowerCase();
            return (contact.name?.toLowerCase().includes(search) || contact.email?.toLowerCase().includes(search) || contact.message?.toLowerCase().includes(search));
        });
    }, [contacts, searchTerm]);

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-100 p-4 sm:p-6">
                <div className="space-y-6 animate-pulse">
                    <div className="rounded-[2.5rem] border border-rose-200/50 bg-white/70 p-8 shadow-[0_20px_60px_rgba(88,28,135,0.12)] backdrop-blur-xl">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-4 h-8 w-40 rounded-full bg-slate-200"></div>
                                <div className="mb-3 h-10 w-72 rounded-full bg-slate-200"></div>
                                <div className="h-4 w-96 rounded-full bg-slate-200"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-28 w-36 rounded-[1.8rem] bg-slate-200"></div>
                                <div className="h-28 w-36 rounded-[1.8rem] bg-slate-200"></div>
                            </div>
                        </div>
                    </div>
                    <div className="h-16 rounded-[1.8rem] bg-white/70 shadow-sm"></div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="rounded-4xl border border-white/60 bg-white/70 p-6 shadow-[0_15px_40px_rgba(88,28,135,0.08)] backdrop-blur-xl">
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-3xl bg-slate-200"></div>
                                    <div className="flex-1">
                                        <div className="mb-3 h-4 w-32 rounded-full bg-slate-200"></div>
                                        <div className="h-3 w-40 rounded-full bg-slate-200"></div>
                                    </div>
                                </div>
                                <div className="mb-5 h-28 rounded-3xl bg-slate-200"></div>
                                <div className="flex justify-between">
                                    <div className="h-8 w-20 rounded-full bg-slate-200"></div>
                                    <div className="h-8 w-24 rounded-full bg-slate-200"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-100 p-4 sm:p-6">

            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-rose-200/60 bg-white/80 shadow-[0_25px_80px_rgba(88,28,135,0.12)] backdrop-blur-2xl">
                    <div className="absolute inset-0 bg-linear-to-br from-rose-200/60 via-white to-pink-100/60" />
                    <div className="absolute -top-16 -left-10 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
                    <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-purple-300/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-8 p-8 lg:flex-row  lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">
                                Contact Dashboard
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-800 sm:text-5xl">Contact Management</h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base"> Review contact requests, manage customer messages, and monitor all incoming communication in one premium dashboard. </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:min-w-85">
                            <div className="rounded-[1.8rem] border border-rose-200/60 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
                                <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">Total Contacts</p>
                                <h2 className="mt-3 text-3xl font-bold text-rose-700">{contacts.length}</h2>
                            </div>

                            <div className="rounded-[1.8rem] border border-pink-200/60 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
                                <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">Search Results</p>
                                <h2 className="mt-3 text-3xl font-bold text-pink-600">{filteredcontacts.length}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-[1.8rem] border border-rose-200/60 bg-white/80 shadow-[0_15px_40px_rgba(88,28,135,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-rose-300 focus-within:border-rose-400 focus-within:shadow-[0_0_0_6px_rgba(139,92,246,0.12)]">
                    <div className="absolute inset-0 bg-linear-to-r from-rose-50 via-white to-pink-50" />

                    <div className="pointer-events-none absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-rose-200 bg-linear-to-br from-rose-100 to-pink-50 text-rose-600 shadow-sm">
                        <Search size={18} />
                    </div>

                    <input type="text" placeholder="Search by contact name, email, or message..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="relative z-10 w-full bg-transparent py-5 pl-20 pr-6 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none" />
                    <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-rose-500 via-pink-500 to-purple-500 transition-transform duration-300 group-focus-within:scale-x-100" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredcontacts.length > 0 ? (
                        filteredcontacts.map((contact) => (
                            <div key={contact.id} className="group relative overflow-hidden rounded-4xl border border-rose-200/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(88,28,135,0.10)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-rose-300 hover:shadow-[0_30px_80px_rgba(88,28,135,0.16)]">
                                <div className="absolute inset-0 bg-linear-to-br from-rose-100/70 via-white to-pink-100/60 opacity-90" />
                                <div className="absolute -top-10 right-0 h-36 w-36 rounded-full bg-rose-300/20 blur-3xl" />
                                <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-pink-300/20 blur-3xl" />

                                <div className="relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-rose-600 via-pink-500 to-purple-500 text-2xl font-black text-white shadow-[0_15px_35px_rgba(139,92,246,0.35)]">
                                                {contact.name?.charAt(0).toUpperCase()}
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate text-lg font-bold text-slate-800">{contact.name}</h2>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                                <Mail size={14} className="text-rose-500" />
                                                <span className="truncate">{contact.email}</span>
                                            </div>

                                            <div className="mt-3 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
                                                New Contact
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-inner backdrop-blur-xl">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare size={15} className="text-rose-500" />
                                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">Message</p>
                                        </div>
                                        <p className="mt-4 line-clamp-5 text-sm leading-7 text-slate-600">{contact.message}</p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                                                <Hash size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Contact ID</p>
                                                <p className="text-sm font-semibold text-slate-700">#{contact.id}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-right">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                                                <CalendarDays size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Created</p>
                                                <p className="text-sm font-semibold text-pink-600">{new Date(contact.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-rose-300 bg-white/80 py-24 text-center shadow-[0_15px_40px_rgba(88,28,135,0.08)] backdrop-blur-xl">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                                    <Search size={34} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-700"> No Contacts Found</h3>
                                <p className="mt-3 max-w-md text-sm leading-7 text-slate-500"> No matching contacts were found. Try searching with another name, email, or message keyword.</p>
                                <button onClick={() => setSearchTerm("")} className="mt-8 rounded-2xl bg-linear-to-r from-rose-600 via-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(139,92,246,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_40px_rgba(139,92,246,0.35)]">
                                    Clear Search
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {hasMore && filteredcontacts.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <button onClick={() => setPage((prev) => prev + 1)} disabled={loadMoreLoading} className="w-full rounded-2xl bg-linear-to-r from-pink-400 to-rose-400 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(139,92,246,0.25)] transition-all duration-300 cursor-pointer hover:shadow-[0_15px_40px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-70">
                            {loadMoreLoading ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
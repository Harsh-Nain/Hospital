import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import PatientCard from "../../components/PatientCard";
import ShowPatientProfile from "../../components/showPatientProfile";

export default function Allpatient() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [showPatientDetail, setshowPatientDetail] = useState(null);
    const [patients, setPatients] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const modals = [showPatientDetail];
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
                const res = await axios.get(`${API_URL}/admin/admin_patients`, { withCredentials: true, });

                if (res.data.success) {
                    setPatients(res.data.patients);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setPageLoading(false);
            }
        };

        getData();
    }, [API_URL]);

    const filteredPatients = useMemo(() => {
        return patients.filter((pat) => {
            const search = searchTerm.toLowerCase();

            return (
                pat.name?.toLowerCase().includes(search) ||
                pat.email?.toLowerCase().includes(search) ||
                pat.phone?.toLowerCase().includes(search) ||
                pat.gender?.toLowerCase().includes(search) ||
                pat.bloodGroup?.toLowerCase().includes(search)
            );
        });
    }, [patients, searchTerm]);

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-50 to-teal-100 p-4 sm:p-6">
                <div className="space-y-6 animate-pulse">
                    <div className="rounded-4xl border border-emerald-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
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

                    <div className="rounded-[1.8rem] border border-emerald-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                        <div className="h-14 w-full rounded-2xl bg-slate-200"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="rounded-4xl border border-emerald-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
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
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-50 to-teal-100 p-4 sm:p-6">
            {showPatientDetail && (<ShowPatientProfile id={showPatientDetail} setshowPatientDetail={setshowPatientDetail} />)}

            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[2.2rem] border border-emerald-200/70 bg-white/80 shadow-[0_20px_60px_rgba(16,185,129,0.12)] backdrop-blur-xl">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-200/60 via-white to-green-100/60"></div>

                    <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-green-300/20 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                                Patient Management
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-800">All Patients</h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Manage, search, and monitor all registered patients in your
                                system.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:min-w-70">
                            <div className="rounded-3xl border border-emerald-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Patients</p>
                                <h2 className="mt-2 text-3xl font-bold text-emerald-700">{patients.length}</h2>
                            </div>

                            <div className="rounded-3xl border border-green-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Search Results</p>
                                <h2 className="mt-2 text-3xl font-bold text-green-600">{filteredPatients.length}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-[1.8rem] border border-emerald-200/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(16,185,129,0.10)] transition-all duration-300 hover:border-emerald-400 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_6px_rgba(16,185,129,0.15)]">
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-100/60 via-white to-green-100/50 opacity-90" />

                    <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-100 to-green-50 text-emerald-600 shadow-sm">
                        <Search size={18} className="stroke-[2.5]" />
                    </div>

                    <input type="text" placeholder="Search by patient name, email, phone, gender or blood group..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="relative z-10 w-full bg-transparent py-5 pl-20 pr-6 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none" />
                    <div className="absolute bottom-0 left-0 h-0.75 w-full origin-left scale-x-0 bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 transition-transform duration-300 group-focus-within:scale-x-100" />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((pat, i) => (
                            <div key={i} className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]">
                                <PatientCard pat={pat} setshowPatientDetail={setshowPatientDetail} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-emerald-300 bg-white/80 py-20 text-center shadow-sm backdrop-blur-xl">
                                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                                    <Search size={32} />
                                </div>

                                <h3 className="text-xl font-semibold text-slate-700">No patients found</h3>
                                <p className="mt-2 max-w-md text-sm text-slate-500">
                                    We could not find any patients matching your search. Try using
                                    a different name, email, phone number, gender, or blood group.
                                </p>

                                <button onClick={() => setSearchTerm("")} className="mt-6 rounded-2xl bg-linear-to-r from-emerald-600 via-green-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/30">
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
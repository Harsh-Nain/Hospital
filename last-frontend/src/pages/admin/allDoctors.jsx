import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import Doctorcard from "../../components/doctorcard";
import ShowDoctorProfile from "../../components/showDoctorProfile";

export default function Alldoctors() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [showDoctorDetail, setshowDoctorDetail] = useState(null);
  const [doctors, setDoctors] = useState([]);
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
        const res = await axios.get(`${API_URL}/admin/admin_doctors`, { withCredentials: true, });

        if (res.data.success) {
          setDoctors(res.data.doctors);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    };

    getData();
  }, [API_URL]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const search = searchTerm.toLowerCase();

      return (
        doc.name?.toLowerCase().includes(search) ||
        doc.specialization?.toLowerCase().includes(search) ||
        doc.email?.toLowerCase().includes(search) ||
        doc.phone?.toLowerCase().includes(search)
      );
    });
  }, [doctors, searchTerm]);

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
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-fuchsia-50 to-purple-100 p-4 sm:p-6">
      {showDoctorDetail && (<ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} isAdmin={true} />)}

      <div className="space-y-6">

        <div className="relative overflow-hidden rounded-[2.2rem] border border-violet-200/70 bg-white/80 shadow-[0_20px_60px_rgba(88,28,135,0.12)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-linear-to-br from-violet-200/60 via-white to-fuchsia-100/60"></div>
          <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-violet-300/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-fuchsia-300/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                Doctor Management
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-800">All Doctors</h1>
              <p className="mt-2 text-sm text-slate-500">Manage, search, and monitor all registered doctors in your system.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:min-w-70">
              <div className="rounded-3xl border border-violet-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Doctors</p>
                <h2 className="mt-2 text-3xl font-bold text-violet-700">{doctors.length}</h2>
              </div>

              <div className="rounded-3xl border border-fuchsia-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Search Results</p>
                <h2 className="mt-2 text-3xl font-bold text-fuchsia-600">{filteredDoctors.length}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[1.8rem] border border-violet-200/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(88,28,135,0.10)] transition-all duration-300 hover:border-violet-400 focus-within:border-violet-500 focus-within:shadow-[0_0_0_6px_rgba(139,92,246,0.15)]">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-100/60 via-white to-fuchsia-100/50 opacity-90" />

          <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-violet-200 bg-linear-to-br from-violet-100 to-fuchsia-50 text-violet-600 shadow-sm">
            <Search size={18} className="stroke-[2.5]" />
          </div>

          <input type="text" placeholder="Search by Doctor name, specialization, email, phone" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="relative z-10 w-full bg-transparent py-5 pl-20 pr-6 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none" />
          <div className="absolute bottom-0 left-0 h-0.75 w-full origin-left scale-x-0 bg-linear-to-r from-violet-500 via-fuchsia-500 to-purple-500 transition-transform duration-300 group-focus-within:scale-x-100" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc, i) => (
              <div key={i} className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]">
                <Doctorcard doc={doc} setshowDoctorDetail={setshowDoctorDetail} />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-violet-300 bg-white/80 py-20 text-center shadow-sm backdrop-blur-xl">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-500"><Search size={32} /></div>

                <h3 className="text-xl font-semibold text-slate-700">No doctors found</h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">
                  We could not find any doctors matching your search. Try using a
                  different name, specialization, email, or phone number.
                </p>

                <button onClick={() => setSearchTerm("")} className="mt-6 rounded-2xl bg-linear-to-r from-violet-600 via-fuchsia-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-violet-500/30">
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
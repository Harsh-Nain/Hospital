import axios from "axios";
import { useEffect, useState } from "react";
import { RxCross1, RxCross2 } from "react-icons/rx";
import Loading from "../components/loading";
import toast from "react-hot-toast";
import { IoIosContacts } from "react-icons/io";

import {
  FaCalendarCheck,
  FaClock,
  FaUser,
  FaTint,
  FaHeartbeat
} from "react-icons/fa";
import { Eye, FileText } from "lucide-react";

export default function ShowPatientProfile({ id, setshowPatientDetail, }) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [activeTab, setActiveTab] = useState("About");

  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);


  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile/patient?patientId=${id}`, { withCredentials: true });

        if (res.data.success) {
          setUser(res.data.patient);
          setReports(res.data.medicalReports || []);
          setAppointments(res.data.appointments || []);
          setSummary(res.data.summary || {});
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load patient");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center h-screen justify-center bg-black/70 z-50"><Loading /></div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl h-[77vh] mb-7 lg:h-[92vh] lg:mb-0 overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl">

        <button onClick={() => setshowPatientDetail(null)} className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow hover:bg-red-50 transition">
          <RxCross1 size={18} />
        </button>

        <div className="bg-linear-to-r from-emerald-400 to-green-400 text-white p-6 flex gap-5 items-center">
          <img src={user?.image || "/user.png"} className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-lg" />

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
            <p className="text-sm opacity-90">{user?.email}</p>

            <div className="flex gap-4 mt-3 text-xs">
              <span className="bg-white/20 px-3 py-1 rounded-full">Visits: {summary?.totalAppointments || 0}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Last: {summary?.lastVisit || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[60vh] sm:h-[80vh]">

          <div className="sticky top-0 z-20 mb-6 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur-xl">
            <div className="flex gap-2 overflow-x-auto">
              {["About", "Appointments", "Reports"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`relative flex-1 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${activeTab === tab ? "bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
                  <div className="flex items-center justify-center gap-2">
                    <span>{tab}</span>
                    {tab === "Reports" && reports.length > 0 && (<span className={`rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === tab ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"}`}>{reports.length}</span>)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {activeTab === "About" && (
            <div className="space-y-6 mb-3">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Gender", value: user?.gender || "--", icon: <FaUser className="text-sky-500 text-xl" /> },
                  { label: "Age", value: user?.age || "--", icon: <FaClock className="text-violet-500 text-xl" /> },
                  { label: "Blood", value: user?.bloodGroup || "--", icon: <FaTint className="text-red-500 text-xl" /> },
                  { label: "Phone", value: user?.phone || "--", icon: <IoIosContacts className="text-emerald-500 text-xl" />, },
                ].map((item, i) => (
                  <div key={i} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">{item.icon}</div>

                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="mt-1 text-base font-semibold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-medium text-red-500">
                <FaHeartbeat />
                {user?.disease || "No disease info"}
              </div>
            </div>
          )}

          {activeTab === "Appointments" && (
            <div className="space-y-4 mb-3">
              {appointments.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-400">
                  No appointments found
                </div>
              ) : (
                appointments.map((a) => {
                  const getStatusColor = () => {
                    if (a.status === "confirmed") return "bg-emerald-100 text-emerald-600";
                    if (a.status === "wait for approval") return "bg-yellow-100 text-yellow-600";
                    if (a.status === "Cancelled") return "bg-red-100 text-red-500";
                    return "bg-slate-100 text-slate-500";
                  };

                  return (
                    <div key={a.appointmentId} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-800">{a.date}</p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <FaClock />
                            {a.startTime} - {a.endTime}
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor()}`}>  {a.status}</span>
                          {a.meetingLink && (<a href={a.meetingLink} target="_blank" className="text-sm font-medium text-sky-500 underline">Join Meeting</a>)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="space-y-4 mb-3">
              {reports.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-400">No reports found</div>
              ) : (
                reports.map((r) => (
                  <div key={r.reportId} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-sky-100 p-3 text-sky-500">
                        <FileText size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">{r.diseaseName}</p>
                        <p className="text-xs text-slate-400">{new Date(r.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <button onClick={() => setSelectedReport(r)} className="rounded-xl bg-sky-100 p-3 text-sky-500 transition hover:bg-sky-500 hover:text-white">
                      <Eye size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <div className="relative w-full mb-10 lg:mb-0 max-w-5xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl">
                <button onClick={() => setSelectedReport(null)} className="absolute right-5 top-5 z-10 rounded-full bg-white p-3 text-slate-700 shadow-lg transition hover:bg-red-500 hover:text-white">
                  <RxCross2 size={22} />
                </button>

                <div className="border-b border-slate-200 px-6 py-5">
                  <h3 className="text-xl font-semibold text-slate-800">{selectedReport.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">Uploaded on {selectedReport.date}</p>
                </div>

                <div className="flex h-[70vh] lg:h-[80vh] items-center justify-center bg-slate-100 p-5">
                  {selectedReport.fileUrl?.includes(".pdf") ||
                    selectedReport.fileUrl?.includes("/raw/") ? (
                    <iframe src={selectedReport.fileUrl} title={selectedReport.title} className="h-full w-full rounded-2xl border border-slate-200 bg-white" />
                  ) : (
                    <img src={selectedReport.fileUrl} alt={selectedReport.title} className="max-h-full max-w-full rounded-2xl object-contain shadow-lg" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
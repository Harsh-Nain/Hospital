import axios from "axios";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import Loading from "../components/loading";
import toast from "react-hot-toast";
import {
  FaCalendarCheck,
  FaClock,
  FaUser,
  FaTint,
  FaHeartbeat
} from "react-icons/fa";

export default function ShowPatientProfile({ id, setshowPatientDetail, }) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

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
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"><Loading /></div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl">

        <button onClick={() => setshowPatientDetail(null)} className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow hover:bg-red-50 transition">
          <RxCross1 size={18} />
        </button>

        <div className="bg-linear-to-r from-emerald-400 to-green-400 text-white p-6 flex gap-5 items-center">

          <img src={user?.image || "/user.png"} className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-lg" />

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
            <p className="text-sm opacity-90">{user?.email}</p>

            <div className="flex gap-4 mt-3 text-xs">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                Visits: {summary?.totalAppointments || 0}
              </span>

              <span className="bg-white/20 px-3 py-1 rounded-full">
                Last: {summary?.lastVisit || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[65vh] sm:max-h-[70vh]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center">

            {[
              { label: "Gender", value: user?.gender || "--" },
              { label: "Age", value: user?.age || "--" },
              { label: "Blood", value: user?.bloodGroup || "--" },
              { label: "Phone", value: user?.phone || "--" },
            ].map((item, i) => (
              <div key={i} className="bg-sky-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}

          </div>

          <div className="flex items-center gap-2 bg-red-50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            <FaHeartbeat />
            {user?.disease || "No disease info"}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Appointment History</h3>

            {appointments.length === 0 ? (
              <p className="text-gray-400 text-sm">No appointments</p>
            ) : (
              <div className="space-y-3">

                {appointments.map((a) => {

                  const getStatusColor = () => {
                    if (a.status === "confirmed") return "bg-emerald-100 text-emerald-600";
                    if (a.status === "wait for approval") return "bg-yellow-100 text-yellow-600";
                    if (a.status === "Cancelled") return "bg-red-100 text-red-500";
                    return "bg-gray-100 text-gray-500";
                  };

                  return (
                    <div key={a.appointmentId} className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition flex justify-between items-center">

                      <div>
                        <p className="text-sm font-medium text-gray-800">{a.date}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <FaClock />
                          {a.startTime} – {a.endTime}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor()}`}>{a.status}</span>

                        {a.meetingLink && (
                          <a href={a.meetingLink} target="_blank" className="block text-xs text-sky-500 mt-1 underline">
                            Join
                          </a>
                        )}
                      </div>

                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* REPORTS */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Medical Reports
            </h3>

            {reports.length === 0 ? (
              <p className="text-gray-400 text-sm">No reports</p>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.reportId}
                    className="p-3 rounded-xl border bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {r.diseaseName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <a
                      href={r.fileUrl}
                      target="_blank"
                      className="text-sky-500 text-xs underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
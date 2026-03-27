import axios from "axios";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import Loading from "../components/loading";
import toast from "react-hot-toast";

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

      <div className="relative pb-[30px] w-full max-w-2xl max-h-[80vh] md:max-h-[90vh] self-start md:self-auto overflow-y-auto bg-white rounded-2xl shadow-xl p-6">

        <button onClick={() => setshowPatientDetail(null)} className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center     cursor-pointer rounded-lg     text-gray-500 hover:text-red-500 hover:bg-zinc-100 transition">
          <RxCross1 size={20} />
        </button>

        <div className="flex gap-5 items-center">
          <img src={user?.image || "/user.png"} className="w-20 h-20 rounded-xl object-cover border" />

          <div>
            <h2 className="text-xl font-bold">{user?.fullName}</h2>

            <p className="text-sky-600 text-sm">{user?.email}</p>

            <p className="text-xs text-gray-500 mt-1">
              Visits: {summary?.totalAppointments || 0}
            </p>
            <p className="text-xs text-gray-500">
              Last Visit: {summary?.lastVisit || "N/A"}
            </p>
          </div>
        </div>

        <div className="my-4 h-px bg-gray-200"></div>

        <div className="grid grid-cols-2 gap-3 text-sm">

          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium">{user?.gender || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Age</p>
            <p className="font-medium">{user?.age || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{user?.phone || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Blood Group</p>
            <p className="font-medium">{user?.bloodGroup || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Disease</p>
            <p className="font-medium">{user?.disease || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{user?.address || "N/A"}</p>
          </div>

        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Medical Reports
          </h3>

          {reports.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No reports
            </p>
          ) : (
            <div className="space-y-2">
              {reports.map((r) => (
                <div key={r.reportId} className="border rounded-lg p-3 text-sm">
                  <p className="font-medium">
                    {r.diseaseName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(r.uploadedAt).toLocaleDateString()}
                  </p>

                  <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-sky-600 text-xs underline">
                    View Report
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
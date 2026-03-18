import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Stethoscope, CalendarCheck, UserCheck } from "lucide-react";
import DoctorApprovalCard from "../../components/doctorapprovedcard";
import { useOutletContext } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { setLoading } = useOutletContext();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/dashboard/admin_`, { withCredentials: true });

        if (res.data.success) {
          setLoading(false)
          setData(res.data);
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };

    getData();
  }, [API_URL, navigate]);

  if (!data) return <div className="p-5">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-linear-to-r from-sky-100 to-white p-5 rounded-2xl shadow-sm border border-sky-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <h2 className="text-2xl font-bold text-gray-800">{data.totalUsers}</h2>
          </div>
          <Users className="text-sky-500" />
        </div>

        <div className="bg-linear-to-r from-emerald-100 to-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Doctors</p>
            <h2 className="text-2xl font-bold text-gray-800">{data.totalDoctors}</h2>
          </div>
          <Stethoscope className="text-emerald-500" />
        </div>

        <div className="bg-linear-to-r from-sky-100 to-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Patients</p>
            <h2 className="text-2xl font-bold text-gray-800">{data.totalPatients}</h2>
          </div>
          <UserCheck className="text-emerald-500" />
        </div>

        <div className="bg-linear-to-r from-emerald-100 to-white p-5 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Appointments</p>
            <h2 className="text-2xl font-bold text-gray-800">{data.totalAppointments}</h2>
          </div>
          <CalendarCheck className="text-blue-500" />
        </div>
      </div>

      <div className="bg-linear-to-br from-emerald-50 via-white to-sky-50 rounded-2xl shadow-sm border border-gray-100 p-5">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Appointments
        </h2>

        <div className="space-y-3">
          {data.appointments.map((appt, i) => (
            <div key={i} className="flex items-center justify-between shadow-sm bg-linear-to-r from-sky-50 via-white to-emerald-100 p-3 rounded-xl border-gray-500 hover:bg-gray-50 transition">
              <div>
                <p className="text-sm text-gray-700">
                  Appointment ID: {appt.appointmentId}
                </p>
                <p className="text-xs text-gray-500">
                  Doctor ID: {appt.doctorId} | Patient ID: {appt.patientId}
                </p>
              </div>

              <span className={`text-xs px-3 py-1 rounded-full ${appt.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`}>
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.doctorsForApproval.length > 0 ? (
          data.doctorsForApproval.map((doc, i) => (
            <DoctorApprovalCard key={i} doc={doc} setLoading={setLoading} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No doctors for approval
          </div>
        )}
      </div>

    </div>
  );
}
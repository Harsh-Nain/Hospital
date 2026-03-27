import { useEffect, useMemo, useState } from "react";
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
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAppointments = useMemo(() => {
    if (!data?.appointments) return [];

    if (statusFilter === "all") return data.appointments;

    return data.appointments.filter(
      (appt) => appt.status === statusFilter
    );
  }, [data, statusFilter]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/admin/admin_`, { withCredentials: true });
        console.log(res.data);

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
    <div className="p-3 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-linear-to-r from-sky-200 to-white p-5 rounded-2xl shadow-sm border border-sky-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <h2 className="text-2xl font-bold text-gray-800">{data.totalUsers}</h2>
          </div>
          <Users className="text-sky-500" />
        </div>

        <div className="bg-linear-to-r from-emerald-200 to-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Doctors</p>
            <h2 className="text-2xl font-bold text-gray-800">{data.totalDoctors}</h2>
          </div>
          <Stethoscope className="text-emerald-500" />
        </div>

        <div className="bg-linear-to-r from-sky-200 to-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Patients</p>
            <h2 className="text-2xl font-bold text-gray-800">{data.totalPatients}</h2>
          </div>
          <UserCheck className="text-emerald-500" />
        </div>

        <div className="bg-linear-to-r from-emerald-200 to-white p-5 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Appointments</p>
            <h2 className="text-2xl font-bold text-gray-800">{data.totalAppointments}</h2>
          </div>
          <CalendarCheck className="text-blue-500" />
        </div>
      </div>

      <div className="bg-linear-to-br from-yellow-50 to-green-100 rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>

        <div className="mb-4 p-4 rounded-xl bg-white border border-black/5 shadow-sm flex justify-between items-center">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-lg font-bold text-gray-800">₹{data.totalRevenue || 0}</p>
        </div>

        {data.payments?.length === 0 ? (<p className="text-gray-500 text-sm">No payments found</p>) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">

            {data.payments.map((pay, i) => (
              <div key={i} className="flex items-center justify-between border border-black/5 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
                {console.log("Payment Details:", pay)}
                <div>
                  <p className="text-sm font-medium text-gray-800">{pay.patientName} → Dr. {pay.doctorName}</p>
                  <p className="text-xs text-gray-500">{pay.specialization} | {pay.date} | {pay.startTime}</p>
                  <p className="text-xs text-gray-400">Txn: {pay.transactionId || "N/A"} </p>
                  <p className="text-xs text-sky-600">{pay.paymentMethod || "Online"}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-800">₹{pay.amount}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${pay.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`} >{pay.paymentStatus}</span>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      <div className="bg-linear-to-br flex flex-col items-center from-emerald-50 to-sky-50 rounded-2xl w-full shadow-sm border border-gray-100 p-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h2>

        <div className="flex justify-between sm:justify-center items-center sm:gap-3 bg-sky-50 mb-3 p-2 rounded-xl shadow-sm w-90">
          {[{ label: "All", value: "all" }, { label: "Confirmed", value: "confirmed" }, { label: "Cancelled", value: "Cancelled" }, { label: "Upcoming", value: "upcomming" },].map((item) =>
          (<button key={item.value} onClick={() => setStatusFilter(item.value)} className={`px-2 sm:px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${statusFilter === item.value ? "bg-sky-500 text-white shadow-md" : "text-sky-700 hover:bg-white hover:shadow-sm"}`}>{item.label}</button>
          ))}
        </div>

        <div className="space-y-3 w-full">
          {filteredAppointments.map((appt, i) => (
            <div key={i} className="flex items-center justify-between border border-black/5 shadow-sm bg-linear-to-r from-sky-100 to-emerald-100 p-2 rounded-xl hover:bg-gray-50 transition">
              <div>
                <p className="text-sm text-gray-700">Appointment ID: {appt.appointmentId}</p>
                <p className="text-xs text-gray-500">Doctor ID: {appt.doctorId} | Patient ID: {appt.patientId}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${appt.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`}>{appt.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.doctorsForApproval.length > 0 ? (
          data.doctorsForApproval.map((doc, i) => (
            <DoctorApprovalCard key={i} doc={doc} setLoading={setLoading} />
          ))
        ) : (<div className="col-span-full text-center text-gray-500 py-10">No doctors for approval</div>)}
      </div>

    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Stethoscope, CalendarCheck, UserCheck } from "lucide-react";
import DoctorApprovalCard from "../../components/doctorapprovedcard";
import { useOutletContext } from "react-router-dom";
import FloatingMessage from "../../components/sendNotification";

export default function Dashboard() {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState(null);
  const { setLoading } = useOutletContext()
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
        setPageLoading(true)
        const res = await axios.get(`${API_URL}/admin/admin_`, { withCredentials: true });
        console.log(res.data);

        if (res.data.success) {
          setPageLoading(false)
          setData(res.data);
        }
      } catch (error) {
        setPageLoading(false)
        console.log(error);
      }
    };

    getData();
  }, [API_URL, navigate]);

  if (pageLoading || !data) {
    return (
      <div className="p-3 sm:p-4 lg:p-5 space-y-5 animate-pulse">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="h-4 w-20 sm:w-24 bg-gray-200 rounded mb-3"></div>
                <div className="h-7 w-14 sm:w-16 bg-gray-200 rounded"></div>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-200 shrink-0"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <div className="h-6 w-32 sm:w-40 bg-gray-200 rounded mb-5"></div>

          <div className="mb-5 p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="h-4 w-24 sm:w-28 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 sm:w-20 bg-gray-200 rounded"></div>
          </div>

          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="border border-gray-100 bg-gray-50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="h-4 w-36 sm:w-48 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-44 sm:w-56 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 sm:w-32 bg-gray-200 rounded"></div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between sm:justify-start sm:items-end gap-2">
                  <div className="h-5 w-14 sm:w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 sm:w-20 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <div className="h-6 w-36 sm:w-48 bg-gray-200 rounded mx-auto mb-5"></div>

          <div className="flex gap-2 sm:gap-3 mb-5 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-10 min-w-20 sm:min-w-24 bg-gray-200 rounded-xl shrink-0"></div>
            ))}
          </div>

          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="h-4 w-32 sm:w-40 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-40 sm:w-52 bg-gray-200 rounded"></div>
                </div>

                <div className="h-6 w-16 sm:w-20 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-5 space-y-6 bg-linear-to-br from-[#f0f9ff] via-[#f5fbff] to-[#e0f2fe]">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-linear-to-r from-sky-200 to-white p-4 sm:p-5 rounded-2xl shadow-sm border border-sky-100 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Users</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{data.totalUsers}</h2>
          </div>
          <Users className="text-sky-500 w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="bg-linear-to-r from-emerald-200 to-white p-4 sm:p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Doctors</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{data.totalDoctors}</h2>
          </div>
          <Stethoscope className="text-emerald-500 w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="bg-linear-to-r from-sky-200 to-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Patients</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{data.totalPatients}</h2>
          </div>
          <UserCheck className="text-emerald-500 w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="bg-linear-to-r from-emerald-200 to-white p-4 sm:p-5 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Appointments</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{data.totalAppointments}</h2>
          </div>
          <CalendarCheck className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </div>

      <div className="bg-linear-to-br from-yellow-50 to-green-100 rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>

        <div className="mb-4 p-4 rounded-xl bg-white border border-black/5 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-lg font-bold text-gray-800">₹{data.totalRevenue || 0}</p>
        </div>

        {data.payments?.length === 0 ? (
          <p className="text-gray-500 text-sm">No payments found</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {data.payments.map((pay, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-black/5 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 wrap-break-word">{pay.patientName} → Dr. {pay.doctorName}</p>
                  <p className="text-xs text-gray-500 wrap-break-word">{pay.specialization} | {pay.date} | {pay.startTime}</p>
                  <p className="text-xs text-gray-400 break-all">Txn: {pay.transactionId || "N/A"}</p>
                  <p className="text-xs text-sky-600">{pay.paymentMethod || "Online"}</p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-800">₹{pay.amount}</p>
                  <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full ${pay.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`}>
                    {pay.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-linear-to-br flex flex-col items-center from-emerald-50 to-sky-50 rounded-2xl w-full shadow-sm border border-gray-100 p-3 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h2>

        <div className="flex flex-wrap justify-center gap-2 bg-sky-50 mb-4 p-2 rounded-xl shadow-sm w-full max-w-full">
          {[
            { label: "All", value: "all" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Cancelled", value: "Cancelled" },
            { label: "Upcoming", value: "upcomming" },
          ].map((item) => (
            <button key={item.value} onClick={() => setStatusFilter(item.value)} className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${statusFilter === item.value ? "bg-sky-500 text-white shadow-md" : "text-sky-700 hover:bg-white hover:shadow-sm"}`}>
              {item.label}
            </button>
          ))}
        </div>

        <FloatingMessage />

        <div className="space-y-3 w-full">
          {filteredAppointments.map((appt, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-black/5 shadow-sm bg-linear-to-r from-sky-100 to-emerald-100 p-3 rounded-xl hover:bg-gray-50 transition">
              <div className="min-w-0">
                <p className="text-sm text-gray-700 wrap-break-word">
                  Appointment ID: {appt.appointmentId}
                </p>
                <p className="text-xs text-gray-500 wrap-break-word">
                  Doctor ID: {appt.doctorId} | Patient ID: {appt.patientId}
                </p>
              </div>

              <span className={`inline-block w-fit text-xs px-2 py-1 rounded-full ${appt.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`}>
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
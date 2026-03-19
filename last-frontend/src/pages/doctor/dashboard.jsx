import { useEffect, useState } from "react";
import axios from "axios";
import ShowPatientProfile from "../../components/showPatientProfile";
import DoctorSlots from "../../components/doctorslot";
import toast from "react-hot-toast";
import { MdDelete } from 'react-icons/md';

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [showPatientDetail, setShowPatientDetail] = useState(null);
  const [addSlot, setAddSlot] = useState(false);
  const [slots, setSlots] = useState([]);

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard/doctor`, { withCredentials: true, });

      if (res.data.success) {
        setDoctor(res.data.doctor);
        setAppointments(res.data.appointments || []);
        setStats(res.data.stats || {});
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctor) return;
      try {
        const res = await axios.get(`${API_URL}/medical/slots?doctorId=${doctor.doctorId}`, { withCredentials: true });

        if (res.data.success) {
          setSlots(res.data.slots || []);
        }
      } catch (error) {
        console.log("Failed to fetch slots:", error);
      }
    };

    fetchSlots();
  }, [doctor]);

  const acceptAppointment = async (a) => {
    try {
      const res = await axios.put(`${API_URL}/medical/appointment-confirm`, { appointmentId: a.appointmentId, slotId: a.slotId, }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message || "Appointment confirmed 🎉");
        fetchDoctor();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Confirm failed");
    }
  };

  const rejectAppointment = async (a) => {
    try {
      const res = await axios.put(`${API_URL}/medical/appointment-cancel`, { appointmentId: a.appointmentId, slotId: a.slotId, }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message || "Appointment cancelled");
        fetchDoctor();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="min-h-screen bg-white/70 p-4 sm:p-6 lg:p-10 space-y-6">
      {showPatientDetail && (<ShowPatientProfile id={showPatientDetail} setshowPatientDetail={setShowPatientDetail} doctorId={showPatientDetail} />)}
      {addSlot && (<DoctorSlots slots={slots} setAddsote={setAddSlot} setSlots={setSlots} />)}

      <div className="bg-linear-to-br from-white to-emerald-100  border-black/10 rounded-2xl p-5 shadow flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={doctor?.image} className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h1 className="text-xl font-bold">Welcome {doctor?.fullName}</h1>
            <p className="text-gray-500 text-sm">{doctor?.specialization}</p>
          </div>
        </div>

        <button onClick={() => setAddSlot(true)} className="bg-emerald-500 hover:opacity-90 cursor-pointer text-white px-4 py-2 rounded-lg">Slots</button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl text-center shadow">
            <p>Total</p>
            <h2 className="text-xl font-bold">{stats.totalAppointments}</h2>
          </div>

          <div className="bg-green-50 p-4 rounded-xl text-center shadow">
            <p>Confirmed</p>
            <h2 className="text-xl font-bold text-green-600">{stats.confirmed}</h2>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl text-center shadow">
            <p>Pending</p>
            <h2 className="text-xl font-bold text-yellow-600">{stats.pending}</h2>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-center shadow">
            <p>Today</p>
            <h2 className="text-xl font-bold text-blue-600">{stats.todayAppointments}</h2>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
        {appointments.length === 0 ? (<p>No appointments</p>) : (
          <div className="space-y-4">
            {appointments.map((a) => (

              <div onClick={() => setShowPatientDetail(a.patientId)} key={a.appointmentId} className="bg-linear-to-br from-white to-sky-100 p-4 rounded-xl shadow flex justify-between items-center cursor-pointer">
                <div className="flex items-center gap-4">
                  <img src={a.image} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-semibold">{a.fullName}</h3>
                    <p className="text-sm text-gray-500">{a.patientEmail}</p>
                    <p className="text-xs text-gray-400">{a.date} | {a.startTime}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {a.status === "payment pending" ||
                    a.status === "cancelled" ? (<span className="text-sm px-3 py-1 bg-gray-100 rounded-full">{a.status}</span>) : (
                    <><button onClick={() => rejectAppointment(a)} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">Reject</button>
                      <button onClick={() => acceptAppointment(a)} className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">Accept</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg mb-2 font-semibold text-gray-800">Your Slot</h3>

        {slots.length === 0 ? (<p className="text-center text-gray-500">No slots available</p>) : (
          <div className="h-[30vh] overflow-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot, index) => (
              <div key={index} className="border relative h-18.5 rounded-xl p-4 flex justify-between items-center" >
                <div>
                  <p className="font-semibold">{slot.date}</p>
                  <p className="text-sm text-gray-500">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${slot.isBooked ? "bg-blue-100 text-blue-500" : "bg-green-100 text-green-600"}`}>
                    {slot.isBooked ? "Booked" : "Available"}
                  </span>

                  {!slot.isBooked && (
                    <button onClick={() => handleDelete(index)} className=" absolute top-1 right-1 text-xs px-1 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                      <MdDelete />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
}
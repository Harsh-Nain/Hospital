import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ShowPatientProfile from "../../components/showPatientProfile";
import DoctorSlots from "../../components/DoctorSlots";
import toast from "react-hot-toast";

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [showPatientDetail, setShowPatientDetail] = useState(null);
  const [addSlot, setAddSlot] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const modals = [showCancelModal, addSlot, showPatientDetail];
  const isAnyModalOpen = modals.some(Boolean);

  
  
  

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard/doctor`, { withCredentials: true, });

      if (res.data.success) {

        setDoctor(res.data.doctor);
        setAppointments(res.data.appointments || []);
        setPatients(res.data.patients || []);
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
    if (isAnyModalOpen) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isAnyModalOpen]);

  const fetchSlots = useCallback(async () => {
    if (!doctor?.doctorId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/medical/slots`, { params: { doctorId: doctor.doctorId }, withCredentials: true, });

      if (data?.success) { setSlots(data.slots ?? []); } else { toast.error(data?.message || "Failed to load slots"); }
    } catch (error) {
      console.error("Fetch slots error:", error); toast.error(error?.response?.data?.message || "Failed to fetch slots");

    } finally { setLoading(false); }
  }, [doctor?.doctorId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const DeleteSlot = async (id) => {
    if (!id) return;
    try {
      const { data } = await axios.delete(`${API_URL}/medical/slot`, { params: { slotId: id }, withCredentials: true, });

      if (data?.success) {
        toast.success(data.message || "Slot deleted successfully");
        setSlots((prev) => prev.filter((slot) => slot.id !== id));
      } else {
        toast.error(data?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete slot error:", error);
      toast.error(
        error?.response?.data?.message || "Delete failed"
      );
    }
  };

  const CancelSlot = async (id, reason) => {
    if (!id) return;
    try {
      const res = await axios.put(
        `${API_URL}/medical/slot`, { slotId: id, reason: reason, },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Slot cancelled");
      }
    } catch (error) {
      console.error("Cancel slot error:", error);
      toast.error(
        error?.response?.data?.message || "Cancel failed"
      );
    }
  };

  const acceptAppointment = async (a) => {
    
    try {
      const res = await axios.put(`${API_URL}/medical/appointment-confirm`, { appointmentId: a.appointmentId, slotId: a.slotId, }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message || "Appointment confirmed ");
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
      {showCancelModal && (
        <div className="fixed h-full inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white md:w-90 rounded-2xl shadow-xl p-5 animate-fadeIn">

            <h2 className="text-lg font-semibold text-gray-800 mb-3">   Cancel Slot </h2>
            <p className="text-xs text-gray-500 mb-3">   Please provide a reason for cancellation </p>

            <textarea placeholder="Write your reason here..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400 outline-none rounded-lg p-2 text-sm mb-4 resize-none" rows={3} />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowCancelModal(false); setReason(""); }}
                className="text-xs px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"   > Close </button>

              <button onClick={() => {
                if (!reason.trim()) {
                  toast.error("Reason is mandatory"); return;
                }

                CancelSlot(selectedSlot, reason);
                setShowCancelModal(false);
                setReason("");
              }}
                className="text-xs px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition shadow-md"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="bg-linear-to-br from-white to-emerald-100 border-black/10 rounded-2xl p-5 shadow flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={doctor?.image || "https://i.pravatar.cc/150"} className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h1 className="md:text-xl font-bold">Welcome {doctor?.fullName}</h1>
            <p className="text-gray-500 text-sm">{doctor?.specialization}</p>
          </div>
        </div>
        <button onClick={() => setAddSlot(true)} className="cursor-pointer hover:opacity-80 bg-green-500 text-white px-4 py-2 rounded-lg">Add Slots</button>
      </div>

      {stats && (
        <>
          <h2 className="text-xl font-semibold mb-4">Your States</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center shadow">
              <p>Total</p>
              <h2 className="text-xl font-bold text-blue-600">{stats.totalAppointments}</h2>
            </div>

            <div className="bg-green-50 p-4 rounded-xl text-center shadow">
              <p>Confirmed</p>
              <h2 className="text-xl font-bold text-green-600">{stats.confirmed}</h2>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl text-center shadow">
              <p>Pending</p>
              <h2 className="text-xl font-bold text-yellow-600">{stats.pending}</h2>
            </div>

            <div className="bg-red-50 p-4 rounded-xl text-center shadow">
              <p>Cancelled</p>
              <h2 className="text-xl font-bold text-red-600">{stats.Cancelled}</h2>
            </div>
          </div>

        </>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>

        {appointments.length === 0 ? (
          <p>No appointments</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => {
              const patient = a.patient || {};
              const slot = a.slot || {};

              return (
                <div
                  key={a.appointmentId}
                  onClick={() => setShowPatientDetail(a.patient?.id)}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={patient.image || "https://i.pravatar.cc/150"}
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <div>
                      <h3 className="font-semibold">{patient.name}</h3>

                      <p className="text-xs text-gray-400">
                        {slot.date}
                      </p>
                      <p className="text-xs text-gray-400">
                        {slot.startTime} - {slot.endTime}              </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {a.status === "confirmed" || a.status === "Cancelled" ? (
                      <span
                        className={` cursor-default text-xs px-3 py-1 rounded-full ${a.status === "Cancelled"
                            ? "bg-red-100 text-red-500"
                            : "bg-green-100 text-green-600"
                          }`}
                      >
                        {a.status}
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            rejectAppointment(a);
                          }}
                          className=" cursor-pointer hover:bg-red-200 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                        >
                          Reject
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acceptAppointment(a);
                          }}
                          className=" cursor-pointer hover:bg-green-200 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                        >
                          Accept
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Slot</h2>


        {slots.length === 0 ? (<p className="text-center text-gray-500">No slots available</p>) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot, index) => (
              <div key={index} className="border rounded-xl p-4 flex flex-col justify-between  shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{slot.date}</p>
                    <p className="text-sm text-gray-500">{slot.startTime} - {slot.endTime}</p>
                    <p>max-patient: {slot.capacity}</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${slot.isBooked ? (slot.isCancelled ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600") : "bg-blue-100 text-blue-600"}`}>
                      {slot.isBooked ? (slot.isCancelled ? "Cancelled" : "Booked") : "Available"}</span>

                    {slot.isBooked && !slot.isCancelled ?
                      (<button onClick={() => { setSelectedSlot(slot.id); setShowCancelModal(true); }}
                        className=" cursor-pointer text-xs px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 
                       transition">  Cancel</button>)

                      : (<button onClick={() => DeleteSlot(slot.id)} className=" cursor-pointer text-xs px-3 py-1 
                      rounded-md bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition">  Delete</button>)}

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
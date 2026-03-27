import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ShowPatientProfile from "../../components/showPatientProfile";
import toast from "react-hot-toast";
import DoctorSlots from "../../components/doctorSlots";
import { FaTrash } from 'react-icons/fa';


export default function Dashboard() {
  const [addSlot, setAddSlot] = useState(false);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showPatientDetail, setShowPatientDetail] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const modals = [showCancelModal, addSlot, showPatientDetail];
  const isAnyModalOpen = modals.some(Boolean);
  const [allAppointments, setAllAppointments] = useState([]);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [futureSlots, setFutureSlots] = useState([]);
  const [actionType, setActionType] = useState("");
  const [activeType, setactiveType] = useState("");
  const [animates, setAnimates] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [allSlots, setAllSlots] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [now, setNow] = useState(new Date());
  const [doctor, setDoctor] = useState(null);
  const [reason, setReason] = useState("");
  const [stats, setStats] = useState(null);
  const [slots, setSlots] = useState([]);


  const fetchDoctor = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard/doctor`, { withCredentials: true, });

      if (res.data.success) {
        setDoctor(res.data.doctor);
        const filterall = res.data.appointments.formattedAppointments || [];
        const upcoming = filterall.filter(appointments => appointments.status != "Cancelled" && appointments.slotstage != "Removed")
        const filterupcoming = res.data.appointments.upcomingAppointments || [];
        const all = filterupcoming.filter(appointments => appointments.slotstage != "Removed")

        
        
        setUpcomingAppointments(upcoming); setAllAppointments(all);
        setAppointments(upcoming);
        setStats(res.data.stats || {});
      }
    } catch (error) {
      console.log(error); toast.error("Failed to load dashboard");
    }
  };

  const changeAppointment = () => {
    if (showAll) {
      setAppointments(upcomingAppointments); setAnimate(true); setTimeout(() => setAnimate(false), 500);
    } else {
      setAppointments(allAppointments); setAnimate(true); setTimeout(() => setAnimate(false), 500);
    }
    setShowAll(!showAll);
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

    try {
      const { data } = await axios.get(`${API_URL}/medical/slots`, { params: { doctorId: doctor.doctorId }, withCredentials: true, });

      if (data?.success) {
        const filteredSlots = data.futureSlots ?? [];
        const future = filteredSlots.filter(slot => slot.isCancelled === false);
        const filterall = data.slots ?? [];
        const all = filterall.filter(slot => slot.slotstage != "Removed")
        setFutureSlots(future);
        setAllSlots(all);
        setSlots(future);
      } else {
        toast.error(data?.message || "Failed to load slots");
      }
    } catch (error) {
      console.error("Fetch slots error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch slots");
    } finally {
    }
  }, [doctor?.doctorId]);

  const toggleSlots = () => {
    if (showAllSlots) {
      setSlots(futureSlots);
      setAnimates(true);
      setTimeout(() => setAnimates(false), 500);
    } else {
      setSlots(allSlots);
      setAnimates(true);
      setTimeout(() => setAnimates(false), 500);
    }
    setShowAllSlots(!showAllSlots);

  };

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const toggleStatus = (slotId, currentCancelledState) => {
    setSelectedSlot(slotId);
    setActionType("cancel")
    setactiveType(currentCancelledState ? false : true);
    setShowCancelModal(true);
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

  const rejectAppointment = async (a, reason) => {
    try {
      const res = await axios.put(`${API_URL}/medical/appointment-cancel`, { appointmentId: a.appointmentId, reason, }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message || "Appointment cancelled");
        fetchDoctor();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  const formatTime12Hour = (timeString) => {
    if (!timeString || typeof timeString !== "string") return "";

    const parts = timeString.split(":");
    if (parts.length < 2) return "";

    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) return "";

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    appointments.forEach((a) => {
      const slotDate = new Date(a.slot?.date).setHours(0, 0, 0, 0);
      if (slotDate < today && a.status === "wait for approval") {
        rejectAppointment(a, "Unresponsive");
      }
    });
  }, [appointments]);


  const getTimeRemaining = (startTime, date, endtime) => {

    if (!startTime || !date || !endtime) return "";

    const now = new Date();

    function parseTime(timeStr) {
      const [time, modifier] = timeStr.split(" ");
      let [h, m] = time.split(":").map(Number);

      if (modifier === "AM" && h === 12) h = 0;
      if (modifier === "PM" && h !== 12) h += 12;

      return { h, m };
    }

    const [year, month, day] = date.split("-").map(Number);

    const { h: sh, m: sm } = parseTime(startTime);
    const start = new Date(year, month - 1, day, sh, sm, 0, 0);

    const { h: eh, m: em } = parseTime(endtime);
    const end = new Date(year, month - 1, day, eh, em, 0, 0);

    // overnight fix
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    // console.log("Now:", now);
    // console.log("Start:", start);
    // console.log("End:", end);

    if (now >= end) return "Completed";

    if (now >= start && now < end) return "Started";

    const diff = start - now;
    const totalSeconds = Math.floor(diff / 1000);

    if (totalSeconds >= 86400) {
      const days = Math.floor(totalSeconds / 86400);
      return `Starts in ${days} day${days > 1 ? "s" : ""}`;
    }

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `Starts in ${hrs}h ${mins}m ${secs}s`;
  };

  const statusLabelMap = {
    "wait for approval": "Requested",
    "confirmed": "Confirmed At",
    "Cancelled": "Cancelled At",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleConfirm = () => {
    const len = reason.trim().length;

    if (!len) return toast.error("Reason is mandatory");
    if (len < 10) return toast.error("Min 10 characters required");
    if (len > 30) return toast.error("Max 30 characters allowed");
    if (reason.trim() === "Unresponsive") return toast.error("Unresponsive is not a reason");

    if (actionType === "reject") {
      rejectAppointment(selectedSlot, reason);
    } else if (actionType === "cancel") {
      ChangeActive(selectedSlot, reason);
    }

    setShowCancelModal(false);
    setReason("");
  };

  const removeslote = async (slot) => {
    try {
      const res = await axios.put(
        `${API_URL}/medical/slot`, { slotId: slot.slotId, action: "remove", }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message || "Slot deleted");
        fetchSlots();
      }
    } catch (error) {
      console.error("Cancel slot error:", error);
      toast.error(
        error?.response?.data?.message || "delete failed"
      );
    }
  }

  const ChangeActive = async (id, reason) => {
    if (!id) return;
    try {
      const res = await axios.put(
        `${API_URL}/medical/slot`, { slotId: id, reason: reason, change: activeType, action: "changeactive", },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Slot active change");
        fetchSlots();
      }
    } catch (error) {
      console.error("Cancel slot error:", error);
      toast.error(
        error?.response?.data?.message || "Cancel failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white/70 p-4 sm:p-6 lg:p-10 space-y-6">

      {showPatientDetail && (<ShowPatientProfile id={showPatientDetail} setshowPatientDetail={setShowPatientDetail} doctorId={showPatientDetail} />)}
      {addSlot && (<DoctorSlots slots={slots} setAddsote={setAddSlot} setSlots={setSlots} />)}
      {showCancelModal && (
        <div className="fixed h-full inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[300px] mx-auto rounded-2xl shadow-xl p-5 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">   Reason  </h2>
            <p className="text-xs text-gray-500 mb-3">   Please provide a reason  </p>

            <textarea placeholder="Write your reason here..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400 outline-none rounded-lg p-2 text-sm mb-4 resize-none" rows={3} />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowCancelModal(false); setReason(""); }}
                className="text-xs px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"   > Close </button>

              <button onClick={handleConfirm} className="text-xs px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition shadow-md"> Confirm</button>
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
        <button
          onClick={() => setAddSlot(true)}
          className="
    cursor-pointer 
    bg-green-500 text-white 
    rounded-lg 
    hover:opacity-80 
    transition-all duration-200
    
    px-2 py-1 text-xs   
    sm:px-3 sm:py-1.5 sm:text-sm
    md:px-5 md:py-2 md:text-base
    lg:px-6 lg:py-3 lg:text-lg
  "
        >
          Add Slots
        </button>

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold">   Your Appointments  </h2>
          <p className={`text-xs sm:text-sm cursor-pointer self-start sm:self-auto ${showAll ? "text-blue-600 hover:text-blue-800" : "text-green-600 hover:text-green-800"}`} onClick={changeAppointment} >   {showAll ? "Show Upcoming" : "Show All Appointments"} </p>

        </div>
        {appointments.length === 0 ? (<p className=" py-4 text-center text-gray-500">No upcoming appointments</p>) : (
          <div className={`space-y-4 transition-all duration-400 ${animate ? "opacity-0 translate-y-0" : "opacity-100 translate-y-2"}`}>

            {appointments.map((a) => {
              const patient = a.patient || {};
              const slot = a.slot || {};

              return (
                <div key={a.appointmentId} onClick={() => setShowPatientDetail(a.patient?.id)} className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 cursor-pointer"  >

                  <div className="flex items-center gap-3 sm:gap-4">
                    <img src={patient.image || "https://i.pravatar.cc/150"} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base"> {patient.name || "Unknown"} </h3>
                      <p className="text-xs sm:text-sm text-blue-600">  {patient.disease || "Not mentioned"} </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-center flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{slot.date || "N/A"}</p>
                    <p className="text-xs text-gray-500">{formatTime12Hour(slot.startTime)} – {formatTime12Hour(slot.endTime)}</p>

                    {a.status === "confirmed" && (
                      <p className="text-xs font-medium text-blue-600 mt-1">   {getTimeRemaining(formatTime12Hour(slot.startTime), slot.date, formatTime12Hour(slot.endTime))}  </p>
                    )}


                    <p className="text-[10px] text-gray-400 mt-1">{statusLabelMap[a.status] && `${statusLabelMap[a.status]}: `}
                      {new Date(a.createdat).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", })}{" "}  {formatTime12Hour(a.createdat)}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-start sm:justify-end">
                    {a.status === "confirmed" || a.status === "Cancelled" ? (
                      <div className="flex flex-col items-start sm:items-center gap-1">

                        {new Date(new Date(slot.date).setHours(...slot.endTime.split(":").map(Number), 0, 0)) < new Date() && (
                          <p className="text-xs px-3 py-1  text-orange-500">
                            {a.status === "Cancelled" ? "SLOT CANCELLED" : "SLOT COMPLETED"}
                          </p>
                        )}

                        <p className={`text-xs px-3 py-1 rounded-full ${a.status === "Cancelled" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`} > {a.status}  </p>
                        <p className="text-xs text-red-400">  {a.cancelReason === "Unresponsive" ? "Unresponsive appointment" : ""} </p>
                      </div>
                    ) : (
                      <>
                        {new Date(slot.date).setHours(0, 0, 0, 0) >=
                          new Date().setHours(0, 0, 0, 0) ? (
                          <div className="flex flex-wrap gap-2">
                            <button onClick={(e) => { e.stopPropagation(); setSelectedSlot(a); setActionType("reject"); setShowCancelModal(true); }} className="hover:bg-red-200 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs sm:text-sm">  Reject </button>
                            <button onClick={(e) => { e.stopPropagation(); acceptAppointment(a); }} className="hover:bg-green-200 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs sm:text-sm" >  Accept </button>
                          </div>
                        ) : (
                          <p className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-500 uppercase">
                            {a.status === "wait for approval" ? "SLOT CANCELLED" : a.status}
                          </p>
                        )}
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
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold mb-4">Your Slot</h2>
          <p className={`text-sm cursor-pointer ${showAllSlots ? "text-blue-500" : "text-green-500"}`} onClick={toggleSlots} >
            {showAllSlots ? "Show Upcoming Slots" : "Show All Slots"}
          </p>
        </div>

        {slots.length === 0 ? (<p className="text-center text-gray-500">No upcoming slots </p>) : (
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-400 ${animates ? "opacity-0 translate-y-0" : "opacity-100 translate-y-2"}} `}>

            {slots.map((slot, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-gray-800">{slot.date}</p>
                    <p className="text-sm text-gray-500">{formatTime12Hour(slot.startTime)} - {formatTime12Hour(slot.endTime)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {new Date(new Date(slot.date).setHours(...slot.endTime.split(":").map(Number), 0, 0)) > new Date() ? (
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${!slot.isCancelled ? (slot.booked > 0 ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600") : "bg-orange-100 text-orange-600"}`}>
                        {!slot.isCancelled ? (slot.booked > 0 ? "Booked" : "Available") : "Inactive"}
                      </span>
                    ) : (
                      <span className={`text-xs font-medium px-3 py-1 rounded-full text-blue-600  `}>  Completed </span>)}
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Max Patient</span>
                    <span className="font-medium">{slot.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booked</span>
                    <span className="font-medium text-green-600">{slot.booked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available</span>
                    <span className="font-medium text-blue-600">{slot.available}</span>
                  </div>
                </div>

                <div className="my-2 border-t"></div>

                {new Date(new Date(slot.date).setHours(...slot.endTime.split(":").map(Number), 0, 0)) > new Date() ? (
                  <div className="flex justify-end gap-2 items-center">
                    <p className="text-[10px] font-light italic"> Click here to {slot.isCancelled ? 'Activate' : 'Deactivate'}</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={!slot.isCancelled} onChange={() => toggleStatus(slot.slotId, slot.isCancelled)} />
                      <div className="group peer ring-0 bg-gradient-to-tr from-rose-100 via-rose-400 to-rose-500 rounded-full outline-none duration-300 after:duration-300 w-[50px] h-[22px]
                       shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:h-[18px] after:w-[18px] 
                       after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center after:text-[10px] peer-checked:after:translate-x-[28px] peer-checked:after:content-['✔️']
                      peer-checked:from-green-100 peer-checked:via-lime-400 peer-checked:to-lime-500">
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span onClick={() => removeslote(slot)} className="cursor-pointer text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-red-300" >  <FaTrash /> </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider"> {slot.isCancelled ? 'Slot Cancelled' : 'Slot Completed'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
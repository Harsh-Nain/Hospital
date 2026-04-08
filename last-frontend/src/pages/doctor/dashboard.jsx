import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ShowPatientProfile from "../../components/showPatientProfile";
import toast from "react-hot-toast";
import DoctorSlots from "../../components/DoctorSlots";
import { FaTrash, FaCalendarCheck, FaHistory, FaUserCheck } from "react-icons/fa";
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, } from "react-icons/fi";
const statusLabelMap = { "wait for approval": "Requested", confirmed: "Confirmed At", Cancelled: "Cancelled At", };

function parseTimeTo24Hour(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return { h: 0, m: 0 };

  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    const [time, modifier] = timeStr.split(" ");
    let [h, m] = time.split(":").map(Number);

    if (modifier === "AM" && h === 12) h = 0;
    if (modifier === "PM" && h !== 12) h += 12;
    return { h, m };
  }
  const [h, m] = timeStr.split(":").map(Number);
  return { h: Number.isFinite(h) ? h : 0, m: Number.isFinite(m) ? m : 0, };
}

function getSlotDateTime(date, time) {
  if (!date || !time) return null;

  const base = new Date(date);
  if (Number.isNaN(base.getTime())) return null;

  const { h, m } = parseTimeTo24Hour(time);
  base.setHours(h, m, 0, 0);
  return base;
}

function getTimeRemaining(startTime, date, endTime, now) {
  const start = getSlotDateTime(date, startTime);
  const end = getSlotDateTime(date, endTime);

  if (!start || !end) return "";

  if (end <= start) end.setDate(end.getDate() + 1);
  if (now >= end) return "Completed";
  if (now >= start && now < end) return "Started";

  const diff = start.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));

  if (totalSeconds >= 86400) {
    const days = Math.floor(totalSeconds / 86400);
    return `Starts in ${days} day${days > 1 ? "s" : ""}`;
  }

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `Starts in ${hrs}h ${mins}m ${secs}s`;
}

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [addSlot, setAddSlot] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [reason, setReason] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState(null);
  const [slots, setSlots] = useState([]);
  const [now, setNow] = useState(new Date());

  const [slotFilter, setSlotFilter] = useState("active");
  const [appointmentFilter, setAppointmentFilter] = useState("upcoming");
  const isAnyModalOpen = selectedSlot || addSlot || showPatientDetail;

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
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const dashboard = async () => {
      try {
        setLoading(true);
        const doctorResponse = await axios.get(`${API_URL}/dashboard/doctor`, { withCredentials: true, });
        const doctorData = doctorResponse.data;

        if (!doctorData?.success) {
          toast.error("Failed to load doctor data");
          return;
        }

        const doctorInfo = doctorData.doctor || {};
        setDoctor(doctorInfo);
        setStats(doctorData.stats || {});
        setAppointments(doctorData.formattedAppointments || []);

        if (!doctorInfo?.doctorId) {
          setSlots([]);
          return;
        }

        const slotResponse = await axios.get(`${API_URL}/medical/slots`, { params: { doctorId: doctorInfo.doctorId }, withCredentials: true, });
        const slotData = slotResponse.data;

        if (slotData?.success) {
          const filteredSlots = (slotData.slots || []).filter((slot) => {
            if (!slot?.date || !slot?.endTime) return false;
            if (slot.slotstage === "Removed") return false;
            if (slot.isDeleted) return false;
            return true;
          });

          setSlots(filteredSlots);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    dashboard()
  }, [API_URL]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const acceptAppointment = async (appointment) => {
    try {
      const res = await axios.put(`${API_URL}/medical/appointment-confirm`, { appointmentId: appointment.appointmentId, slotId: appointment.slotId, }, { withCredentials: true });

      if (res.data?.success) {
        toast.success(res.data.message || "Appointment confirmed");
        setAppointments((prev) => prev.map((ap) => ap.appointmentId === appointment.appointmentId ? { ...ap, status: "confirmed" } : ap));

      } else {
        toast.error(res.data?.message || "Confirm failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Confirm failed");
    }
  };

  const rejectAppointment = async (appointment, rejectReason) => {
    try {
      const res = await axios.put(`${API_URL}/medical/appointment-cancel`, { appointmentId: appointment.appointmentId, reason: rejectReason, }, { withCredentials: true });
      if (res.data?.success) {
        toast.success(res.data.message || "Appointment cancelled");
        setAppointments((prev) => prev.map((ap) => ap.appointmentId === appointment.appointmentId ? { ...ap, status: "rejected" } : ap));

      } else {
        toast.error(res.data?.message || "Cancel failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cancel failed");
    }
  };

  const toggleStatus = async (slotId, currentIsCancelled) => {
    try {
      const res = await axios.put(`${API_URL}/medical/slot`, { slotId, action: "changeactive", change: currentIsCancelled ? "activate" : "deactivate", reason: reason || "" }, { withCredentials: true });

      if (res.data?.success) {
        toast.success(res.data.message || "Slot updated");
        setSlots((prevSlots) => prevSlots.map((s) => s.slotId === slotId ? { ...s, isCancelled: !currentIsCancelled, } : s));
      } else {
        toast.error(res.data?.message || "Slot update failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Slot update failed");
    }
  };

  const removeSlot = async (slot) => {
    try {
      const res = await axios.put(`${API_URL}/medical/slot`, { slotId: slot.slotId, action: "remove", }, { withCredentials: true });

      if (res.data?.success) {
        toast.success(res.data.message || "Slot deleted");
        setSlots((prevSlots) => prevSlots.filter((s) => s.slotId !== slot.slotId));
      }
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  const handleConfirm = () => {
    const text = reason.trim();
    if (!text) return toast.error("Reason is mandatory");
    if (text.length < 10) return toast.error("Minimum 10 characters required");
    if (text.length > 100) return toast.error("Maximum 100 characters allowed");

    if (actionType === "reject") {
      rejectAppointment(selectedSlot, text);
    } else {
      toggleStatus(selectedSlot.slotId, selectedSlot.isCancelled)
    }
    setReason("");
    actionType(null)
    setSelectedSlot(false);
  };

  const statsCards = useMemo(
    () => [
      { label: "Total Appointments", value: stats?.totalAppointments, accent: "from-sky-500 to-cyan-500", tone: "bg-sky-50", icon: <FiCalendar />, },
      { label: "Confirmed", value: stats?.confirmed, accent: "from-emerald-500 to-green-500", tone: "bg-green-50", icon: <FiCheckCircle />, },
      { label: "Pending", value: stats?.pending, accent: "from-amber-500 to-orange-500", tone: "bg-amber-50", icon: <FiClock />, },
      { label: "Cancelled", value: stats?.Cancelled, accent: "from-rose-500 to-red-500", tone: "bg-red-50", icon: <FiXCircle />, },
    ],
    [stats]
  );

  const filteredAppointments = appointments.filter((appointment) => {
    const slot = appointment.slot || {};
    const slotEnd = getSlotDateTime(slot.date, slot.endTime);
    if (!slotEnd) return true;

    const isUpcoming = slotEnd > new Date();
    const isOld = slotEnd <= new Date();
    if (appointmentFilter === "upcoming") return isUpcoming;
    if (appointmentFilter === "old") return isOld;
    return true;
  });

  const filteredSlots = slots.filter((slot) => {
    const slotEnd = getSlotDateTime(slot.date, slot.endTime);
    const isPast = slotEnd ? slotEnd <= new Date() : false;
    if (slotFilter === "active") return !slot.isCancelled && !isPast;
    if (slotFilter === "inactive") return slot.isCancelled;
    if (slotFilter === "completed") return isPast;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 animate-pulse rounded-2xl bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-7 w-64 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => (<div key={item} className="h-40 animate-pulse rounded-3xl bg-white/80 shadow-sm" />))}</div>
        <div className="mt-6 grid gap-4">{[1, 2, 3].map((item) => (<div key={item} className="h-28 animate-pulse rounded-3xl bg-white/80 shadow-sm" />))}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-5 lg:p-7">
      {showPatientDetail && (<ShowPatientProfile id={showPatientDetail} doctorId={showPatientDetail} setshowPatientDetail={setShowPatientDetail} />)}
      {addSlot && (<DoctorSlots slots={slots} setAddsote={setAddSlot} setSlots={setSlots} />)}

      <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={doctor?.image || "https://i.pravatar.cc/150?img=13"} alt={doctor?.fullName || "Doctor"} className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-lg" />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Doctor Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">Welcome back, Dr. {doctor?.fullName || "Doctor"}</h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">{doctor?.specialization || "Specialization not added"}</p>
            </div>
          </div>

          <button onClick={() => setAddSlot(true)} className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 px-5 py-3 font-medium text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/50">
            + Add New Slot
          </button>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">{statsCards.map((item) => (<StatCard key={item.label} {...item} />))}</section>

      <section className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900"><FaCalendarCheck className="text-emerald-500" />Your Appointments</h2>
            <p className="mt-1 text-sm text-gray-500">Manage patient requests and confirmations</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2">
            <button onClick={() => setAppointmentFilter("all")} className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${appointmentFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white/70"}`}>All</button>
            <button onClick={() => setAppointmentFilter("upcoming")} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${appointmentFilter === "upcoming" ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:bg-white/70"}`}><FiCheckCircle />Upcoming</button>
            <button onClick={() => setAppointmentFilter("old")} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${appointmentFilter === "old" ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:bg-white/70"}`}><FaHistory />Old</button>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (<EmptyState icon={<FiCalendar className="h-7 w-7 text-blue-500" />} title="No appointments found" description="There are no appointments for the selected filter." />) : (

          <div className="space-y-4">
            {filteredAppointments.map((a) => {
              const patient = a.patient || {};
              const slot = a.slot || {};
              const createdAt = a.createdAt || a.createdat;
              const slotEnd = getSlotDateTime(slot.date, slot.endTime);
              const isPast = slotEnd ? slotEnd < new Date() : false;

              return (
                <div key={a.appointmentId} onClick={() => setShowPatientDetail(a.patient?.id)} className="relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-100/40 blur-3xl" />

                  <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img src={patient.image || "https://i.pravatar.cc/150?img=5"} alt={patient.name || "Patient"} className="h-14 w-14 rounded-2xl border border-white object-cover shadow-md" />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 sm:text-base">{patient.name || "Unknown"}</h3>
                        <p className="text-xs text-blue-600 sm:text-sm">{patient.disease || "Not mentioned"}</p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          {statusLabelMap[a.status] ? `${statusLabelMap[a.status]} • ` : ""}
                          {createdAt ? new Date(createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", }) : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-center">
                      <p className="text-sm font-semibold text-gray-800 sm:text-base">{slot.date || "N/A"}</p>
                      <p className="text-xs text-gray-500">{slot.startTime} –{" "}{slot.endTime} </p>
                      {a.status === "confirmed" && (<p className="mt-1 text-xs font-medium text-yellow-400">{getTimeRemaining(slot.startTime, slot.date, slot.endTime, now)}</p>)}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {a.status === "confirmed" || a.status === "Cancelled" ? (
                        <div className="flex flex-col items-start gap-1 sm:items-end">
                          {isPast && (<p className="text-xs font-medium text-orange-500">{a.status === "Cancelled" ? "SLOT CANCELLED" : "SLOT COMPLETED"}</p>)}
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${a.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}> {a.status}</span>
                          {a.cancelReason && (<p className="text-xs text-red-400">{a.cancelReason}</p>)}
                        </div>
                      ) : (
                        <>{slot.date && new Date(slot.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ? (
                          <div className="flex flex-wrap gap-2">
                            <button onClick={(e) => { e.stopPropagation(); setActionType("reject"); setSelectedSlot(a); }} className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-medium text-rose-600 transition-all duration-300 hover:bg-rose-100 sm:text-sm">Reject</button>
                            <button onClick={(e) => { e.stopPropagation(); acceptAppointment(a); }} className="rounded-xl bg-linear-to-r from-emerald-500 to-green-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]" >Accept</button>
                          </div>) : (<span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium uppercase text-orange-500">{a.status || "Expired"}</span>)}</>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900"><FiClock className="text-blue-500" />Your Slots</h2>
            <p className="mt-1 text-sm text-gray-500">View, activate, deactivate, or remove availability</p>
          </div>

          <div className="flex items-center sm:gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-2">
            <button onClick={() => setSlotFilter("all")} className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${slotFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white/70"}`}>All</button>
            <button onClick={() => setSlotFilter("active")} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${slotFilter === "active" ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:bg-white/70"}`}><FiCheckCircle />Active</button>
            <button onClick={() => setSlotFilter("inactive")} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${slotFilter === "inactive" ? "bg-rose-500 text-white shadow-sm" : "text-gray-500 hover:bg-white/70"}`}><FiXCircle />Inactive</button>
            <button onClick={() => setSlotFilter("completed")} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${slotFilter === "completed" ? "bg-sky-500 text-white shadow-sm" : "text-gray-500 hover:bg-white/70"}`}><FiCalendar />Completed</button>
          </div>
        </div>

        {filteredSlots.length === 0 ? (<EmptyState icon={<FiClock className="h-7 w-7 text-purple-500" />} title="No slots available" description="You haven’t added your availability yet, or none match the selected filter." />) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSlots.map((slot) => {
              const slotEnd = getSlotDateTime(slot.date, slot.endTime);
              const isFuture = slotEnd ? slotEnd > new Date() : false;
              const isCompleted = slotEnd ? slotEnd <= new Date() : false;

              return (
                <div key={slot.slotId} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-gray-800">{slot.date || "N/A"}</p>
                      <p className="text-sm text-gray-500">  {slot.startTime} -{" "}  {slot.endTime}</p>
                    </div>

                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${isCompleted ? "bg-blue-100 text-blue-600" : !slot.isCancelled ? slot.booked > 0 ? "bg-cyan-100 text-cyan-600" : "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                      {isCompleted ? (<><FiCalendar />Completed</>) : !slot.isCancelled ? (slot.booked > 0 ? (<><FaUserCheck />Booked</>) : (<><FiCheckCircle />Active</>)) : (<><FiXCircle />Inactive</>)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Max Patients</span>
                      <span className="font-medium text-gray-900">{slot.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Booked</span>
                      <span className="font-medium text-green-600">{slot.booked} </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Available</span>
                      <span className="font-medium text-blue-600">{slot.available}</span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-gray-100" />
                  {isFuture ? (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{slot.isCancelled ? "Activate slot" : "Deactivate slot"}</p>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" checked={!slot.isCancelled} onChange={() => slot.isCancelled || slot.booked == 0 ? toggleStatus(slot.slotId, slot.isCancelled) : setSelectedSlot(slot)} />
                        <div className={`relative h-6 w-12 rounded-full ${slot.isCancelled && "bg-linear-to-tr from-rose-200 via-rose-400 to-rose-500"} transition-all duration-300 after:absolute after:left-0.5 after:top-0.5 after:flex after:h-5 after:w-5 after:items-center after:justify-center after:rounded-full after:bg-gray-50 after:text-[10px] after:content-['✖'] after:transition-all after:duration-300 peer-checked:bg-emerald-500 peer-checked:after:translate-x-6 peer-checked:after:content-['✔']`} />
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <button onClick={() => removeSlot(slot)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:text-red-500"><FaTrash /> Delete</button>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{slot.isCancelled ? "Slot Cancelled" : "Slot Completed"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Reason</h2>
            <p className="mt-1 text-sm text-gray-500">Please provide a short reason for rejection.</p>
            <textarea placeholder="Write your reason here..." value={reason} onChange={(e) => setReason(e.target.value)} className="mt-4 w-full resize-none rounded-2xl border border-gray-300 p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" rows={4} />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setSelectedSlot(null); setReason(null); }} className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"  >Close</button>
              <button onClick={handleConfirm} className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:scale-[1.02]">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent, tone, icon }) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl border border-black/5 ${tone} p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.10)]`}>
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-linear-to-br ${accent} opacity-20 blur-2xl`} />
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r ${accent} text-white text-xl`}>{icon}</div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">{value ?? 0}</h2>
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white/70 p-8 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">{icon}</div>
      <p className="text-base font-semibold text-gray-800">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}
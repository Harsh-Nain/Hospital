import axios from "axios";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import Loading from "./loading";
import { Clock3, ChevronDown, Sunrise, Sunset, Users, Sparkles, CalendarDays, Check, } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const DoctorSlots = ({ slots, setSlots, setAddsote, reuseSlot, setReuseSlot, }) => {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const [repeatType, setRepeatType] = useState("once");
  const today = new Date().toISOString().split("T")[0];
  const [newSlot, setNewSlot] = useState({ date: today, startTime: "", endTime: "", capacity: 2, booked: 0, available: 0, });
  const [open, setOpen] = useState(false);

  const repeatOptions = [{ value: "once", label: "Do Not Repeat", desc: "Single slot only" }, { value: "daily", label: "Daily", desc: "Repeat every day" },];

  useEffect(() => {
    if (reuseSlot) {
      const now = new Date();
      const slotDateTime = new Date(`${reuseSlot.date} ${reuseSlot.endTime}`);

      setRepeatType(reuseSlot.optionalFor)
      setNewSlot({ date: slotDateTime > now ? reuseSlot.date : today, startTime: reuseSlot.startTime || "", endTime: reuseSlot.endTime || "", capacity: reuseSlot.capacity || "", booked: 0, available: reuseSlot.capacity || 0, });
    }
  }, [reuseSlot]);

  const resetForm = () => {
    setNewSlot({ date: "", startTime: "", endTime: "", capacity: "", booked: 0, available: 0, });
    setReuseSlot?.(null);
  };

  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);

  const timeOptions = [
    "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM",
    "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM",
    "05:00 AM", "05:30 AM", "06:00 AM", "06:30 AM",
    "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM",
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM",
    "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
    "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM",
    "11:00 PM", "11:30 PM", "12:00 AM", "12:30 AM",
  ];

  const convertTo24Hour = (time) => {
    if (!time) return { hour: 0, minute: 0 };
    const [timePart, modifier] = time.split(" ");
    let [hour, minute] = timePart.split(":").map(Number);

    if (modifier === "PM" && hour !== 12) hour += 12;
    if (modifier === "AM" && hour === 12) hour = 0;

    return { hour, minute };
  };

  const getTimeIndex = (time) => timeOptions.indexOf(time);

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    const selectedDate = new Date(date);
    return (today.getFullYear() === selectedDate.getFullYear() && today.getMonth() === selectedDate.getMonth() && today.getDate() === selectedDate.getDate());
  };

  const filteredStartTimes = useMemo(() => {
    if (!newSlot.date) return timeOptions;

    if (!isToday(newSlot.date)) return timeOptions;
    const now = new Date();

    return timeOptions.filter((time) => {
      const converted = convertTo24Hour(time);

      const slotDateTime = new Date(newSlot.date);
      slotDateTime.setHours(converted.hour, converted.minute, 0, 0);

      return slotDateTime > now;
    });
  }, [newSlot.date]);

  const filteredEndTimes = useMemo(() => {
    if (!newSlot.startTime) return [];

    return timeOptions.filter(
      (time) => getTimeIndex(time) > getTimeIndex(newSlot.startTime)
    );
  }, [newSlot.startTime]);

  const upcomingEst = useMemo(() => {
    const now = new Date();

    return slots
      .filter((slot) => {
        const end = convertTo24Hour(slot.endTime);

        const slotEnd = new Date(slot.date);
        slotEnd.setHours(end.hour, end.minute, 0, 0);

        return slotEnd > now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.startTime}`);
        const dateB = new Date(`${b.date} ${b.startTime}`);

        return dateA - dateB;
      });
  }, [slots]);

  const completedETS = useMemo(() => {
    const now = new Date();

    return slots.filter((slot) => {
      const end = convertTo24Hour(slot.endTime);
      const slotEnd = new Date(slot.date);
      slotEnd.setHours(end.hour, end.minute, 0, 0);
      return slotEnd < now;
    })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.startTime}`);
        const dateB = new Date(`${b.date} ${b.startTime}`);
        return dateB - dateA;
      });
  }, [slots]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setNewSlot((prev) => ({ ...prev, date: value, startTime: "", endTime: "", }));
      return;
    }

    if (name === "startTime") {
      setNewSlot((prev) => ({ ...prev, startTime: value, endTime: "", }));
      return;
    }
    setNewSlot((prev) => ({ ...prev, [name]: value, }));
  };

  const hasOverlap = (newSlotData, existingSlots, ignoreSlotId = null) => {

    const toMinutes = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hour, minute] = timePart.split(":").map(Number);

      if (modifier === "PM" && hour !== 12) hour += 12;
      if (modifier === "AM" && hour === 12) hour = 0;

      return hour * 60 + minute;
    };

    const newStart = toMinutes(newSlotData.startTime);
    const newEnd = toMinutes(newSlotData.endTime);

    return existingSlots.some((slot) => {
      if (ignoreSlotId && slot.slotId === ignoreSlotId) return false;
      if (slot.date !== newSlotData.date) return false;

      const existingStart = toMinutes(slot.startTime);
      const existingEnd = toMinutes(slot.endTime);
      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  const addSlot = async (slotId = null) => {
    try {
      setLoading(true);

      const slotPayload = { date: newSlot.date || reuseSlot.date, startTime: newSlot.startTime, endTime: newSlot.endTime, capacity: Number(newSlot.capacity), available: Number(newSlot.capacity), booked: 0, status: "available", };

      if (!slotPayload.date || !slotPayload.startTime || !slotPayload.endTime) {
        toast.error("Please fill all required fields");
        return;
      }

      if (hasOverlap(slotPayload, slots, slotId)) {
        toast.error("This slot overlaps with an existing slot");
        return;
      }

      if (!slotId) {
        const res = await axios.post(`${API_URL}/medical/slot`, slotPayload, { withCredentials: true });

        if (res.data.success) {
          setSlots((prev) => [...prev, slotPayload]);
          toast.success("Slot Created Successfully");
        }
      } else {
        const res = await axios.put(`${API_URL}/medical/re-use`, { slotId, optionalFor: repeatType, ...slotPayload, }, { withCredentials: true });

        if (res.data.success) {
          setSlots((prev) => prev.map((slot) => slot.slotId === slotId ? res.data.slot : slot));
          toast.success("Slot Updated Successfully");
        }
      }

      resetForm();
      setAddsote(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-start justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      {loading && (<div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"><Loading /></div>)}

      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-4xl border border-emerald-100 bg-linear-to-br from-white via-[#f8fffd] to-sky-50 shadow-[0_25px_80px_rgba(14,165,233,0.12)]">
        <div className="sticky top-0 z-20 border-b border-emerald-100 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
          <button onClick={() => { setAddsote(false); setReuseSlot?.(null); resetForm(); }} className="absolute right-4 top-4.1 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-all hover:bg-red-100 hover:text-red-500">
            <RxCross1 size={16} />
          </button>

          <div className="mr-8 flex flex-col gap-2 sm:flex-row items-baseline sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Manage Doctor Slots</h2>
              <p className="mt-1 text-sm text-slate-500">Add appointment availability for patients</p>
            </div>

            <button onClick={() => reuseSlot?.slotId ? addSlot(reuseSlot.slotId) : addSlot()} disabled={loading} className={`rounded-2xl px-5 py-3 mr-3 text-sm font-semibold text-white shadow-lg transition-all ${loading ? "cursor-not-allowed bg-slate-400" : "bg-linear-to-r from-emerald-500 to-sky-500 hover:scale-[1.02]"}`}>
              {loading ? "Creating..." : `${reuseSlot ? "Update Slot" : "+ Create Slot"}`}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-[1.8rem] border border-sky-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Slots</p>
              <h3 className="mt-3 text-3xl font-bold text-sky-500">{slots.length}</h3>
            </div>

            <div className="rounded-[1.8rem] border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Completed ETS</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-500">{completedETS.length}</h3>
            </div>

            <div className="rounded-[1.8rem] border border-orange-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Upcomming ETS</p>
              <h3 className="mt-3 text-3xl font-bold text-orange-500">{upcomingEst.length}</h3>
            </div>

            <div className="rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Max Per Day</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-800">20</h3>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-100 bg-white/90 p-4 shadow-sm sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Add New Availability Slot </h3>
              <p className="mt-1 text-sm text-slate-500">Fill in the details below to create a new appointment slot.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <div className="group">
                <label className="mb-3 flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-500 text-white shadow-lg">
                    <CalendarDays size={20} />
                    <div className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-sky-500">
                      <Sparkles size={10} />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">Appointment Date</p>
                    <p className="text-xs text-slate-400">Choose doctor availability date</p>
                  </div>
                </label>

                <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <CalendarDays size={18} />
                  </div>
                  <input type="date" name="date" min={new Date().toISOString().split("T")[0]} value={newSlot.date} onChange={handleChange} className="w-full bg-transparent py-5 pl-18 pr-5 text-sm font-semibold text-slate-700 outline-none" />
                </div>
              </div>

              <div className="group">
                <label className="mb-3 flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-green-500 text-white shadow-lg">
                    <Users size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">Maximum Patients</p>
                    <p className="text-xs text-slate-400">Set appointment capacity</p>
                  </div>
                </label>

                <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Users size={18} />
                  </div>
                  <input type="number" name="capacity" value={newSlot.capacity} onChange={handleChange} min="1" max="50" placeholder="Enter patient limit" className="w-full bg-transparent py-5 pl-18 pr-24 text-sm font-semibold text-slate-700 outline-none" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                    Max 50
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-500 text-white shadow-lg">
                    <Sunrise size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">Start Time</p>
                    <p className="text-xs text-slate-400">Future times only for today</p>
                  </div>
                </label>

                <div className="relative">
                  <button type="button" onClick={() => { setShowStartDropdown((prev) => !prev); setShowEndDropdown(false); }} className="relative flex w-full items-center justify-between rounded-[1.8rem] border border-slate-200 bg-white py-5 pl-18 pr-5 text-left text-sm font-semibold text-slate-700 shadow-sm">
                    <div className="pointer-events-none absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                      <Clock3 size={18} />
                    </div>
                    <span className={newSlot.startTime ? "text-slate-700" : "text-slate-400"}>{newSlot.startTime || "Select Start Time"}</span>
                    <ChevronDown size={18} className={`text-sky-500 transition-transform duration-200 ${showStartDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showStartDropdown && (
                    <div className="absolute left-0 right-0 bottom-[calc(100%+8px)] z-50 max-h-64 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl">
                      {filteredStartTimes.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-400">No available times</div>
                      ) : (
                        filteredStartTimes.map((time) => (
                          <button key={time} type="button" onClick={() => { setNewSlot((prev) => ({ ...prev, startTime: time, endTime: "", })); setShowStartDropdown(false); }} className={`flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all hover:bg-sky-50 hover:text-sky-600 ${newSlot.startTime === time ? "bg-sky-50 text-sky-600" : "text-slate-700"}`}>
                            {time}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="group">
                <label className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-green-500 text-white shadow-lg">
                    <Sunset size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">End Time</p>
                    <p className="text-xs text-slate-400">Must be greater than start time</p>
                  </div>
                </label>

                <div className="relative">
                  <button type="button" onClick={() => { if (!newSlot.startTime) return; setShowEndDropdown((prev) => !prev); setShowStartDropdown(false); }} className="relative flex w-full items-center justify-between rounded-[1.8rem] border border-slate-200 bg-white py-5 pl-18 pr-5 text-left text-sm font-semibold text-slate-700 shadow-sm">
                    <div className="pointer-events-none absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Clock3 size={18} />
                    </div>
                    <span className={newSlot.endTime ? "text-slate-700" : "text-slate-400"}>{newSlot.endTime || "Select End Time"}</span>
                    <ChevronDown size={18} className={`text-emerald-500 transition-transform duration-200 ${showEndDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showEndDropdown && (
                    <div className="absolute left-0 right-0 bottom-[calc(100%+8px)] z-50 max-h-64 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl">
                      {filteredEndTimes.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-400">Select start time first</div>
                      ) : (
                        filteredEndTimes.map((time) => (
                          <button key={time} type="button" onClick={() => { setNewSlot((prev) => ({ ...prev, endTime: time, })); setShowEndDropdown(false); }} className={`flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all hover:bg-emerald-50 hover:text-emerald-600 ${newSlot.endTime === time ? "bg-emerald-50 text-emerald-600" : "text-slate-700"}`}>
                            {time}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="group w-full">
                <label className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-sm">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">Continue Slot <span className="text-slate-400 font-semibold text-xs">(Optional)</span></p>
                    <p className="text-xs text-slate-400">Automatically repeat this slot</p>
                  </div>
                </label>

                <div className="relative">
                  {open && (
                    <div className="absolute left-0 right-0 bottom-[calc(100%+8px)] z-50 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl">
                      {repeatOptions.map((option) => {
                        const isSelected = repeatType === option.value;

                        return (
                          <button key={option.value} type="button" onClick={() => { setRepeatType(option.value); setOpen(false); }} className={`mb-1 flex w-full items-center rounded-2xl px-4 py-3 text-left transition-all ${isSelected ? "bg-sky-50 text-sky-600" : "text-slate-700 hover:bg-slate-50"}`}>
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isSelected ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-500"}`}>
                                <CalendarDays size={16} />
                              </div>

                              <div>
                                <p className={`text-sm font-semibold ${isSelected ? "text-sky-700" : "text-slate-800"}`}>   {option.label}</p>
                                <p className={`text-xs ${isSelected ? "text-sky-500" : "text-slate-400"}`}>  {option.desc}</p>
                              </div>
                            </div>

                            {isSelected && (<div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600"><Check size={16} /></div>)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-[1.8rem] border border-slate-200 bg-white py-2 pl-3 pr-3 text-left text-sm font-semibold text-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                        <CalendarDays size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">{repeatOptions.find((option) => option.value === repeatType)?.label}</p>
                        <p className="text-xs text-slate-400">{repeatOptions.find((option) => option.value === repeatType)?.desc}</p>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`text-sky-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                  </button>

                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 rounded-4xl border border-slate-100 bg-white/90 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Upcoming ETS Slots</h3>
                <p className="mt-1 text-sm text-slate-500">Slots whose end time completing soon</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600">{upcomingEst.length} Completed</div>
            </div>

            {upcomingEst.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 py-10 text-center">
                <p className="text-sm text-slate-500">No Upcoming ETS slots found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {upcomingEst.map((slot) => (
                  <div key={slot.slotId} className="rounded-3xl border border-emerald-100 bg-linear-to-br from-white via-emerald-50 to-sky-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Completng Soon</p>
                      </div>
                      <div className="rounded-2xl bg-yellow-100 px-3 py-2 text-xs font-bold text-yellow-700">Upcomming</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <span className="text-sm font-medium text-slate-500">Date</span>
                        <span className="text-sm font-bold text-slate-800">{slot.date}</span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <span className="text-sm font-medium text-slate-500">Start Time</span>
                        <span className="text-sm font-bold text-sky-600">{slot.startTime}</span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <span className="text-sm font-medium text-slate-500">End Time</span>
                        <span className="text-sm font-bold text-emerald-600">{slot.endTime}</span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSlots;
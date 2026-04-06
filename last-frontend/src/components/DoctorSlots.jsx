import axios from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import Loading from "./loading";
import { Clock3, ChevronDown, Sunrise, Sunset, Users, Sparkles, CalendarDays, } from "lucide-react";

const DoctorSlots = ({ slots, setSlots, setAddsote }) => {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  const timeOptions = ["01:00 AM","01:30 AM","02:00 AM","02:30 AM","03:00 AM","03:30 AM","04:00 AM","04:30 AM","05:00 AM","05:30 AM","06:00 AM","06:30 AM","07:00 AM","07:30 AM","08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",];
  const [newSlot, setNewSlot] = useState({ date: "", startTime: "", endTime: "", capacity: "", booked: 0, available: 0, });

  const morningTimes = timeOptions.filter((time) => time.includes("AM"));
  const eveningTimes = timeOptions.filter((time) => time.includes("PM"));

  const convertTo24Hour = (time) => {
    if (!time) return { hour: 0, minute: 0 };

    const [timePart, modifier] = time.split(" ");
    let [hour, minute] = timePart.split(":").map(Number);

    if (modifier === "PM" && hour !== 12) {
      hour += 12;
    }

    if (modifier === "AM" && hour === 12) {
      hour = 0;
    }

    return { hour, minute };
  };

  const getTimeIndex = (time) => timeOptions.indexOf(time);

  const filteredEndTimes = useMemo(() => {
    if (!newSlot.startTime) return timeOptions;

    return timeOptions.filter(
      (time) => getTimeIndex(time) > getTimeIndex(newSlot.startTime)
    );
  }, [newSlot.startTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewSlot((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "startTime") {
      const currentStartIndex = getTimeIndex(value);
      const currentEndIndex = getTimeIndex(newSlot.endTime);

      if (newSlot.endTime && currentEndIndex <= currentStartIndex) {
        setNewSlot((prev) => ({ ...prev, startTime: value, endTime: "", }));
      }
    }
  };

  const resetForm = () => { setNewSlot({ date: "", startTime: "", endTime: "", capacity: "", booked: 0, available: 0, }); };

  const addSlot = async () => {
    if (loading) return;

    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime || !newSlot.capacity) {
      toast.error("Please fill all required fields");
      return;
    }

    if (newSlot.startTime === newSlot.endTime) {
      toast.error("Start time and end time cannot be same");
      return;
    }

    const capacity = Number(newSlot.capacity);

    if (isNaN(capacity)) {
      toast.error("Capacity must be a valid number");
      return;
    }

    if (capacity < 1) {
      toast.error("At least 1 patient is required");
      return;
    }

    if (capacity > 50) {
      toast.error("Maximum patient limit is 50");
      return;
    }

    const selectedDate = new Date(newSlot.date);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("You cannot create slots for past dates");
      return;
    }

    const start = convertTo24Hour(newSlot.startTime);
    const end = convertTo24Hour(newSlot.endTime);

    const selectedStart = new Date(newSlot.date);
    selectedStart.setHours(start.hour, start.minute, 0, 0);

    const selectedEnd = new Date(newSlot.date);
    selectedEnd.setHours(end.hour, end.minute, 0, 0);

    if (isNaN(selectedStart.getTime()) || isNaN(selectedEnd.getTime())) {
      toast.error("Invalid date or time format");
      return;
    }

    if (selectedEnd <= selectedStart) {
      toast.error("End time must be after start time");
      return;
    }

    const now = new Date();

    if (selectedStart <= now) {
      toast.error("Slot start time must be in the future");
      return;
    }

    const diffMinutes = (selectedEnd - selectedStart) / (1000 * 60);

    if (diffMinutes < 15) {
      toast.error("Minimum slot duration is 15 minutes");
      return;
    }

    if (diffMinutes > 1440) {
      toast.error("Maximum slot duration is 24 hours");
      return;
    }

    if (start.minute % 5 !== 0 || end.minute % 5 !== 0) {
      toast.error("Time must be in 5-minute intervals");
      return;
    }

    const exactDuplicate = slots.some((slot) => slot.date === newSlot.date && slot.startTime === newSlot.startTime && slot.endTime === newSlot.endTime);

    if (exactDuplicate) {
      toast.error("This exact slot already exists");
      return;
    }

    const isOverlap = slots.some((slot) => {
      if (slot.date !== newSlot.date) return false;

      const existingStartTime = convertTo24Hour(slot.startTime);
      const existingEndTime = convertTo24Hour(slot.endTime);

      const existingStart = new Date(slot.date);
      existingStart.setHours(existingStartTime.hour, existingStartTime.minute, 0, 0);

      const existingEnd = new Date(slot.date);
      existingEnd.setHours(existingEndTime.hour, existingEndTime.minute, 0, 0);

      return (selectedStart < existingEnd && selectedEnd > existingStart);
    });

    if (isOverlap) {
      toast.error("This slot overlaps with an existing slot");
      return;
    }

    const sameDaySlots = slots.filter(
      (slot) => slot.date === newSlot.date
    );

    if (sameDaySlots.length >= 20) {
      toast.error("Maximum 20 slots allowed per day");
      return;
    }

    if (slots.length >= 100) {
      toast.error("Too many slots created");
      return;
    }

    const slotPayload = { date: newSlot.date, startTime: newSlot.startTime, endTime: newSlot.endTime, capacity, available: capacity, booked: 0, status: "available", };

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/medical/slot`, slotPayload, { withCredentials: true, });

      if (res.data.success) {
        toast.success(res.data.message || "Slot added successfully");

        const savedSlot = res.data.slot || slotPayload;
        setSlots((prev) => [...prev, savedSlot]);
        resetForm();
      }
    } catch (err) {
      console.log(err);

      if (err.response) {
        toast.error(err.response.data.message || "Failed to create slot");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    (<div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"><Loading /></div>)
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-start justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-4xl border border-emerald-100 bg-linear-to-br from-white via-[#f8fffd] to-sky-50 shadow-[0_25px_80px_rgba(14,165,233,0.12)]">
        <div className="sticky top-0 z-20 border-b border-emerald-100 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
          <button onClick={() => setAddsote(null)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-all hover:bg-red-100 hover:text-red-500">
            <RxCross1 size={16} />
          </button>

          <div className="mr-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Manage Doctor Slots</h2>
              <p className="mt-1 text-sm text-slate-500">Add appointment availability for patients</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-500"> Total Slots</p>
                <h3 className="text-lg font-bold text-slate-800">{slots.length}</h3>
              </div>

              <button onClick={addSlot} disabled={loading} className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all ${loading ? "cursor-not-allowed bg-slate-400" : "bg-linear-to-r from-emerald-500 to-sky-500 hover:scale-[1.02]"}`}>
                {loading ? "Creating..." : "+ Create Slot"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.8rem] border border-sky-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Upcoming Slots</p>
              <h3 className="mt-3 text-3xl font-bold text-sky-500">{slots.length}</h3>
            </div>

            <div className="rounded-[1.8rem] border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Available</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-500">{slots.reduce((acc, slot) => acc + (slot.available || 0), 0)}</h3>
            </div>

            <div className="rounded-[1.8rem] border border-orange-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Booked</p>
              <h3 className="mt-3 text-3xl font-bold text-orange-500">{slots.reduce((acc, slot) => acc + (slot.booked || 0), 0)}</h3>
            </div>

            <div className="rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Max Per Day</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-800">20</h3>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-100 bg-white/90 p-4 shadow-sm sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Add New Availability Slot</h3>
              <p className="mt-1 text-sm text-slate-500">Fill in the details below to create a new appointment slot.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="group">
                <label className="mb-3 flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-500 text-white shadow-lg">
                    <CalendarDays size={20} />
                    <div className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-sky-500"><Sparkles size={10} /></div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">Appointment Date</p>
                    <p className="text-xs text-slate-400"> Choose doctor availability date</p>
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
                    <p className="text-xs text-slate-400">Select appointment start time</p>
                  </div>
                </label>

                <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Clock3 size={18} />
                  </div>

                  <select name="startTime" value={newSlot.startTime} onChange={handleChange} className="w-full appearance-none bg-transparent py-5 pl-18 pr-16 text-sm font-semibold text-slate-700 outline-none">
                    <option value="">Select Start Time</option>

                    <optgroup label="Morning">
                      {morningTimes.map((time) => (<option key={time} value={time}>{time}</option>))}
                    </optgroup>

                    <optgroup label="Afternoon & Evening">
                      {eveningTimes.map((time) => (<option key={time} value={time}>{time} </option>))}
                    </optgroup>
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sky-500"><ChevronDown size={18} /> </div>
                </div>
              </div>

              <div className="group">
                <label className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-green-500 text-white shadow-lg">
                    <Sunset size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">End Time</p>
                    <p className="text-xs text-slate-400">Select appointment end time</p>
                  </div>
                </label>

                <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Clock3 size={18} />
                  </div>

                  <select name="endTime" value={newSlot.endTime} onChange={handleChange} className="w-full appearance-none bg-transparent py-5 pl-18 pr-16 text-sm font-semibold text-slate-700 outline-none">
                    <option value="">Select End Time</option>

                    {filteredEndTimes.map((time) => (<option key={time} value={time}>{time}</option>))}
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-sky-100 bg-linear-to-r from-sky-50 to-emerald-50 p-4">
              <h4 className="text-sm font-bold text-slate-700">Helpful Guidelines</h4>

              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li>• Minimum slot duration should be 15 minutes</li>
                <li>• Maximum slot duration should be 3 hours</li>
                <li>• Time should be in 5-minute intervals</li>
                <li>• Maximum 20 slots per day</li>
                <li>• Maximum 50 patients per slot</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSlots;
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import Loading from "./loading";


const DoctorSlots = ({ slots, setAddsote, setSlots }) => {
  const [loading, setLoading] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    booked: 0,
    available: 0
  });

  const handleChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  const addSlot = async () => {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime || !newSlot.capacity) {
      toast.error("Please fill all fields");
      return;
    }


    if (newSlot.capacity <= 0) {
      toast.error("Enter valid max patients");
      return;
    }

    if (newSlot.capacity > 50) {
      toast.error(" max patients 50 ");
      return;
    }

    const [startHour, startMin] = newSlot.startTime.split(":").map(Number);
    const [endHour, endMin] = newSlot.endTime.split(":").map(Number);

    const selectedStart = new Date(newSlot.date);
    selectedStart.setHours(startHour, startMin, 0, 0);

    const selectedEnd = new Date(newSlot.date);
    selectedEnd.setHours(endHour, endMin, 0, 0);

    if (selectedEnd <= selectedStart) {
      selectedEnd.setDate(selectedEnd.getDate() + 1);
    }

    if (selectedEnd <= selectedStart) {
      toast.error("Invalid time range");
      return;
    }


    const now = new Date();

    if (isNaN(selectedStart.getTime()) || isNaN(selectedEnd.getTime())) {
      toast.error("Invalid date/time format");
      return;
    }

    if (selectedStart <= now) {
      toast.error("Slot must be in the future");
      return;
    }

    if (selectedEnd <= selectedStart) {
      toast.error("End time must be after start time");
      return;
    }

    const diffMinutes = (selectedEnd - selectedStart) / (1000 * 60);
    if (diffMinutes < 15) {
      toast.error("Minimum slot duration is 15 minutes");
      return;
    }
    if (diffMinutes > 180) {
      toast.error("Maximum slot duration is 3 hours");
      return;
    }


    const isOverlap = slots.some((s) => {
      if (s.date !== newSlot.date) return false;

      const existingStart = new Date(`${s.date}T${s.startTime}`);
      const existingEnd = new Date(`${s.date}T${s.endTime}`);


      return (
        selectedStart < existingEnd &&
        selectedEnd > existingStart
      );
    });

    if (isOverlap) {
      toast.error("Slot overlaps with existing slot");
      return;
    }

    const slotPayload = {
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      capacity: Number(newSlot.capacity),
      available: Number(newSlot.capacity),
      booked: 0,
    };



    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/medical/slot`,
        slotPayload,
        { withCredentials: true }
      );


      if (res.data.success) {
        toast.success(res.data.message || "Slot Added 🎉");

        const savedSlot = res.data.slot || slotPayload;

        setSlots((prev) => [...prev, savedSlot]);

        setNewSlot({
          date: "",
          startTime: "",
          endTime: "",
          capacity: "",
        });
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Slot failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAddsote(null);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (

    <div className="fixed inset-0 z-50  flex items-top md:items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">

      <div className="relative bg-white border border-sky-200 rounded-2xl sm:rounded-3xl 
    p-4 sm:p-6 md:p-8 
    w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl 
    max-h-[85vh] overflow-y-auto shadow-lg ">

        {/* Close Button */}
        <button
          onClick={() => setAddsote(null)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-red-500 text-base sm:text-lg"
        >
          <RxCross1 />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Doctor Slots
          </h2>
          <span className="text-xs sm:text-sm text-gray-500">
            Upcoming slote: {slots.length}
          </span>
        </div>

        {/* Add Slot Card */}
        <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">

          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                Add New Slot
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Configure availability for appointments
              </p>
            </div>

            <button
              onClick={addSlot}
              className="
            w-full sm:w-auto
            text-xs sm:text-sm
            px-3 py-1.5 sm:px-5 sm:py-2.5
            rounded-lg sm:rounded-xl
            bg-gradient-to-r from-sky-500 to-sky-600 
            hover:from-sky-600 hover:to-sky-700 
            text-white font-semibold shadow-sm transition-all
          "
            >
              + Add Slot
            </button>
          </div>

          {/* Form Grid */}
          <div className="
        bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl 
        p-3 sm:p-6 
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
        gap-3 sm:gap-6
      ">

            {/* Date */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 sm:mb-2 block">
                Select Date
              </label>
              <input
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]}
                value={newSlot.date}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none"
              />
            </div>

            {/* Max Patients */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 sm:mb-2 block">
                Max Patients
              </label>
              <input
                type="number"
                name="capacity"
                value={newSlot.capacity}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 5"
                className="w-full bg-white border border-gray-200 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 sm:mb-2 block">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={newSlot.startTime}
                onChange={handleChange}
                min={
                  newSlot.date === new Date().toLocaleDateString("en-CA")
                    ? new Date().toTimeString().slice(0, 5)
                    : undefined
                }
                className="w-full bg-white border border-gray-200 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 sm:mb-2 block">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={newSlot.endTime}
                onChange={handleChange}
                min={newSlot.startTime || undefined}
                className="w-full bg-white border border-gray-200 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorSlots;
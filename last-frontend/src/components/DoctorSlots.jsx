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
            capacity: newSlot.capacity,
            booked: false,
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

                // ✅ Use backend response (IMPORTANT)
                const savedSlot = res.data.slot || slotPayload;

                setSlots((prev) => [...prev, savedSlot]);

                // ✅ Reset form
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

        <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-black/50 backdrop-blur-sm p-4">

            <div className="relative bg-white border border-sky-200 rounded-3xl p-8 shadow-lg max-w-5xl mx-auto">

                <button onClick={() => setAddsote(null)}
                    className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-red-500 text-lg"
                >
                    <RxCross1 />
                </button>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Doctor Slots
                    </h2>
                    <span className="text-sm text-gray-500">
                        Total: {slots.length}
                    </span>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-6 mb-8">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Add New Slot
                            </h3>
                            <p className="text-sm text-gray-500">
                                Configure availability for appointments
                            </p>
                        </div>

                        <button
                            onClick={addSlot}
                            className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
                        >
                            + Add Slot
                        </button>
                    </div>

                    {/* Form Card */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Date */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-2 block">
                                Select Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={newSlot.date}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none transition"
                            />
                        </div>

                        {/* Max Patients */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-2 block">
                                Max Patients
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                value={newSlot.capacity}
                                onChange={handleChange}
                                min="1"
                                placeholder="e.g. 5"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none"
                            />
                        </div>

                        {/* Start Time */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-2 block">
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
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-2 block">
                                End Time
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={newSlot.endTime}
                                onChange={handleChange}
                                min={newSlot.startTime || undefined}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3"
                            />
                        </div>

                    </div>
                </div>



            </div>
        </div>
    );
};

export default DoctorSlots;
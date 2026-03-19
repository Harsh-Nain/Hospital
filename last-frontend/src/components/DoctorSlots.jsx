import axios from "axios";
import  {  useState } from "react";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import Loading from "./loading";

const DoctorSlots = ({ slots, setAddsote, setSlots }) => {
    const [loading, setLoading] = useState(false);
    const [newSlot, setNewSlot] = useState({
        date: "",
        startTime: "",
        endTime: ""
    });

    const handleChange = (e) => {
        setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
    };

    // Add slot
   const addSlot = async () => {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
        toast.error("Please fill all fields");
        return;
    }

    const now = new Date();
    const selectedStart = new Date(`${newSlot.date}T${newSlot.startTime}`);
    const selectedEnd = new Date(`${newSlot.date}T${newSlot.endTime}`);

    // ❌ Past date/time not allowed
    if (selectedStart <= now) {
        toast.error("Slot must be in future");
        return;
    }

    // ❌ End must be after start
    if (selectedStart >= selectedEnd) {
        toast.error("End time must be after start time");
        return;
    }

    // ❌ Minimum 15 min duration
    const diffMinutes = (selectedEnd - selectedStart) / (1000 * 60);
    if (diffMinutes < 15) {
        toast.error("Minimum slot duration is 15 minutes");
        return;
    }

    // ❌ Overlapping check (improved)
    const isOverlap = slots.some(s => {
        const existingStart = new Date(`${newSlot.date}T${s.startTime}`);
        const existingEnd = new Date(`${newSlot.date}T${s.endTime}`);

        return (
            selectedStart < existingEnd &&
            selectedEnd > existingStart
        );
    });
    

    if (isOverlap) {
        toast.error("Slot overlaps with existing slot");
        return;
    }

    const slot = {
        ...newSlot,
        booked: false,
    };

    try {
        setLoading(true);

        const res = await axios.post(`${API_URL}/medical/slot`, slot, {
            withCredentials: true,
        });

        if (res.data.success) {
            toast.success(res.data.message || "Slot Added 🎉");

            setSlots([...slots, slot]);
            setNewSlot({ date: "", startTime: "", endTime: "" });
        }
    } catch (err) {
        if (err.response) {
            toast.error(err.response.data.message || "Slot failed");
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

                {/* Add Slot Section */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 mb-6">
                    <div className="flex mb-4 justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Add New Slot
                        </h3>
                        <button
                            onClick={addSlot}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
                        >
                            + Add Slot
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    {/* Date */}
    <div className="flex flex-col">
        <label className="text-sm mb-1 text-gray-600">Select Date</label>
        <input
            type="date"
            name="date"
            min={new Date().toISOString().split("T")[0]}
            value={newSlot.date}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-sky-400"
        />
    </div>

    {/* Start Time */}
    <div className="flex flex-col">
        <label className="text-sm mb-1 text-gray-600">Start Time</label>
        <input
            type="time"
            name="startTime"
            value={newSlot.startTime}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-sky-400"
        />
    </div>

    {/* End Time */}
    <div className="flex flex-col">
        <label className="text-sm mb-1 text-gray-600">End Time</label>
        <input
            type="time"
            name="endTime"
            value={newSlot.endTime}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-sky-400"
        />
    </div>
</div>


                </div>

                {/* Slots List */}


            </div>
        </div>
    );
};

export default DoctorSlots;
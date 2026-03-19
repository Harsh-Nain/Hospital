    import axios from "axios";
    import React, { useEffect, useState } from "react";
    import toast from "react-hot-toast";
    import { RxCross1 } from "react-icons/rx";
    import Loading from "./loading";

    const DoctorSlots = ({ slots, setAddsote, setSlots }) => {
        const [loading, setLoading] = useState(false);
        const [newSlot, setNewSlot] = useState({ date: "", startTime: "", endTime: "" });
        const handleChange = (e) => { setNewSlot({ ...newSlot, [e.target.name]: e.target.value }); };
        const API_URL = import.meta.env.VITE_BACKEND_URL;

        const addSlot = async () => {

            if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
                toast.error("Please fill all fields");
                return;
            }

            const today = new Date().toISOString().split("T")[0];

            if (newSlot.date < today) {
                toast.error("Past date allowed nahi hai");
                return;
            }

            const start = new Date(`1970-01-01T${newSlot.startTime}`);
            const end = new Date(`1970-01-01T${newSlot.endTime}`);

            if (start >= end) {
                toast.error("End time must be after start time");
                return;
            }

            const isOverlap = slots.some(s =>
                s.date === newSlot.date &&
                !(newSlot.endTime <= s.startTime || newSlot.startTime >= s.endTime)
            );

            if (isOverlap) {
                toast.error("Slot overlaps with existing slot");
                return;
            }

            const slot = { ...newSlot, booked: false, };

            try {
                setLoading(true);
                const res = await axios.post(`${API_URL}/medical/slot`, slot, { withCredentials: true, });

                if (res.data.success) {
                    toast.success("Successful 🎉");
                    const formattedSlot = { ...newSlot, date: new Date(newSlot.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), booked: false, };
                    setSlots([...slots, formattedSlot]);
                    setNewSlot({ date: "", startTime: "", endTime: "" });
                }
            } catch (err) {
                console.log(err);
                if (err.response) {
                    toast.error(err.response.data.message || "Slot failed");
                }
            }
            finally {
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

                    <button onClick={() => setAddsote(null)} className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-red-500 text-lg">
                        <RxCross1 />
                    </button>

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Doctor Slots
                        </h2>
                        <span className="text-sm text-gray-500">
                            Total: {slots.length}
                        </span>
                    </div>

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

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                            {/* Date */}
                            <input
                                type="date"
                                name="date"
                                value={newSlot.date}
                                onChange={handleChange}
                                className="border rounded-xl px-3 py-2"
                            />

                            <input
                                type="time"
                                name="startTime"
                                value={newSlot.startTime}
                                onChange={handleChange}
                                className="border rounded-xl px-3 py-2"
                            />

                            <input
                                type="time"
                                name="endTime"
                                value={newSlot.endTime}
                                onChange={handleChange}
                                className="border rounded-xl px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Slots List */}


                </div>
            </div>
        );
    };

    export default DoctorSlots;
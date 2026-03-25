import axios from "axios";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaStar } from "react-icons/fa";
import Loading from "../components/loading";
import toast from "react-hot-toast";

export default function NextAppoitment({ id, setNextAppoitment, patientId }) {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [doctor, setDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [confirmSlot, setConfirmSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatTime = (time) => {
        const [hour, minute] = time.split(":");
        let h = parseInt(hour, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}:${minute} ${ampm}`;
    };

    useEffect(() => {
        const fetchDoctor = async () => {

            try {
                const res = await axios.get(`${API_URL}/profile/doctor?doctorId=${id}`, { withCredentials: true });
                console.log(res.data);

                if (res.data.success) {
                    setDoctor(res.data.doctor);
                    setReviews(res.data.reviews || []);
                    setRating(res.data.rating);
                    setSlots(res.data.slots);
                } else {
                    toast.error(res.data.message)
                }

            } catch (error) {
                console.error(error);
                toast.error("Failed to load doctor");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDoctor();
    }, [id]);

    const confirmAppointment = async () => {
        if (!selectedSlot) return toast.error("Select a slot");

        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/medical/appointment-add`, { doctorId: doctor.doctorId, patientId, slotId: selectedSlot, }, { withCredentials: true });
            console.log(res.data);

            if (res.data.success) {
                setNextAppoitment(null);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Booking failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading) { return (<div className="fixed inset-0 flex h-screen items-center justify-center bg-black/70 z-50"><Loading /></div>); }

    return (
        <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-black/50 backdrop-blur-sm p-4">

            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-xl p-6">

                <button onClick={() => setNextAppoitment(false)} className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center  cursor-pointer rounded-lg text-gray-500 hover:text-red-500 hover:bg-zinc-100 transition"    >
                    <RxCross1 size={20} />
                </button>

                <div className="flex gap-5 items-center relative">
                    <img src={doctor?.image || "/doctor.png"} className="w-24 h-24 rounded-xl object-cover border" />
                    <div>
                        <h2 className="text-xl font-bold">Dr. {doctor?.fullName}</h2>
                        <div className="flex justify-center gap-3 items-center">
                            <p className="text-sky-600 font-medium">{doctor?.specialization}</p>
                            <p className={`${doctor.status == "suspanded" ? "bg-yellow-400" : "bg-emerald-400"} text-white rounded-xl text-xs px-1`}>{doctor.status == "suspanded" ? "Suspanded" : "Active"}</p>
                        </div>
                        <p className="text-sm text-gray-500">{doctor?.experience} years experience</p>

                        <div className="flex items-center gap-2 mt-1">
                            <FaStar className="text-yellow-500" />
                            <span className="font-medium">{rating?.avgRating || "0.0"}   </span>
                            <span className="text-gray-500 text-sm">({rating?.totalReviews || 0} reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="my-6 h-px bg-gray-200"></div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                        <p className="text-gray-500">Consultation Fee</p>
                        <p className="font-semibold text-lg">₹{doctor?.fee}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Experience</p>
                        <p className="font-semibold text-lg">{doctor?.experience} yrs</p>
                    </div>
                </div>

                {doctor?.bio && (
                    <div className="mb-6">
                        <p className="text-gray-500 text-sm mb-1">About Doctor</p>
                        <p className="text-gray-700 text-sm">{doctor.bio}</p>
                    </div>
                )}

                <div className="flex flex-col overflow-y-auto max-h-[42vh] ">
                    <div className="mb-6">
                        <div className="flex justify-between items-center pr-2">
                            <h3 className="font-semibold mb-3">Available Slots</h3>
                            {confirmSlot && (<button onClick={() => confirmAppointment()} className=" px-2 cursor-pointer py-1 rounded-lg bg-sky-600 text-white border-sky-600 text-sm font-medium hover:shadow-lg transition">Confirm Appointment</button>)}
                        </div>

                        <div>
                            {slots.length === 0 ? (<p className="text-gray-500 text-sm">No slots available</p>) : (
                                <div className="flex flex-wrap justify-around md:justify-start items-center gap-3">
                                    {slots.map((slot) => {
                                        const booked = slot.patientIds.includes(patientId);
                                        return (
                                            <button key={slot.id} onClick={() => { setSelectedSlot(slot.id); setConfirmSlot({ ...slot, ...doctor }); }} disabled={booked} className={` px-4 py-3 rounded-2xl border text-sm font-medium min-w-27.5 flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-in-out ${selectedSlot === slot.id && !booked ? "bg-sky-600 text-white border-sky-600 shadow-md scale-[1.03]" : booked ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:bg-sky-50 hover:border-sky-300 hover:shadow-sm active:scale-95"} focus:outline-none`}>
                                                <p className="text-xs font-medium">{slot.date}</p>
                                                <p className="text-xs">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-semibold mb-3">Patient Reviews</h3>

                        {reviews.length === 0 ? (<p className="text-gray-500 text-sm">No reviews yet</p>) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border rounded-xl p-4 bg-white shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <img src={review.patientImage || "/user.png"} className="w-10 h-10 rounded-full" />

                                            <div>
                                                <p className="font-medium text-sm">{review.patientName}</p>
                                                <div className="flex items-center text-yellow-500 text-xs"><FaStar />{review.rating}</div>
                                            </div>
                                        </div>
                                        {review.reviewText && (<p className="text-sm text-gray-600 mt-2">{review.reviewText}</p>)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
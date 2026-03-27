import axios from "axios";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaStar } from "react-icons/fa";
import Loading from "../components/loading";
import toast from "react-hot-toast";
import PaymentCard from "../components/paymentcard"
import { FaClock, FaCalendarAlt, FaUsers } from "react-icons/fa";

export default function ShowDoctorProfile({ id, setshowDoctorDetail, patientId, isAdmin, }) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmSlot, setConfirmSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pay, setPay] = useState(null);

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

  const profileControler = async () => {
    let url = "reactivate_doctor"
    if (doctor.status !== "suspanded") {
      url = "suspand_doctor"
    }

    try {
      setLoading(true)
      const res = await axios.put(`${API_URL}/admin/${url}`, { doctorId: doctor.doctorId, userId: doctor.userId, name: doctor.fullName, email: doctor.email }, { withCredentials: true });

      if (res.data.success) {
        setLoading(false)
        toast.success(res.data.message)
        setshowDoctorDetail(false)
      }
    } catch (error) {
      setLoading(false)
      console.error(error);
      toast.error("failed");
    }
  }

  const confirmAppointment = async () => {
    if (!selectedSlot) return toast.error("Select a slot");

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/medical/appointment-add`, { doctorId: doctor.doctorId, patientId, slotId: selectedSlot, }, { withCredentials: true });
      console.log(res.data);

      if (res.data.success) {
        setshowDoctorDetail(null);
        setPay(confirmSlot)
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

  if (loading) { return (<div className="fixed inset-0 flex h-screen items-center justify-center bg-black/70 z-99999"><Loading /></div>); }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* {pay && <PaymentCard payment={pay} API_URL={API_URL} onClose={() => setPay(null)} patientId={patientId} />} */}

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

        <button onClick={() => setshowDoctorDetail(null)} className="absolute cursor-pointer top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-red-50 hover:scale-105 transition">
          <RxCross1 size={18} />
        </button>

        <div className="bg-linear-to-r from-sky-300 relative via-sky-400 to-blue-400 text-white p-6 flex items-center gap-5">

          <img src={doctor?.image} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/80 shadow-lg" />

          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">Dr. {doctor?.fullName}</h2>
            <p className="text-sm opacity-90 capitalize">{doctor?.specialization}</p>

            <div className="flex items-center gap-3 mt-2 flex-wrap">

              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">{doctor?.experience} yrs exp</span>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.status === "suspanded" ? "bg-yellow-300 text-black" : "bg-emerald-300 text-black"}`}>
                {doctor.status === "suspanded" ? "Suspended" : "Active"}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <FaStar className="text-yellow-300" />
              <span className="font-semibold">{rating?.avgRating || "0.0"}</span>
              <span className="text-sm opacity-80">({rating?.totalReviews || 0})</span>
            </div>
            {(isAdmin) && (
              <button onClick={profileControler} className={`px-4 py-2 rounded-xl bottom-2 right-17 absolute bg-linear-to-r ${doctor.status == "approved" ? "from-orange-400 to-red-500" : "from-emerald-300 to-green-500"} text-white text-sm shadow hover:shadow-lg hover:scale-[1.03] transition`}>
                {doctor.status == "approved" ? "Suspand Doctor" : "Re-activate Doctor"}
              </button>
            )}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[65vh] sm:max-h-[70vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">

            {[
              { label: "Fee", value: `₹${doctor?.fee}` },
              { label: "Experience", value: `${doctor?.experience} yrs` },
              { label: "Patients", value: reviews.length }
            ].map((item, i) => (
              <div key={i} className="bg-linear-to-br from-sky-50 to-white p-4 rounded-2xl text-center border border-sky-100 hover:shadow-md transition">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-bold text-lg text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>

          {doctor?.bio && (
            <div className="mb-6 bg-linear-to-r from-gray-50 to-white p-4 rounded-2xl border">
              <p className="text-xs text-gray-400 mb-1">About Doctor</p>
              <p className="text-sm text-gray-700 leading-relaxed">{doctor.bio}</p>
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Available Slots</h3>

              {(confirmSlot && !isAdmin) && (
                <button onClick={confirmAppointment} className="px-4 py-2 rounded-xl bg-linear-to-r from-sky-400 to-blue-500 text-white text-sm shadow hover:shadow-lg hover:scale-[1.03] transition">
                  Confirm Appointment
                </button>
              )}
            </div>

            {slots.length === 0 ? (
              <p className="text-gray-400 text-sm">No slots available</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                {slots.map((slot) => {
                  const booked = slot.patientIds.includes(patientId);
                  const available = slot.capacity - slot.patientIds.length;
                  const percent = (slot.patientIds.length / slot.capacity) * 100;

                  const getStatusColor = () => {
                    if (available <= 0) return "bg-gray-100 text-gray-400";
                    if (available === 1) return "bg-yellow-50 border-yellow-200";
                    return "bg-white hover:bg-sky-50 border-sky-100";
                  };

                  return (
                    <button key={slot.id} disabled={booked || isAdmin} onClick={() => { setSelectedSlot(slot.id); setConfirmSlot({ ...slot, ...doctor }); }} className={`relative p-3 rounded-2xl border transition-all duration-300 text-left  ${selectedSlot === slot.id && !booked ? "bg-linear-to-br from-sky-300 to-blue-400 text-white shadow-lg scale-[1.05]" : booked ? "bg-gray-100 text-gray-400 cursor-not-allowed" : getStatusColor()}`}>

                      <p className="flex items-center gap-1 text-[11px] opacity-80">
                        <FaCalendarAlt className="text-yellow-400" />
                        {slot.date}
                      </p>
                      <p className={`${booked && "absolute top-0.5 right-1 text-xs text-yellow-500"}`}>already requested</p>

                      <p className="flex items-center gap-1 text-xs font-semibold mt-1">
                        <FaClock className="text-green-500" />
                        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                      </p>

                      <p className={`flex items-center gap-1 text-[10px] mt-2 ${available <= 1 ? "text-red-400" : "text-gray-500"}`}>
                        <FaUsers />
                        {available > 0 ? `${available} left` : "Full"}
                      </p>

                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className={`h-full rounded-full transition-all duration-500 ${percent > 80 ? "bg-red-400" : percent > 50 ? "bg-yellow-400" : "bg-emerald-400"}`} />
                      </div>

                      {selectedSlot === slot.id && !booked && (<div className="absolute inset-0 rounded-2xl ring-2 ring-white/40"></div>)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-gray-800">Patient Reviews</h3>

            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet</p>
            ) : (
              <div className="space-y-4">

                {reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-2xl mb-5 bg-white border shadow-sm hover:shadow-md transition">
                    <div className="flex gap-3">
                      <img src={review.patientImage || "/user.png"} className="w-12 h-12 rounded-full object-cover" />

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{review.patientName}</p>
                          <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex text-yellow-400 text-sm mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? "" : "text-gray-300"} />
                          ))}
                        </div>

                        {review.reviewText && (<p className="text-sm text-gray-600 mt-2">{review.reviewText}</p>)}
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
}
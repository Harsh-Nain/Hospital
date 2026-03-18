import axios from "axios";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaStar } from "react-icons/fa";
import Loading from "../components/loading";
import toast from "react-hot-toast";

export default function ShowDoctorProfile({ id, setshowDoctorDetail, patientId, isAdmin }) {

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile/doctor?doctorId=${id}`, { withCredentials: true });

        if (res.data.success) {
          setDoctor(res.data.doctor);
          setSlots(res.data.slots || []);
          setReviews(res.data.reviews || []);
          setRating(res.data.rating);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDoctor();
  }, [id]);

  const confirmAppointment = async () => {
    if (!selectedSlot) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/medical/appointment-add`, { doctorId: doctor.doctorId, patientId, slotId: selectedSlot }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message);
        setshowDoctorDetail(null);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to book appointment");

    } finally {
      setLoading(false);
    }
  };

  if (loading) { return (<div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"><Loading /></div>); }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-xl p-6">

        <button onClick={() => setshowDoctorDetail(null)} className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-red-500">
          <RxCross1 size={20} />
        </button>

        <div className="flex gap-5 items-center">
          <img src={doctor?.image || "/doctor.png"} className="w-24 h-24 rounded-xl object-cover border" />

          <div>
            <h2 className="text-xl font-bold text-gray-800">Dr {doctor?.fullName}</h2>
            <p className="text-sky-600 font-medium">{doctor?.specialization}</p>
            <p className="text-sm text-gray-500">{doctor?.experience} years experience</p>

            {rating && (
              <div className="flex items-center gap-2 mt-1">
                <FaStar className="text-yellow-500" />
                <span className="font-medium">
                  {Number(rating?.avgRating || 0).toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">
                  ({rating?.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="my-6 h-px bg-gray-200"></div>
        <div className="mb-4">
          <p className="text-gray-500 text-sm">Consultation Fee</p>
          <p className="text-lg font-semibold text-gray-800">₹{doctor?.fee}</p>
        </div>

        {doctor?.bio && (
          <div className="mb-6">
            <p className="text-gray-500 text-sm mb-1">About Doctor</p>
            <p className="text-gray-700 text-sm">{doctor.bio}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Available Slots</h3>

          {console.log(slots)
          }
          {slots.length === 0 ? (<p className="text-gray-500 text-sm">No slots available</p>) : (
            <div className="flex flex-wrap gap-3">
              {slots.map((slot) => (
                <button key={slot.id} disabled={slot.isBooked} onClick={() => setSelectedSlot(slot.id)} className={`p-3 rounded-xl border text-sm transition
                    ${slot.isBooked ? "bg-gray-200 text-gray-500" : (selectedSlot === slot.id && !isAdmin) ? "bg-sky-500 text-white border-sky-500" : "bg-sky-50 border-sky-200 hover:bg-sky-100"}`}>
                  {slot.date}
                  <br />
                  {slot.startTime} - {slot.endTime}
                </button>
              ))}
            </div>
          )}
        </div>

        {(!isAdmin && selectedSlot) && (
          <button onClick={confirmAppointment} className="w-full bg-linear-to-r from-sky-400 to-sky-500 text-white py-2 rounded-xl font-medium hover:shadow-lg transition">  Confirm Appointment</button>
        )}

        <div className="mt-8">

          <h3 className="font-semibold mb-3">Patient Reviews</h3>

          {reviews.length === 0 ? (<p className="text-gray-500 text-sm">    No reviews yet  </p>) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-sky-100 rounded-xl p-3 bg-white">

                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.patientName}</p>
                    <div className="flex items-center gap-1 text-yellow-500"><FaStar /> {review.rating}</div>
                  </div>

                  {review.reviewText && (<p className="text-sm text-gray-600 mt-1">{review.reviewText}</p>)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
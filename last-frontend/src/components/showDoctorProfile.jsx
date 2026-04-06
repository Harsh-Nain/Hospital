import axios from "axios";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import Loading from "../components/loading";
import toast from "react-hot-toast";
import PaymentCard from "../components/paymentcard"
import { FaClock, FaCalendarAlt, FaUsers, FaPlus, FaTimes, FaStar, FaMoneyBillWave, FaBriefcaseMedical } from "react-icons/fa";

export default function ShowDoctorProfile({ id, setshowDoctorDetail, patientId, isAdmin, }) {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmSlot, setConfirmSlot] = useState(null);
  const [pay, setPay] = useState(null);
  const [activeTab, setActiveTab] = useState("About");

  const [addReview, setAddReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [mainRating, setMainRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (!reviewText.trim()) {
      toast.error("Review text is required");
      return
    } else if (reviewText.trim().length < 20) {
      toast.error("Review should be at least 20 characters")
      return
    }

    try {
      setReviewLoading(true);
      const res = await axios.post(`${API_URL}/feed/review`, { doctorId: doctor.doctorId, rating, reviewText }, { withCredentials: true });

      if (res.data.success) {
        console.log(res.data);

        setReviews(r => [res.data.review, ...r]);
        setReviewLoading(false);
        setRating(0);
        setReviewText("");
        setAddReview(false);
      }
    } catch (error) {
      setReviewLoading(false);
      console.log(error);
      toast.error(error.data.message)
    }
  };

  const deleteReview = async (id) => {
    try {
      setReviewLoading(true);
      const res = await axios.delete(`${API_URL}/feed/review?reviewId=${id}`, { withCredentials: true });

      if (res.data.success) {
        setReviewLoading(false);
        setReviews(prevReviews => prevReviews.filter(r => r.id !== id));
      }
    } catch (error) {
      setReviewLoading(false);
      console.log(error);
      toast.error(error.data.message)
    }
  }

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
        setLoading(true)
        const res = await axios.get(`${API_URL}/profile/doctor?doctorId=${id}`, { withCredentials: true });

        if (res.data.success) {
          setDoctor(res.data.doctor);
          setReviews(res.data.reviews || []);
          setMainRating(res.data.rating);
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
    if (doctor?.status !== "suspanded") {
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
    <div className="fixed top-0 left-0 z-50 flex items-center w-full h-screen justify-center bg-black/50 backdrop-blur-sm p-4">
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

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor?.status === "suspanded" ? "bg-yellow-300 text-black" : "bg-emerald-300 text-black"}`}>
                {doctor?.status === "suspanded" ? "Suspended" : "Active"}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <FaStar className="text-yellow-300" />
              <span className="font-semibold">{mainRating?.avgRating || "0.0"}</span>
              <span className="text-sm opacity-80">({mainRating?.totalReviews || 0})</span>
            </div>

            {isAdmin && (
              <button onClick={profileControler} className={`px-4 py-2 rounded-xl bottom-2 right-17 absolute bg-linear-to-r ${doctor?.status == "approved" ? "from-orange-400 to-red-500" : "from-emerald-300 to-green-500"} text-white text-sm shadow hover:shadow-lg hover:scale-[1.03] transition`}>
                {doctor?.status == "approved" ? "Suspand Doctor" : "Re-activate Doctor"}
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[60vh] sm:h-[80vh]">
          <div className="sticky top-0 z-20 mb-8 rounded-3xl border border-white/60 bg-white/80 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className="flex gap-2 overflow-x-auto">
              {["About", "Slots", "Reviews"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`relative flex-1 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 ${activeTab === tab ? "bg-linear-to-r from-sky-500 via-sky-500 to-sky-500 text-white shadow-lg shadow-sky-200" : "text-gray-500 hover:bg-gray-100/80 hover:text-gray-800"}`}>
                  {activeTab === tab && (<span className="absolute inset-x-6 -bottom-1 h-1 rounded-full bg-white/70"></span>)}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "About" && (
            <div className="space-y-8 animate-in fade-in duration-500 sm:mb-7">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[{ label: "Consultation Fee", value: `₹${doctor?.fee}`, icon: <FaMoneyBillWave className="text-emerald-500 text-xl" />, bg: "from-emerald-50 to-white" }, { label: "Experience", value: `${doctor?.experience} yrs`, icon: <FaBriefcaseMedical className="text-sky-500 text-xl" />, bg: "from-sky-50 to-white" }, { label: "Patients", value: reviews.length, icon: <FaUsers className="text-violet-500 text-xl" />, bg: "from-violet-50 to-white" }
                ].map((item, i) => (
                  <div key={i} className={`group relative overflow-hidden rounded-[28px] border border-white/70 bg-linear-to-br ${item.bg} p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]`}>
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/40 blur-2xl" />

                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{item.label}</p>
                        <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{item.value}</p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {doctor?.bio && (
                <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-100 blur-3xl opacity-60" />
                  <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-violet-100 blur-3xl opacity-60" />

                  <div className="relative">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                      About Doctor
                    </div>

                    <p className="text-[15px] leading-8 text-gray-600">{doctor.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Slots" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">Available Slots</h3>
                  <p className="text-sm text-gray-500">Select a time that works best for you</p>
                </div>

                {confirmSlot && !isAdmin && (
                  <button onClick={confirmAppointment} className="rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    Confirm Appointment
                  </button>
                )}
              </div>

              {slots.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                  <p className="text-sm text-gray-400">No slots available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:mb-5">
                  {slots.map((slot) => {
                    const booked = slot.patientIds.includes(patientId);
                    const available = slot.capacity - slot.patientIds.length;

                    return (
                      <button key={slot.id} disabled={booked || isAdmin} onClick={() => { setSelectedSlot(slot.id); setConfirmSlot({ ...slot, ...doctor }); }} className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all duration-300 ${selectedSlot === slot.id ? "border-sky-300 bg-linear-to-br from-sky-500 to-blue-600 text-white shadow-[0_15px_40px_rgba(59,130,246,0.35)] scale-[1.02]" : booked ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" : "border-white/70 bg-white/80 shadow-[0_10px_35px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]"}`}>
                        {!booked && (<div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/20 blur-2xl" />)}

                        <div className="relative">
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <p className={`text-xs uppercase tracking-wider ${selectedSlot === slot.id ? "text-white/70" : "text-gray-400"}`}>  Appointment Time</p>
                              <h4 className={`mt-2 text-lg font-bold ${selectedSlot === slot.id ? "text-white" : "text-gray-900"}`}>  {slot.startTime} - {slot.endTime}</h4>
                            </div>

                            {booked && (<span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-semibold text-yellow-700">Requested</span>)}
                          </div>

                          <div className="mb-4 flex items-center gap-2">
                            <div className={`rounded-full px-3 py-1 text-xs font-medium ${selectedSlot === slot.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>  {slot.date}</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-xs ${selectedSlot === slot.id ? "text-white/70" : "text-gray-400"}`}>  Availability</p>
                              <p className={`mt-1 text-sm font-semibold ${available <= 1 ? "text-red-400" : selectedSlot === slot.id ? "text-white" : "text-emerald-600"}`}>  {available > 0 ? `${available} slots left` : "Fully booked"}</p>
                            </div>

                            <div className={`rounded-2xl px-3 py-2 text-center ${selectedSlot === slot.id ? "bg-white/15 text-white" : "bg-gray-50 text-gray-600"}`}>
                              <p className="text-xs">Booked</p>
                              <p className="font-bold">{slot.patientIds.length}/{slot.capacity}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {addReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black/60 backdrop-blur-sm p-4">
                  <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                      <div>
                        <h2 className="text-2xl font-bold text-sky-600">Add Review</h2>
                        <p className="text-sm text-gray-500">Share your experience with others</p>
                      </div>

                      <button onClick={() => setAddReview(false)} className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                        <FaTimes size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-5 px-6">

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Rating</label>

                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)} className="transition hover:scale-110">
                              <FaStar className={`text-3xl ${star <= (hoveredStar || rating) ? "text-yellow-400" : "text-gray-300"}`} />
                            </button>
                          ))}
                        </div>

                        <div className="mt-2 text-sm text-gray-500">
                          {rating === 1 && "Poor"}
                          {rating === 2 && "Fair"}
                          {rating === 3 && "Good"}
                          {rating === 4 && "Very Good"}
                          {rating === 5 && "Excellent"}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Review Description</label>
                        <textarea rows={5} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tell people about your experience..." className={`w-full resize-none rounded-xl border border-black/25 px-4 py-3 text-sm outline-none transition focus:ring-2 ring-sky-600`} />

                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm text-gray-400">Minimum 20 characters required</p>
                          <span className={`text-xs ${reviewText.length > 250 ? "text-red-500" : "text-gray-400"}`}>{reviewText.length}/300</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 pb-6">
                        <button type="button" onClick={() => setAddReview(false)} className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100">Cancel</button>
                        <button type="submit" disabled={loading} className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70">{reviewLoading ? "Submitting..." : "Submit Review"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">Patient Reviews</h3>
                  <p className="text-sm text-gray-500">Honest feedback from patients </p>
                </div>

                {!isAdmin && <button onClick={() => setAddReview(true)} className="rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  Add Review
                </button>}
              </div>

              {reviews.length > 0 && (
                <div className="rounded-[30px] border border-yellow-100 bg-linear-to-br from-yellow-50 via-white to-orange-50 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Average Rating</p>
                      <div className="mt-2 flex items-end gap-2">
                        <h2 className="text-5xl font-bold text-gray-900">{mainRating?.avgRating}</h2>
                        <span className="mb-2 text-gray-400">/ 5</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`text-lg ${i < Math.round(mainRating?.avgRating) ? "text-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Based on {reviews.length} reviews</p>
                    </div>
                  </div>
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                  <p className="text-sm text-gray-400">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-5 sm:mb-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-100 blur-3xl opacity-50" />

                      <div className="relative flex gap-4">
                        <img src={review.patientImage || "/user.png"} alt={review.patientName} className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-md" />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900">{review.patientName}</h4>
                              <p className="mt-1 text-xs text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString("en-IN")}
                              </p>
                            </div>

                            {review.patientId == patientId && <button onClick={() => deleteReview(review.id)} className="rounded-xl border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-100">
                              {reviewLoading ? "Deleting..." : "Delete"}
                            </button>}
                          </div>

                          <div className="mt-3 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} />
                            ))}

                            <span className="ml-2 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700">
                              {review.rating}.0 Rating
                            </span>
                          </div>

                          {review.reviewText && (
                            <div className="sm:mt-4 rounded-2xl bg-gray-50/80 p-2">
                              <p className="text-sm leading-7 text-gray-600">“{review.reviewText}”</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
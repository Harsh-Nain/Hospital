import { Bell, User, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ShowDoctorProfile from "./showDoctorProfile";

export default function Navbar({ patientInfo }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showDoctorDetail, setshowDoctorDetail] = useState(null);

  const searchRef = useRef();
  const dropdownRef = useRef();

  const modals = [showDoctorDetail];
  const isAnyModalOpen = modals.some(Boolean);

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }

    return () => { document.body.classList.remove("overflow-hidden"); };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/feed/notifications`, { withCredentials: true, });

        if (res.data.success) {
          setNotifications(res.data.notifications);
        }

      } catch (error) {
        console.error(error);
      }
    };
    getNotifications();
  }, [API_URL]);

  useEffect(() => {
    const handleClickOutside = (event) => {

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchDoctor = async () => {
      if (!search.trim()) {
        setDoctors([]);
        return;
      }

      try {
        setSearching(true)
        const res = await axios.get(`${API_URL}/profile/doctor-search?symptom=${search}`);

        if (res.data.success) {
          setDoctors(res.data.doctors);
          setShowResults(true);
          setSearching(false)
        }
        setSearching(false)
      } catch (error) {
        console.error(error);
      }
    };

    const delay = setTimeout(searchDoctor, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const readNotification = async (notificationId) => {
    try {
      await axios.put(`${API_URL}/feed/notification?notificationId=${notificationId}`, { withCredentials: true });
      setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const res = await axios.delete(`${API_URL}/feed/notification?notificationId=${notificationId}`, { withCredentials: true });

      if (res.data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3">
      {showDoctorDetail && (<ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} patientId={patientInfo.patientId} />)}

      <div className="flex-1 max-w-2xl" ref={searchRef}>
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

            <input type="text" placeholder="Search doctors, symptoms, specializations..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent pl-12 pr-12 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none" />

            {search && (
              <button onClick={() => { setSearch(""); setDoctors([]); setShowResults(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition">
                <X size={17} />
              </button>
            )}
          </div>

          {searching && (
            <div className="absolute top-18 left-0 right-0 z-999 overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <div className="p-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700">Searching...</p>
              </div>

              <div className="max-h-105 overflow-y-auto animate-pulse">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-4 border-b border-slate-100"
                  >
                    {/* Doctor Image */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0"></div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      <div className="h-4 w-32 sm:w-40 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 w-20 sm:w-28 bg-slate-200 rounded"></div>
                    </div>

                    {/* Fee */}
                    <div className="text-right shrink-0">
                      <div className="h-4 w-12 sm:w-16 bg-slate-200 rounded mb-2 ml-auto"></div>
                      <div className="h-3 w-16 sm:w-20 bg-slate-200 rounded ml-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showResults && (
            <div className="absolute top-18 left-0 right-0 z-999 overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <div className="p-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700">Search Results</p>
              </div>

              {doctors.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No doctors found...</p>
                </div>
              ) : (
                <div className="max-h-105 overflow-y-auto">
                  {doctors.map((doc) => (
                    <div key={doc.doctorId} onClick={() => { setshowDoctorDetail(doc.doctorId); setShowResults(false); }} className="flex items-center gap-4 p-4 border-b border-slate-100 hover:bg-sky-50/70 cursor-pointer transition-all duration-300">
                      <img src={doc.image} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">Dr. {doc.fullName}</p>
                        <p className="text-xs text-sky-600 truncate">{doc.specialization}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">₹{doc.consultationFee}</p>
                        <p className="text-xs text-slate-400">Consultation</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 relative" ref={dropdownRef}>

        <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-12 h-12 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl flex items-center justify-center text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all shadow-sm" >
          <Bell size={19} />

          {notifications.some((n) => !n.isRead) && (
            <>
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
            </>
          )}
        </button>

        {showNotifications && (
          <div className="absolute top-14 right-0 w-85 sm:w-95 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <p className="text-xs text-slate-500">Stay updated with recent activity</p>
              </div>

              <button onClick={() => notifications.forEach((n) => { if (!n.isRead) readNotification(n.id); })} className="text-xs font-medium text-sky-600 hover:text-sky-700">
                Mark all read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={30} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">No notifications yet</p>
              </div>
            ) : (
              <div className="max-h-100 overflow-y-auto p-3 space-y-2">
                {notifications.map((item) => (
                  <div key={item.id} className={`rounded-2xl border p-4 transition-all ${item.isRead ? "bg-slate-50 border-slate-100" : "bg-sky-50 border-sky-100"}`}>
                    <div className="flex justify-between gap-3">
                      <div className="flex-1 cursor-pointer" onClick={() => readNotification(item.id)}>
                        <div className="flex items-start gap-2">
                          {!item.isRead && (<span className="mt-2 w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>)}

                          <div>
                            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.message}</p>
                            <p className="text-[11px] text-slate-400 mt-2">{new Date(item.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <button onClick={() => deleteNotification(item.id)} className="text-slate-400 hover:text-red-500 transition">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={() => navigate("/patient-profile")} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl px-2.5 py-2 pr-4 hover:bg-slate-50 transition-all shadow-sm">
          <img src={patientInfo?.image || "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg"} alt="profile" className="w-9 h-9 rounded-xl object-cover border border-slate-200" />

          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-none">{patientInfo?.fullName || "Patient"} </p>
            <p className="text-xs text-slate-500 mt-1"> View Profile </p>
          </div>
        </button>
      </div>
    </div>
  );
}
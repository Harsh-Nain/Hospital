import { Bell, User, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import ShowDoctorProfile from "./showDoctorProfile";
import toast from "react-hot-toast";

export default function Navbar(patientInfo, setPatientInfo) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
        const res = await axios.get(`${API_URL}/profile/doctor-search?symptom=${search}`);

        if (res.data.success) {
          setDoctors(res.data.doctors);
          setShowResults(true);
        }
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
    <div className="flex items-center justify-between bg-white border-b border-black/10 px-4 md:px-6 py-4">

      {showDoctorDetail && (<ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} patientId={patientInfo?.patientId} />)}

      <div className="flex-1 max-w-xl" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search doctors or symptoms..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-9 py-2.5 rounded-xl border-2 border-gray-100 outline-hidden text-sm shadow-sm focus:border-sky-500 focus:shadow-lg transition outline-none" />

          {search && (<button onClick={() => { setSearch(""); setDoctors([]); setShowResults(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><X size={17} /></button>)}

          {showResults && (
            <div className="absolute top-12 w-full bg-white border-black/10 rounded-xl shadow-lg z-40 max-h-96 overflow-y-auto">
              {doctors.length === 0 ? (<p className="text-sm text-center p-3">No result found...</p>) : (

                doctors.map((doc) => (
                  <div key={doc.doctorId} onClick={() => setshowDoctorDetail(doc.doctorId)} className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer">
                    <img src={doc.image} className="w-10 h-10 rounded-lg" />

                    <div className="flex-1">
                      <p className="text-sm font-semibold">Dr {doc.fullName}</p>
                      <p className="text-xs text-sky-600">{doc.specialization}</p>
                    </div>

                    <span className="text-xs">₹{doc.consultationFee}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4 relative" ref={dropdownRef}>

        <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="text-sky-600" size={20} />
          {notifications.some((n) => !n.isRead) && (<span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>)}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 bg-white border rounded-xl shadow-lg p-3 z-50">

            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <button onClick={() => notifications.forEach((n) => { if (!n.isRead) readNotification(n.id); })} className="text-xs text-blue-500 hover:underline">Mark all read</button>
            </div>

            {notifications.length === 0 ? (<p className="text-sm text-gray-500">No notifications</p>) : (
              <div className="max-h-64 overflow-y-auto space-y-2">

                {notifications.map((item) => (
                  <div key={item.id} className={`p-3 rounded-lg ${item.isRead ? "bg-white" : "bg-blue-50"}`}>
                    <div className="flex justify-between gap-2">

                      <div className="flex-1 cursor-pointer" onClick={() => readNotification(item.id)}>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                      </div>

                      <button onClick={() => deleteNotification(item.id)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        )}

        <button onClick={() => navigate("/patient-profile")} className="p-2 hover:bg-gray-100 rounded-lg">
          <User size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
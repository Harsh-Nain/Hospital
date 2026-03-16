import { Bell, User, Search, X, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ShowDoctorProfile from "./showDoctorProfile";

export default function Navbar() {

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

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/feed/notifications`, { withCredentials: true });

        if (res.data.success) {
          setNotifications(res.data.notifications);
        } else {
          navigate("/patient/login");
        }

      } catch (error) {
        console.error(error);
      }
    };
    getNotifications();

  }, [API_URL, navigate]);

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

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      {showDoctorDetail && (<ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} />)}

      <div className="flex items-center gap-3 flex-1 max-w-xl" ref={searchRef}>

        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search doctors or symptoms..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-sky-400 outline-none" />

          {search && (<button onClick={() => { setSearch(""); setDoctors([]); setShowResults(false); }} className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><X size={17} /></button>)}

          {showResults && doctors.length > 0 && (
            <div className="absolute left-0 top-12 w-full bg-white/90 p-3 border border-gray-200 rounded-xl shadow-lg z-40 max-h-96 overflow-y-auto">

              {doctors.map((doc) => (
                <div key={doc.doctorId} onClick={() => setshowDoctorDetail(doc.doctorId)} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded bg-white cursor-pointer transition">
                  <img src={doc.image} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">Dr {doc.fullName}</p>
                    <p className="text-xs text-sky-600">{doc.specialization}</p>
                    <p className="text-xs text-gray-500">{doc.experienceYears} Years Experience</p>
                  </div>
                  <span className="text-xs text-gray-500">₹{doc.consultationFee}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4 relative" ref={dropdownRef}>

        <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell size={20} className="text-sky-600" />
          {notifications.length > 0 && (<span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>)}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50">
            <h3 className="text-sm font-semibold mb-2">Notifications</h3>

            {notifications.length === 0 ? (<p className="text-gray-500 text-sm">No notifications</p>) : (
              <div className="max-h-64 overflow-y-auto">

                {notifications.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg hover:bg-gray-100 transition">
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <button onClick={() => navigate("/profile")} className="p-2 rounded-lg hover:bg-gray-100">
          <User size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
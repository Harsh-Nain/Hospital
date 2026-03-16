import { Bell, User, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchDoctor = async () => {
      if (!search) {
        setDoctors([]);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/profile/doctor-search?symptom=${search}`);
        console.log(res.data);

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
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">

      <div className="flex items-center gap-3 flex-1 max-w-xl">

        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search symptoms or doctors..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />        </div>

      </div>
      {showResults && doctors.length > 0 && (
        <div className="absolute top-18 left-0 grid grid-cols-1 w-full bg-black/80 h-screen p-5 sm:grid-cols-2 xl:grid-cols-3 gap-20 lg:gap-8 overflow-y-auto overflow-x-hidden">
          {doctors.map((doc, i) => (
            <div key={i} onClick={() => setshowDoctorDetail(doc.doctorId)} className="group relative h-fit bg-white/80 backdrop-blur-xl border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 overflow-hidden">

              <div className="absolute inset-0 opacity-100 transition bg-linear-to-r from-sky-200/20 via-blue-200/20 to-transparent"></div>
              <div className="flex items-center gap-4 relative z-10">
                <img src={doc.image } className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-sky-100 shadow-sm" />

                <div>
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Dr {doc.fullName}</h3>
                  <p className="text-sky-600 text-sm font-medium">{doc.specialization}</p>
                  <span className="inline-block mt-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Available Today</span>
                </div>
              </div>
              <div className="my-4 h-px bg-linear-to-r from-transparent via-sky-200 to-transparent"></div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Experience</span>
                  <br />
                  {doc.experienceYears} yrs
                </p>
                <p>
                  <span className="font-medium text-gray-700">Fee</span>
                  <br />
                  ₹{doc.consultationFee}
                </p>
              </div>

              <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-100">
                <p className="text-xs text-gray-500">Next Available Slot</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {doc.date}</p>
                <p className="text-xs text-gray-500">{doc.startTime} – {doc.endTime}</p>
              </div>

              <button onClick={() => setshowDoctorDetail(doc.doctorId)} className="mt-5 w-full bg-linear-to-r from-sky-400 to-blue-500 text-white py-2.5 rounded-xl font-medium shadow-sm hover:shadow-lg transition">View Details</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 ml-6 relative" ref={dropdownRef}>

        <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={20} className="text-sky-600" />
          {notifications.length > 0 && (<span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>)}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50">

            <h3 className="text-sm font-semibold mb-2">Notifications</h3>

            {notifications.length === 0 ? (<p className="text-gray-500 text-sm">No notifications</p>) : (
              <div className="max-h-64 overflow-y-auto">

                {notifications.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                    <p className="text-sm font-medium text-gray-800">  {item.title}</p>
                    <p className="text-xs text-gray-500">  {item.message}</p>
                    <p className="text-xs text-gray-400 mt-1">  {item.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={() => navigate("/profile")} className="p-2 rounded-lg hover:bg-gray-100 transition" >
          <User size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
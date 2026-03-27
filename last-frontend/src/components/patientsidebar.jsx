import axios from "axios";
import { Home, MessageSquare, FileText, User, LogOut } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { SiCompilerexplorer } from "react-icons/si";
import { useNavigate, useLocation } from "react-router-dom";

export default function PatientSidebar({ patientInfo, setPatientInfo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const menuItems = [
    { icon: Home, label: "Dashboard", path: `/dashboard-patient`, },
    { icon: MessageSquare, label: "Chat", path: "/patient-chats", },
    { icon: FileText, label: "Medical Records", path: "/reports", },
    { icon: SiCompilerexplorer, label: "Doctors", path: `/Patient-dr.suggession`, },
    { icon: User, label: "Profile", path: `/Patient-profile`, type: "profile", },
  ];

  useEffect(() => {
    const getPatient = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard/patient-info`, { withCredentials: true, });

        if (res.data.success) {
          setPatientInfo(res.data.patient);
        } else {
          navigate(`/patient/login`);
        }
      } catch (error) {
        console.error(error);
        navigate(`/patient/login`);
      }
    };

    getPatient();
  }, [API_URL, navigate]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_URL}/logout`, { withCredentials: true, });

      if (res.data.success) {
        navigate("/patient/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error!");
    }
  };

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
      <div>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-linear-to-br from-blue-500 to-indigo-500 text-white w-11 h-11 flex items-center justify-center rounded-xl font-bold shadow">PD</div>

          <div className="leading-tight">
            <h1 className="text-lg font-bold text-gray-800">Past Doctor</h1>
            <p className="text-xs text-gray-500">Patient Portal</p>
          </div>

        </div>

        {patientInfo && (
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-gray-50">
            <img src={patientInfo.image || "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg"} alt="profile" className="w-11 h-11 rounded-full object-cover" />

            <div>
              <p className="font-semibold text-gray-800">{patientInfo.fullName}</p>
              <p className="text-xs text-gray-500">{patientInfo.email}</p>
            </div>
          </div>
        )}

        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);

            return (
              <li key={item.path} onClick={() => navigate(item.path)} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition relative  ${active ? "bg-blue-50 text-sky-600 font-medium" : "hover:bg-gray-100 text-gray-600"}`}>
                {active && (<span className="absolute left-0 top-2 bottom-2 w-1 bg-sky-600 rounded-r"></span>)}
                {item.type === "profile" ? (<img src={patientInfo?.image || "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg"} alt="profile" className="w-5 h-5 rounded-full object-cover" />) : (<Icon size={18} />)}
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>

      <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 p-3 rounded-xl hover:bg-red-50 transition font-medium">
        <LogOut size={18} /> Logout
      </button>

    </div>
  );
}
import { ChartScatter, Contact, Info, InfoIcon, LayoutDashboard, LogOut, Stethoscope, Users, } from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";
import { MdDetails } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin_dashboard", activeColor: "from-sky-500 to-cyan-500 text-white shadow-sky-200", iconBg: "bg-sky-100 text-sky-500", },
    { icon: Stethoscope, label: "Doctors", path: "/admin_doctors", activeColor: "from-violet-400 to-indigo-400 text-white shadow-violet-200", iconBg: "bg-violet-100 text-violet-500", },
    { icon: Users, label: "Patients", path: "/admin_patients", activeColor: "from-emerald-400 to-teal-400 text-white shadow-emerald-200", iconBg: "bg-emerald-100 text-emerald-500", },
    { icon: ChartScatter, label: "Conversation", path: "/admin_chat", activeColor: "from-orange-400 to-amber-400 text-white shadow-orange-200", iconBg: "bg-orange-100 text-orange-500", },
    { icon: Contact, label: "Contact Details", path: "/admin_contact-details", activeColor: "from-rose-400 to-pink-500 text-white shadow-rose-200", iconBg: "bg-rose-100 text-rose-500", },
  ]

  return (
    <div className="w-72 h-screen bg-linear-to-b from-slate-50 via-white to-sky-50 border-r border-slate-200/80 px-5 py-6 flex flex-col justify-between shadow-[8px_0_30px_rgba(15,23,42,0.04)]">
      <div>

        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-sky-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sky-200">
              AD
            </div>

            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Admin Panel</h1>
            <p className="text-sm text-slate-500 font-medium">Healthcare System</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-3 mb-7 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-sky-100 rounded-full blur-2xl opacity-70"></div>

          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-sky-100">
              A
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate">Admin</p>
              <p className="text-xs text-slate-500 truncate">admin@gmail.com</p>
            </div>
          </div>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <li key={item.path} onClick={() => navigate(item.path)} className={`group relative flex items-center gap-4 px-4 py-2 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${active ? `bg-linear-to-r ${item.activeColor} shadow-lg` : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-800"}`}>
                {active && (
                  <>
                    <div className="absolute inset-0 bg-white/10"></div>
                    <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-white"></span>
                  </>
                )}

                <div className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-300 ${active ? "bg-white/20 text-white" : `${item.iconBg} group-hover:scale-105`}`}>
                  <Icon size={19} />
                </div>

                <span className="relative z-10 font-medium text-sm tracking-wide">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <button onClick={() => navigate('/')} className="group flex items-center gap-3 px-4 py-2 rounded-2xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm">
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-white group-hover:bg-red-400/30 transition">
          <LogOut size={18} />
        </div>

        <span className="font-medium text-sm">Logout</span>
      </button>
    </div>
  );
}
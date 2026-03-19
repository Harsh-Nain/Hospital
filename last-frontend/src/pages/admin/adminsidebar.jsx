import { LayoutDashboard, Stethoscope, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin_dashboard", bgactive: "from-sky-100 to-emerald-100 text-sky-600", text: "" },
    { icon: Stethoscope, label: "Doctors", path: "/admin_doctors", bgactive: "from-sky-100 to-white", hover: "group-hover:text-sky-500", text: "text-sky-500" },
    { icon: Users, label: "Patients", path: "/admin_patients", bgactive: "from-emerald-100 to-white", hover: "group-hover:text-emerald-500", text: "text-emerald-500" },
  ];

  return (
    <div className="w-72 h-screen bg-linear-to-b from-sky-50 via-white to-emerald-50 border-r border-gray-200 flex flex-col justify-between p-5">

      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-linear-to-br from-sky-500 to-emerald-500 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-bold shadow-lg">AD</div>

          <div>
            <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
            <p className="text-xs text-gray-500">Healthcare System</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8 p-3 rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="bg-linear-to-br from-sky-500 to-emerald-500 text-white w-11 h-11 flex items-center justify-center rounded-full font-bold shadow">AD</div>

          <div>
            <p className="font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">admin@gmail.com</p>
          </div>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (<li key={item.path} onClick={() => navigate(item.path)} className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl cursor-pointer transition-all duration-300 group ${active ? `bg-linear-to-r ${item.bgactive} font-medium` : "text-gray-600"}`}>
              <Icon size={20} className={`transition ${active ? `${item.text}` : `${item.hover}`}`} />
              <span className={`font-medium ${active && `${item.text}`} ${item.hover}`}>{item.label}</span>
            </li>);
          })}
        </ul>
      </div>
    </div>
  );
}
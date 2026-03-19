import { Link, useLocation } from "react-router-dom";
import { Home, Stethoscope, Users } from "lucide-react";

export default function AdminBottomNav() {
    const location = useLocation();

    const navItems = [
        { path: "/admin_dashboard", icon: Home, label: "Home" },
        { path: "/admin_doctors", icon: Stethoscope, label: "Doctors" },
        { path: "/admin_patients", icon: Users, label: "Patients" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">

            {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;

                return (
                    <Link key={item.path} to={item.path} className={`flex flex-col items-center transition-all duration-200 ${active ? "text-sky-600 scale-105" : "text-gray-600 hover:text-sky-600"}`}>
                        <Icon size={20} className={active ? "text-sky-600" : ""} />
                        <span className="text-xs">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
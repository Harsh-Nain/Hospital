

import { MdKeyboardBackspace, MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DynamicLogin from "./dynamicLogin";
import { useState } from "react";
import { FaBolt, FaBroom, FaCar, FaCut, FaGavel, FaHome, FaLaptop, FaPaintRoller, FaTools, FaTruckMoving, FaUserMd, FaWrench } from "react-icons/fa";

export default function RoleSelection() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(null);

    const categories = [
        { title: "Doctors", description: "Book appointments and consult specialists easily.", icon: <FaUserMd className="text-sky-600 text-3xl" />, bg: "bg-sky-100 group-hover:bg-sky-200", button: "bg-sky-600 hover:bg-sky-700", ring: "group-hover:ring-sky-200", route: "patient", },
        { title: "Lawyers", description: "Connect with legal experts and get advice.", icon: <FaGavel className="text-purple-600 text-3xl" />, bg: "bg-purple-100 group-hover:bg-purple-200", button: "bg-purple-600 hover:bg-purple-700", ring: "group-hover:ring-purple-200", route: "lawyer", },
        { title: "Salons", description: "Book salon appointments and beauty services.", icon: <FaCut className="text-pink-600 text-3xl" />, bg: "bg-pink-100 group-hover:bg-pink-200", button: "bg-pink-600 hover:bg-pink-700", ring: "group-hover:ring-pink-200", route: "salon", },
        { title: "Plumbers", description: "Find expert plumbers for repair and installation.", icon: <FaTools className="text-orange-600 text-3xl" />, bg: "bg-orange-100 group-hover:bg-orange-200", button: "bg-orange-600 hover:bg-orange-700", ring: "group-hover:ring-orange-200", route: "plumber", },
        { title: "Mechanics", description: "Get vehicle repair and servicing support.", icon: <FaWrench className="text-red-600 text-3xl" />, bg: "bg-red-100 group-hover:bg-red-200", button: "bg-red-600 hover:bg-red-700", ring: "group-hover:ring-red-200", route: "mechanic", },
        { title: "Electricians", description: "Hire electricians for home and office work.", icon: <FaBolt className="text-yellow-500 text-3xl" />, bg: "bg-yellow-100 group-hover:bg-yellow-200", button: "bg-yellow-500 hover:bg-yellow-600", ring: "group-hover:ring-yellow-200", route: "electrician", },
        { title: "Painters", description: "Professional wall and home painting services.", icon: <FaPaintRoller className="text-indigo-600 text-3xl" />, bg: "bg-indigo-100 group-hover:bg-indigo-200", button: "bg-indigo-600 hover:bg-indigo-700", ring: "group-hover:ring-indigo-200", route: "painter", },
        { title: "Car Services", description: "Book car wash, servicing, and repairs.", icon: <FaCar className="text-cyan-600 text-3xl" />, bg: "bg-cyan-100 group-hover:bg-cyan-200", button: "bg-cyan-600 hover:bg-cyan-700", ring: "group-hover:ring-cyan-200", route: "carService", },
        { title: "Home Cleaning", description: "Find trusted cleaning professionals easily.", icon: <FaBroom className="text-green-600 text-3xl" />, bg: "bg-green-100 group-hover:bg-green-200", button: "bg-green-600 hover:bg-green-700", ring: "group-hover:ring-green-200", route: "cleaning", },
        { title: "Packers & Movers", description: "Move your home or office without hassle.", icon: <FaTruckMoving className="text-teal-600 text-3xl" />, bg: "bg-teal-100 group-hover:bg-teal-200", button: "bg-teal-600 hover:bg-teal-700", ring: "group-hover:ring-teal-200", route: "movers", },
        { title: "Home Repairs", description: "General maintenance and repair services.", icon: <FaHome className="text-amber-600 text-3xl" />, bg: "bg-amber-100 group-hover:bg-amber-200", button: "bg-amber-600 hover:bg-amber-700", ring: "group-hover:ring-amber-200", route: "homeRepair", },
        { title: "Laptop Repair", description: "Repair laptops, PCs, and tech devices.", icon: <FaLaptop className="text-violet-600 text-3xl" />, bg: "bg-violet-100 group-hover:bg-violet-200", button: "bg-violet-600 hover:bg-violet-700", ring: "group-hover:ring-violet-200", route: "techRepair", },
    ];

    return (
        <div className="h-screen bg-linear-to-br from-sky-50 via-white to-emerald-50 px-4 py-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200/30 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-200/30 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />

            {showLogin && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center w-full">
                    <DynamicLogin type={showLogin} setType={setShowLogin} />
                </div>
            )}

            <button onClick={() => navigate("/")} className="absolute top-5 left-5 z-40 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-md hover:bg-white transition-all text-gray-700">
                <MdKeyboardBackspace size={20} />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-center min-h-screen">
                <div className="text-center mb-10 mt-14">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Choose Your Category</h1>
                    <p className="mt-3 text-gray-500 text-base md:text-lg">Select the service category you want to continue with</p>
                </div>

                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-6 min-w-max px-2">
                        {categories.map((item, index) => (
                            <div key={index} onClick={() => setShowLogin(item.route)} className={`group cursor-pointer bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ring-1 ring-transparent ${item.ring} flex flex-col justify-between h-80 w-70 shrink-0`}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${item.bg}`}>
                                    {item.icon}
                                </div>

                                <div className="mt-6 flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h2>
                                    <p className="text-sm text-gray-500 leading-6">{item.description}</p>
                                </div>

                                <button type="button" className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition-all duration-300 ${item.button}`}>
                                    Continue
                                    <MdArrowForward className="text-lg group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
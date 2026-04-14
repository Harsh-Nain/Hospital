import { FaUserMd, FaGavel, FaCut, FaTools, } from "react-icons/fa";
import { MdKeyboardBackspace, MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router";
import DynamicLogin from "./dynamicLogin";
import { useState } from "react";

export default function RoleSelection() {
    const navigate = useNavigate();
    const [ShowLogin, setShowLogin] = useState()

    const categories = [
        { title: "Doctors", description: "Book appointments and consult specialists easily.", icon: <FaUserMd className="text-sky-600 text-3xl" />, bg: "bg-sky-100 group-hover:bg-sky-200", button: "bg-sky-600 hover:bg-sky-700", ring: "group-hover:ring-sky-200", route: "patient", },
        { title: "Lawyers", description: "Connect with legal experts and get advice.", icon: <FaGavel className="text-purple-600 text-3xl" />, bg: "bg-purple-100 group-hover:bg-purple-200", button: "bg-purple-600 hover:bg-purple-700", ring: "group-hover:ring-purple-200", route: "lawyer", },
        { title: "Salons", description: "Book salon appointments and beauty services.", icon: <FaCut className="text-pink-600 text-3xl" />, bg: "bg-pink-100 group-hover:bg-pink-200", button: "bg-pink-600 hover:bg-pink-700", ring: "group-hover:ring-pink-200", route: "salon", },
        { title: "Services", description: "Find plumbers, electricians, and more.", icon: <FaTools className="text-orange-600 text-3xl" />, bg: "bg-orange-100 group-hover:bg-orange-200", button: "bg-orange-600 hover:bg-orange-700", ring: "group-hover:ring-orange-200", route: "client", },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-emerald-50 px-4 py-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200/30 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-200/30 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />

            {ShowLogin && (<div className="fixed inset-0 z-999 bg-black/55"><DynamicLogin type={ShowLogin} setType={setShowLogin} /></div>)}
            <button onClick={() => navigate("/")} className="absolute top-5 left-5 z-40 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-md hover:bg-white transition-all text-gray-700">                <MdKeyboardBackspace size={20} />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-center min-h-screen mt-10 sm:mt-0">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Choose Your Category</h1>
                    <p className="mt-3 text-gray-500 text-base md:text-lg">Select the service category you want to continue with</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {categories.map((item, index) => (
                        <div key={index} onClick={() => setShowLogin(item.route)} className={`group cursor-pointer bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ring-1 ring-transparent ${item.ring} flex flex-col justify-between min-h-70`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${item.bg}`}>
                                {item.icon}
                            </div>

                            <div className="mt-6 flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h2>
                                <p className="text-sm text-gray-500 leading-6">{item.description}</p>
                            </div>

                            <button className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition-all duration-300 ${item.button}`}>
                                Continue
                                <MdArrowForward className="text-lg group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
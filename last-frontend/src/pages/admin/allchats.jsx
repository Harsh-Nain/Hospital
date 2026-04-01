import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminChatDoc from "../../components/adminChatDoc";
import Adminshowchat from "../../components/adminshowchat";
import { FiChevronRight, FiSearch } from "react-icons/fi";

export default function Allchat() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [Doctorlist, setDoctorlist] = useState([]);
    const [DoctorChatlist, setDoctorChatlist] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const location = useLocation().pathname.startsWith("/patient");

    useEffect(() => {
        const getAllDoctors = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/admin/admin_chatlist`);
                if (data.success) {
                    setDoctorlist(data.Doctorlist);

                }
            } catch (error) {
                console.log(error);
            }
        };
        getAllDoctors();
    }, [API_URL]);

    const filteredDoctors = Doctorlist.filter(
        (doctor) => doctor.name.toLowerCase().includes(search.toLowerCase())
    );

    const onSelectUser = async (user) => {
        setShowChat(true);
        setSelectedUser(user);
        try {
            const { data } = await axios.get(`${API_URL}/admin/admin_chatuser?id=${user.id}`);
            if (data.success) setDoctorChatlist(data.users);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {showChat ? (
                <AdminChatDoc
                    users={DoctorChatlist}
                    currentUser={selectedUser}
                    goback={() => setShowChat(false)}
                />
            ) : (
                <div className="p-6 bg-slate-50 h-full  w-full">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Communication Hub</h1>
                        <p className="text-slate-500 mt-1">Monitor and manage conversations between doctors and patients.</p>
                    </div>

                    <div className="relative max-w-xl mb-10">
                        <input
                            type="text"
                            placeholder="Search by doctor name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        />
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                onClick={() => onSelectUser(doctor)}
                                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden"
                            >

                                <div className="flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <img
                                            src={doctor.image || "/default-avatar.png"}
                                            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-blue-50 transition-all"
                                            alt={doctor.name}
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800">Dr. {doctor.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{doctor.email || ""}</p>

                                    <div className="mt-6 w-[90%] flex items-center gap-3 group">
                                        <button className="flex-1 flex items-center justify-center gap-2 
                                        bg-gradient-to-r from-sky-400 to-blue-500 text-sm text-white py-2.5 px-4 rounded-xl font-medium 
                                        shadow-sm hover:shadow-md hover:from-sky-500 hover:to-blue-600 active:scale-[0.98] transition-all duration-200" >
                                            View Details
                                            <FiChevronRight className="text-white opacity-80 group-hover:translate-x-1 transition-transform duration-200" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
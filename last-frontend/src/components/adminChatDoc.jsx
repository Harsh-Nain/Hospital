import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Adminshowchat from "./adminshowchat";
import { FiArrowLeft } from "react-icons/fi";

export default function AdminChatDoc({ users = [], currentUser, goback }) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChatPage, setShowChatPage] = useState(false);
  const location = useLocation().pathname.startsWith("/patient");

  const normalizedUsers = useMemo(() => {
    return users.map((u) => ({
      id: u.id || u.userId,
      fullName: u.fullName || u.name || "User",
      image: u.image || "https://via.placeholder.com/40",
      lastMessage: u.lastMessage || "Start chatting...",
      updatedAt: u.updatedAt || u.createdAt,
      online: u.online || false,
      appointmentId: u.appointmentId,
      role: u.role || u.specialization || "",
    }));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return normalizedUsers.filter((u) => u.fullName.toLowerCase().includes(query));
  }, [search, normalizedUsers]);

  const formatTime = (time) => {
    if (!time) return "";
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSelectUser = (user) => {
    setShowChatPage(true);
    setSelectedUser(user);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-full h-full  bg-white overflow-hidden">

        {/* --- Left Sidebar (User List) --- */}
        <div className={`flex flex-col w-full md:w-[45%] border-r border-gray-200 bg-gray-50/50 
          ${showChatPage ? 'hidden md:flex' : 'flex'}`} >

          <div className="md:p-5 p-3 flex justify-between items-center bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => goback(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h2 className="font-bold text-xl text-gray-800 tracking-tight">Messages</h2>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {currentUser?.name || "Staff"}
                </p>
              </div>
            </div>
          </div>

          <div className="md:p-4 p-2 bg-white">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-4 pr-4 py-2.5 bg-gray-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isActive = selectedUser?.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`flex items-center justify-between md:px-4 px-2 md:py-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200 
                   ${isActive
                        ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md shadow-blue-200'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                      }`}
                  >

                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={u.image}
                          className={`w-12 h-12 rounded-full object-cover border-2 ${isActive ? 'border-blue-400' : 'border-transparent'}`}
                          alt=""
                        />
                        {u.online && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className={`font-semibold text-sm truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {location && "Dr. "}{u.fullName}
                        </p>
                        <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-gray-500'} `}>
                          {u.lastMessage ? u.lastMessage.split(' ').slice(0, 3).join(' ') + (u.lastMessage.split(' ').length > 3 ? '...' : '') : "No messages yet"}
                        </p>
                        {u.role && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block uppercase font-bold
                        ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            {u.role}
                          </span>
                        )}
                      </div>

                    </div>

                    <div className="flex flex-col items-end gap-1 ml-2">
                      <span className={`text-[10px] whitespace-nowrap ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                        {formatTime(u.updatedAt)}
                      </span>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                <p className="text-sm italic">No users found</p>
              </div>
            )}
          </div>

        </div>

        {/* --- Right Side (Chat Area) --- */}
        <div
          className={`flex-1 bg-white 
          ${!showChatPage ? 'hidden md:flex flex-col items-center justify-center' : 'flex flex-col'}`}
        >
          {showChatPage ? (
            <Adminshowchat
              selectedUser={selectedUser}
              currentUser={currentUser}
              onBack={() => setShowChatPage(false)}
            />
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FiArrowLeft className="text-gray-400 rotate-180" size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-800">Your Inbox</h3>
                <p className="text-sm text-gray-500">Select a conversation from the left to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
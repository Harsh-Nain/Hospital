import { FaUserMd, FaClock, FaCalendarAlt, FaUsers } from "react-icons/fa";

export default function PatientDoctorCard({ doc, i, setshowDoctorDetail }) {
    const slot = doc.slots?.[0] || {};
    const capacity = slot.capacity || 0;
    const booked = slot.bookedCount || 0;
    const available = capacity - booked;

    const getStatus = () => {
        if (available <= 0)
            return { text: "Full", color: "bg-red-500/10 text-red-500" };
        if (available === 1)
            return { text: "Few Left", color: "bg-yellow-500/10 text-yellow-600" };
        return { text: "Available", color: "bg-emerald-500/10 text-emerald-600" };
    };

    const status = getStatus();
    const percent = capacity ? (booked / capacity) * 100 : 0;

    return (
        <div onClick={() => setshowDoctorDetail(doc.doctorId)} className="group w-full cursor-pointer rounded-2xl p-px bg-linear-to-br from-sky-300 via-blue-400 to-indigo-400 hover:shadow-xl transition-all duration-300 active:scale-[0.97]">
            <div className="bg-white rounded-2xl p-4 h-full flex flex-col justify-between">

                <div className="flex items-center gap-4">
                    <img src={doc.image} alt="doctor" className="w-14 h-14 rounded-xl object-cover border shadow-sm" />

                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FaUserMd className="text-sky-500" />
                            Dr. {doc.fullName}
                        </h3>

                        <p className="text-sky-600 text-sm">{doc.specialization}</p>
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.text}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                    <div className="flex flex-col items-center bg-sky-50 rounded-lg p-2">
                        <FaUserMd className="text-sky-500 mb-1" />
                        <span className="text-xs text-gray-500">Exp</span>
                        <span className="font-semibold">{doc.experienceYears}y</span>
                    </div>

                    <div className="flex flex-col items-center bg-sky-50 rounded-lg p-2">
                        <FaUsers className="text-indigo-500 mb-1" />
                        <span className="text-xs text-gray-500">Booked</span>
                        <span className="font-semibold">{booked}</span>
                    </div>

                    <div className="flex flex-col items-center bg-sky-50 rounded-lg p-2">
                        <FaUsers className="text-emerald-500 mb-1" />
                        <span className="text-xs text-gray-500">Left</span>
                        <span className="font-semibold">{available}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Slot Fill</span>
                        <span>{Math.round(percent)}%</span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className={`h-full ${percent > 80 ? "bg-red-400" : percent > 50 ? "bg-yellow-400" : "bg-emerald-400"}`} />
                    </div>
                </div>

                <div className="mt-4 p-3 bg-sky-50 rounded-lg border">
                    <p className="text-xs text-gray-500 mb-1">Next Slot</p>

                    {slot.date ? (
                        <>
                            <p className="flex items-center gap-2 text-sm">
                                <FaCalendarAlt className="text-sky-500" />
                                {slot.date}
                            </p>

                            <p className="flex items-center gap-2 text-xs text-gray-500">
                                <FaClock className="text-indigo-500" />
                                {slot.startTime} – {slot.endTime}
                            </p>
                        </>
                    ) : (
                        <p className="text-xs text-gray-400">No slot available</p>
                    )}
                </div>

                <button onClick={(e) => { e.stopPropagation(); setshowDoctorDetail(doc.doctorId); }} className="mt-4 w-full bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500 text-white py-2 rounded-lg font-medium">
                    View Details
                </button>
            </div>
        </div>
    );
}
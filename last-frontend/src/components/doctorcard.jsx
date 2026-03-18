export default function Doctorcard({ doc, i, setshowDoctorDetail }) {
    return (
        <div key={i} onClick={() => setshowDoctorDetail(doc.doctorId)} className="group cursor-pointer relative bg-white border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear-to-r from-sky-100/40 to-blue-100/40"></div>

            <div className="flex items-center gap-4 relative z-10">
                <img src={doc.image} alt="doctor" className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-sky-200" />

                <div>
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Dr. {doc.fullName}</h3>
                    <p className="text-sky-600 text-sm font-medium">{doc.specialization}</p>
                    <span className="inline-block mt-1 text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">Available Today</span>
                </div>
            </div>

            <div className="my-4 h-px bg-linear-to-r from-transparent via-sky-200 to-transparent"></div>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <p><span className="font-medium text-gray-700">Experience</span><br />{doc.experienceYears || 0} yrs</p>
                <p><span className="font-medium text-gray-700">Fee</span><br />₹{doc.consultationFee || "N/A"}</p>
            </div>

            <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-100">
                <p className="text-xs text-gray-500">Next Available Slot</p>
                {doc.date ? (
                    <>  <p className="font-semibold text-gray-800 text-sm">{doc.date}</p>
                        <p className="text-xs text-gray-500">
                            {doc.startTime} – {doc.endTime}
                        </p>
                    </>
                ) : (<p className="text-xs text-gray-400">No slot available</p>)}
            </div>

            <button onClick={(e) => { e.stopPropagation(); setshowDoctorDetail(doc.doctorId); }} className="mt-5 w-full bg-linear-to-r from-sky-400 to-blue-500 text-white py-2.5 rounded-xl font-medium shadow-sm hover:shadow-lg transition">
                View Details
            </button>
        </div>
    );
}
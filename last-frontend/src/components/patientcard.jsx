export default function PatientCard({ pat, i, setshowPatientDetail }) {
    console.log(pat);

    return (
        <div key={i} onClick={() => setshowPatientDetail(pat.patientId)} className="group relative bg-white border border-emerald-100 rounded-2xl p-5 shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 opacity-0 hover:opacity-100 cursor-pointer transition bg-linear-to-r from-emerald-100/40 to-green-100/40"></div>

            <div className="flex items-center gap-4 relative z-10">
                <img src={pat.image} alt="patient" className="w-14 h-14 rounded-xl object-cover border border-emerald-200" />

                <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{pat.fullName}</h3>
                    <p className="text-emerald-600 text-sm">{pat.email}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${pat.appointmentStatus === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-emerald-100 text-emerald-600"}`}>{pat.appointmentStatus}</span>
                </div>
            </div>

            <div className="my-4 h-px bg-linear-to-r from-transparent via-emerald-200 to-transparent"></div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <p><span className="font-medium text-gray-700">Gender</span><br />{pat.gender || "N/A"}</p>
                <p><span className="font-medium text-gray-700">Disease</span><br />{pat.disease || "N/A"}</p>
                <p><span className="font-medium text-gray-700">Age</span><br />{pat.age || "N/A"}</p>
                <p><span className="font-medium text-gray-700">Phone</span><br />{pat.phone || "N/A"}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <button onClick={(e) => { e.stopPropagation(); setshowPatientDetail(pat.patientId); }} className="bg-linear-to-r from-emerald-400 to-green-500 text-white px-4 py-2 rounded-lg text-sm transition">
                    View Details
                </button>

                <span className="text-xs text-gray-400">
                    ID: {pat.patientId}
                </span>
            </div>
        </div >
    );
}
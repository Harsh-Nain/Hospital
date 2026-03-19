import React from "react";

export default function DoctorCard({ doc, onView }) {
    return (
        <div
            onClick={() => onView(doc.doctorId)}
            className="group relative bg-white/80 backdrop-blur-xl border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
        >
            <div className="absolute inset-0 opacity-100 transition bg-linear-to-r from-sky-200/20 via-blue-200/20 to-transparent"></div>

            {/* Top Section */}
            <div className="flex items-center gap-4 relative z-10">
                <img
                    src={doc.image || "https://i.pravatar.cc/150"}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-sky-100 shadow-sm"
                    alt="doctor"
                />

                <div>
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                        Dr {doc.fullName}
                    </h3>
                    <p className="text-sky-600 text-sm font-medium">
                        {doc.specialization}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                        Available Today
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-linear-to-r from-transparent via-sky-200 to-transparent"></div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>
                    <span className="font-medium text-gray-700">Experience</span>
                    <br />
                    {doc.experienceYears} yrs
                </p>
                <p>
                    <span className="font-medium text-gray-700">Fee</span>
                    <br />₹{doc.consultationFee}
                </p>
            </div>

            {/* Slot */}
            <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-100">
                <p className="text-xs text-gray-500">Next Available Slot</p>
                <p className="font-semibold text-gray-800 text-sm">{doc.date}</p>
                <p className="text-xs text-gray-500">
                    {doc.startTime} – {doc.endTime}
                </p>
            </div>

            {/* Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // prevent parent click
                    onView(doc.doctorId);
                }}
                className="mt-5 w-full bg-linear-to-r from-sky-400 to-blue-500 text-white py-2.5 rounded-xl font-medium shadow-sm hover:shadow-lg transition"
            >
                View Details
            </button>
        </div>
    );
}
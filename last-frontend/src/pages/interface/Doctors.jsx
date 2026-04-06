import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const doctors = [
  {
    doctorId: 1,
    fullName: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800",
    experienceYears: "5",
    consultationFee: "100"
  },
  {
    doctorId: 2,
    fullName: "Dr. Michael Lee",
    specialization: "Neurologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800",
    experienceYears: "8",
    consultationFee: "120"
  },
  {
    doctorId: 3,
    fullName: "Dr. Emily Davis",
    specialization: "Pediatrician",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800",
    experienceYears: "6",
    consultationFee: "90"
  },
  {
    doctorId: 4,
    fullName: "Dr. James Wilson",
    specialization: "Orthopedic",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800",
    experienceYears: "10",
    consultationFee: "150"
  },
  {
    doctorId: 5,
    fullName: "Dr. Olivia Brown",
    specialization: "Dermatologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800",
    experienceYears: "7",
    consultationFee: "110"
  },
  {
    doctorId: 6,
    fullName: "Dr. David Miller",
    specialization: "General Physician",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800",
    experienceYears: "12",
    consultationFee: "95"
  },
];

export default function Doctors() {

  const [doctor, setdocter] = useState([])
  const [PageLoading, setPageLoading] = useState(false)
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setPageLoading(true);

        const res = await axios.get(`${API_URL}/admin/webdata`, { withCredentials: true });

        if (res.data.success) {
          setdocter(res.data.doctorsList)
        }


      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (

    <div className="bg-gray-50">

      <Nav />

      <section className="bg-gradient-to-br from-white via-emerald-50 to-green-100 py-16 px-6 sm:px-10 lg:px-16">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Meet Our Expert Doctors
          </h2>
          <p className="text-gray-600 mt-3">
            Our team of highly qualified professionals is here to provide the best
            healthcare services for you and your family.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {!PageLoading ?
            (
              (doctor?.length ? doctor : doctors).slice(0, 10).map((doc) => (
                <div
                  key={doc.doctorId}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="overflow-hidden rounded-t-2xl">
                    <img
                      src={doc.image}
                      alt={doc.fullName}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-900">{doc.fullName}</h3>
                    <p className="text-emerald-600 text-sm mt-1">{doc.specialization}</p>
                    <div className="mt-2 text-gray-600 text-sm space-y-1">
                      <p><span className="font-medium">Experience:</span> {doc.experienceYears} yrs</p>
                      <p><span className="font-medium">Fee:</span> ${doc.consultationFee}</p>
                    </div>

                    {/* Button */}
                    <Link
                      to="/patient/login"
                      className="mt-5 inline-block w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))

            ) :
            (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white/80 border border-gray-100 rounded-2xl shadow-md p-6 flex flex-col items-center"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-300 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-6"></div>
                  <div className="h-10 bg-gray-300 rounded-xl w-full"></div>
                </div>
              ))
            )}


        </div>

      </section>

      <Footer />

    </div>
  );
}
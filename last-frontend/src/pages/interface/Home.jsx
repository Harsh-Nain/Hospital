import React, { useEffect, useState } from "react";
import { Phone, Calendar, Mail, UserCheck, FlaskConical } from "lucide-react";
import { data, Link } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import { HiVideoCamera } from "react-icons/hi";
import axios from "axios";




const doctors = [
  {
    doctorId: 1,
    fullName: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "sarah.johnson@example.com",
  },
  {
    doctorId: 2,
    fullName: "Dr. Michael Smith",
    specialty: "Neurologist",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "michael.smith@example.com",
  },
  {
    doctorId: 3,
    fullName: "Dr. Emily Davis",
    specialty: "Pediatrician",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    email: "emily.davis@example.com",
  },
];

const services = [
  {
    title: "Emergency Care",
    description: "24/7 emergency care with highly trained medical professionals.",
    icon: <Phone size={26} />,
    color: "from-red-500 to-red-400",
    link: "/contact"
  },
  {
    title: "Online Consultations",
    description: "Get personalized consultations with experienced doctors from the comfort of your home.",
    icon: <HiVideoCamera size={26} />,
    color: "from-indigo-500 to-indigo-400",
    link: "/about"
  },
  {
    title: "Qualified Doctors",
    description: "Expert doctors with years of experience providing personalized care.",
    icon: <UserCheck size={26} />,
    color: "from-emerald-500 to-green-400",
    link: "/doctor"
  },
];

const reviews = [
  {
    patientName: "John Smith",
    doctorName: "JS",
    date: "2026-02-15",
    reviewText: `"Excellent care and professional staff. Dr. Chen took the time to explain everything clearly and made me feel comfortable throughout the treatment."`,
    rating: 5,
  },
  {
    patientName: "Maria Garcia",
    doctorName: "MG",
    date: "2026-02-10",
    reviewText: `"The pediatric department is wonderful! Dr. Williams is amazing with children and very knowledgeable. Highly recommend this hospital."`,
    rating: 5,
  },
  {
    patientName: "Robert Johnson",
    doctorName: "RJ",
    date: "2026-02-05",
    reviewText: `"Had a great experience with the orthopedic department. Dr. Kim performed my knee surgery and the recovery has been excellent. Thank you!"`,
    rating: 5,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
};

export default function Home() {

  const [doctor, setdocter] = useState([])
  const [review, setreview] = useState([])
  const [patient, setpatient] = useState()
  const [PageLoading, setPageLoading] = useState(false)
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setPageLoading(true);

        const res = await axios.get(`${API_URL}/admin/webdata`, { withCredentials: true });

        if (res.data.success) {
          setreview(res.data.reviews)
          setdocter(res.data.doctorsList)
          setpatient(res.data.patients)
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

      <div>

        <section className="relative overflow-hidden px-6 sm:px-10 lg:px-16 py-16 bg-gradient-to-br from-emerald-50 via-white to-green-100">

          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300 opacity-20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-400 opacity-20 blur-3xl rounded-full"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">

            <div className="space-y-6 text-center md:text-left">

              <p className="text-emerald-600 font-semibold uppercase tracking-wide text-sm">
                Trusted Healthcare Service
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight">
                Your Health,{" "}
                <span className="text-emerald-600">Our Priority</span>
              </h1>

              <p className="text-gray-600 text-base sm:text-lg lg:text-xl">
                Experience world-class healthcare with expert doctors, modern
                facilities, and personalized care tailored just for you.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">

                <Link to="/patient/login" >
                  <button className="flex cursor-pointer items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-emerald-700 transition hover:scale-105">
                    <Calendar size={18} />  Book Appointment</button>
                </Link>

                <Link to="/contact">

                  <button className="flex cursor-pointer items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-600 transition hover:scale-105">
                    <Phone size={18} />   Contact </button>
                </Link>


              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">  {!PageLoading ? `${doctor?.length - 1 || 0}+` : "..."}</h3>
                  <p className="text-gray-500 text-sm">Doctors</p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900"> {!PageLoading ? `${patient - 1 || 0}+` : "..."}</h3>
                  <p className="text-gray-500 text-sm">Happy Patients</p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">24/7</h3>
                  <p className="text-gray-500 text-sm">Support</p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative flex justify-center">

              {/* Glow */}
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-green-300 rounded-full blur-2xl opacity-40"></div>

              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <img
                  src="https://images.unsplash.com/photo-1758691462126-2ee47c8bf9e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Doctor consultation"
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover rounded-3xl shadow-2xl transition duration-500 hover:scale-105"
                />

                {/* Glass effect */}
                <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm opacity-0 hover:opacity-10 transition duration-500"></div>
              </div>
            </div>

          </div>
        </section>

        <div className=" py-12 px-4 sm:px-6 md:px-16 bg-gradient-to-br from-emerald-50 via-white to-green-100">

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              Meet Our <span className="text-emerald-600">Doctors</span>
            </h1>
            <p className="text-gray-600 mt-3 text-sm sm:text-base">
              Experienced specialists dedicated to your health & care
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {!PageLoading ? (
              (doctor?.length ? doctor : doctors)
                .slice(0, 3)
                .map((doc) => (
                  <div
                    key={doc.doctorId}
                    className="group bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition duration-300 hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="relative">
                      <img
                        src={doc.image}
                        alt={doc.fullName}
                        loading="lazy"
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-emerald-100 group-hover:scale-105 transition"
                      />
                    </div>

                    <h2 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900">
                      {doc.fullName}
                    </h2>

                    <p className="text-emerald-600 text-sm font-medium mb-2">
                      {doc.specialization || doc.specialty}
                    </p>

                    <div className="text-gray-600 text-sm space-y-1">
                      <p className="flex items-center justify-center gap-2">
                        <Mail size={14} /> {doc.email}
                      </p>
                    </div>

                    <Link to="/patient/login" className="w-full">
                      <button className="mt-5 w-full cursor-pointer bg-emerald-600 text-white py-2.5 rounded-xl font-medium shadow hover:bg-emerald-700 transition">
                        Book Appointment
                      </button>
                    </Link>
                  </div>
                ))
            ) : (
              [...Array(3)].map((_, i) => (
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
        </div>

        {/* <div className="flex flex-col items-center  mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              Join Our Team of <span className="text-emerald-600">Doctors</span>
            </h1>
            <p className="text-gray-600 mt-3 text-sm sm:text-base md:text-lg">
              Become a part of our growing network of healthcare professionals and offer virtual consultations with patients.
            </p>
          </div>

          <div className=" w-full md:w-[60%] bg-gradient-to-br from-emerald-100 via-white to-emerald-200 border-2 border-dashed border-emerald-400 rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition duration-300 hover:shadow-emerald-400/60 hover:scale-102">

            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center bg-emerald-50 rounded-full text-emerald-700 text-4xl sm:text-5xl font-extrabold shadow-inner animate-pulse">
              +
            </div>

            <h2 className="mt-4 text-lg sm:text-2xl font-bold text-emerald-800">
             Join Our Doctor Community
            </h2>

            <p className="text-emerald-700 text-sm mt-2 sm:text-base">
              Create your profile, set your availability, and start consulting with patients from the comfort of your home.
            </p>

            <Link to="/doctor/register" className="w-full">
              <button className="mt-5 w-full cursor-pointer bg-emerald-700 text-white py-3 rounded-2xl font-semibold shadow-lg hover:bg-emerald-800 transition transform hover:-translate-y-1">
                Sign Up Now
              </button>
            </Link>
          </div>

        </div> */}

        <section className="relative py-16 px-4 sm:px-6 md:px-20 bg-gradient-to-br from-emerald-50 via-white to-green-100 overflow-hidden">

          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300 opacity-20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-400 opacity-20 blur-3xl rounded-full"></div>

          {/* Heading */}
          <div className="text-center relative z-10">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              Our <span className="text-emerald-600">Services</span>
            </h3>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto text-sm sm:text-base">
              We provide a wide range of healthcare services to ensure your well-being.
            </p>
          </div>

          {/* Cards */}
          <div className="relative z-10 mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-white/80 backdrop-blur-lg border border-gray-100 p-6 rounded-2xl shadow-md transition duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white mb-5 shadow-md group-hover:scale-110 transition`}
                >
                  {service.icon}
                </div>

                {/* Title */}
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {service.title}
                </h4>

                {/* Description */}
                <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>

                {/* Optional CTA */}
                <button className="mt-4 cursor-pointer text-emerald-600 font-medium text-sm hover:underline">

                  <Link to={service.link}>   Learn more →</Link>

                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="  bg-gradient-to-br from-emerald-50 via-white to-green-100 py-10 px-4">
          <div className="max-w-5xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              What Our Patients Say
            </h2>
            <p className="text-gray-500 mt-2">
              Real experiences from real patients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {!PageLoading ? (
              (review?.length ? review : reviews)
                .slice(0, 3)
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >
                    {/* Rating */}
                    <StarRating rating={item.rating} />

                    {/* Review Text */}
                    <p className="text-gray-600 mt-4 text-sm leading-relaxed line-clamp-4">
                      {item.reviewText}
                    </p>

                    {/* Doctor Name */}
                    <p className="text-xs text-blue-600 font-medium mt-3">
                      Reviewed for Dr. {item.doctorName}
                    </p>

                    {/* User Info */}
                    <div className="flex items-center mt-6">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                        {item.patientImage ? (
                          <img
                            src={item.patientImage}
                            alt={item.patientName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          item.patientName?.charAt(0)
                        )}
                      </div>

                      <div className="ml-3">
                        <h4 className="text-gray-800 font-semibold text-sm">
                          {item.patientName}
                        </h4>

                        <p className="text-xs text-gray-400">
                          {new Date(item.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>

                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>

                  <div className="h-3 bg-blue-100 rounded w-1/2 mb-6"></div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        <div className="  bg-gradient-to-br from-emerald- via-white to-green-100 p-4 md:py-10 ">
          <div className="max-w-full  text-center text-white bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-3xl py-10">

            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>

            <p className="mt-4 text-lg text-blue-100">
              Book an appointment with our expert doctors today
            </p>

            <div className="mt-8">
              <Link to="/patient/login">
                <button className="bg-gray-200 text-blue-600 cursor-pointer font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition duration-300">
                  Book Your Appointment

                </button>
              </Link>
            </div>

          </div>
        </div>


      </div>

      <Footer />



    </div>
  );
}
import { Star, Stethoscope, Clock3, ArrowRight, BadgeCheck, Sparkles, Search, } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";

const doctors = [
  { doctorId: 1, fullName: "Dr. Sarah Johnson", specialization: "Cardiologist", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800", experienceYears: "5", consultationFee: "100", },
  { doctorId: 2, fullName: "Dr. Michael Lee", specialization: "Neurologist", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800", experienceYears: "8", consultationFee: "120", },
  { doctorId: 3, fullName: "Dr. Emily Davis", specialization: "Pediatrician", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800", experienceYears: "6", consultationFee: "90", },
  { doctorId: 4, fullName: "Dr. James Wilson", specialization: "Orthopedic", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800", experienceYears: "10", consultationFee: "150", },
  { doctorId: 5, fullName: "Dr. Olivia Brown", specialization: "Dermatologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800", experienceYears: "7", consultationFee: "110", },
  { doctorId: 6, fullName: "Dr. David Miller", specialization: "General Physician", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800", experienceYears: "12", consultationFee: "95", },
];

export default function Doctors() {
  const { doctor = [] } = useOutletContext();
  const doctorsFromContext = doctor.length > 0 ? doctor : doctors;

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-sky-50 via-white to-emerald-50 py-24 px-6 sm:px-10 lg:px-16">
      <div className="absolute top-0 left-0 h-100 w-100 rounded-full bg-sky-200/30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-emerald-200/30 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-5 py-2 shadow-md backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span className="text-sm font-semibold text-sky-700">  Trusted Medical Specialists</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"> Meet Our Experienced Doctors</h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Consult with certified doctors across multiple specialties. Our
            experienced medical professionals are available to provide the best
            treatment and care for you and your family.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {doctorsFromContext.length > 0 ? (
            doctorsFromContext.slice(0, 9).map((doc) => (
              <div key={doc.doctorId} className="group relative overflow-hidden rounded-4xl border border-white/60 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                <div className="absolute top-5 left-5 z-20 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-md backdrop-blur-xl">
                  <BadgeCheck size={14} />
                  Verified Doctor
                </div>

                <div className="relative overflow-hidden">
                  <img src={doc.image} alt={doc.fullName} className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/10 to-transparent"></div>

                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/80"> Consultation Fee</p>
                      <h4 className="text-lg font-bold text-white"> ${doc.consultationFee} </h4>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-white">
                      <Star size={14} fill="currentColor" className="text-yellow-300" />
                      4.9
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center gap-2 text-sky-600">
                    <Stethoscope size={18} />
                    <span className="text-sm font-semibold">{doc.specialization}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{doc.fullName}</h3>
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-xs text-slate-500">Experience</p>
                      <h4 className="text-sm font-semibold text-slate-800"> {doc.experienceYears} Years</h4>
                    </div>
                    <div className="h-10 w-px bg-slate-200"></div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={18} className="text-emerald-500" />
                      <div>
                        <p className="text-xs text-slate-500">Availability</p>
                        <h4 className="text-sm font-semibold text-slate-800">Mon - Sat</h4>
                      </div>
                    </div>
                  </div>

                  <Link to="/patient/login" className="group/btn mt-6 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-sky-600 to-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    Book Appointment
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            [...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-4xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl">
                <div className="h-80 animate-pulse bg-slate-200"></div>
                <div className="p-6">
                  <div className="mb-4 h-4 w-28 animate-pulse rounded bg-slate-200"></div>
                  <div className="mb-4 h-7 w-3/4 animate-pulse rounded bg-slate-300"></div>
                  <div className="mb-6 h-20 animate-pulse rounded-2xl bg-slate-100"></div>
                  <div className="h-14 animate-pulse rounded-2xl bg-slate-200"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
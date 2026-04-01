
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "sarah.johnson@example.com",
    phone: "(123) 456-7890",
  },
  {
    id: 2,
    name: "Dr. Michael Smith",
    specialty: "Neurologist",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "michael.smith@example.com",
    phone: "(987) 654-3210",
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    specialty: "Pediatrician",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    email: "emily.davis@example.com",
    phone: "(555) 123-4567",
  },
];

export default function DoctorPage() {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Our Doctors</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-32 h-32 rounded-full mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-500 mb-2">{doctor.specialty}</p>
            <p className="text-gray-600 text-sm">{doctor.email}</p>
            <p className="text-gray-600 text-sm">{doctor.phone}</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
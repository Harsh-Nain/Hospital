import { useState, useEffect } from "react";
import { User, Phone, Stethoscope, Upload, LogOut, Mail, MapPin, Award, Clock3 } from "lucide-react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

export default function DoctorProfile() {
    const { setLoading } = useOutletContext();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const emptyProfile = { fullName: "", email: "", phone: "", age: "", gender: "", address: "", specialization: "", experienceYears: "", licenseNumber: "", consultationFee: "", bio: "", image: "" };

    const [profile, setProfile] = useState(emptyProfile);
    const [originalProfile, setOriginalProfile] = useState(emptyProfile);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${API_URL}/profile/own`, { withCredentials: true });
                console.log(res.data);

                if (res.data.success) {
                    setProfile(res.data.profile);
                    setOriginalProfile(res.data.profile);
                } else {
                    navigate("/doctor/login");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [API_URL, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setProfile((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const formData = new FormData();

            Object.keys(profile).forEach((key) => {
                if (key !== "image") {
                    formData.append(key, profile[key] || "");
                }
            });

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await axios.put(`${API_URL}/profile/edit`, formData, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message || "Profile Updated Successfully");
                setOriginalProfile(profile);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setImageFile(null);
    };

    const handleClear = () => {
        setProfile(emptyProfile);
        setImageFile(null);
    };

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${API_URL}/logout`, { withCredentials: true });

            if (res.data.success) {
                navigate("/doctor/login");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Server error!");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-emerald-50 p-4 sm:p-6 lg:p-8">

            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-4xl border border-white/60 shadow-xl p-6 h-fit xl:sticky xl:top-6">
                    <div className="relative flex flex-col items-center text-center">

                        <div className="relative">
                            <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-sky-400/20 to-emerald-400/20 blur-2xl"></div>
                            <img src={profile.image || "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg"} className="relative w-36 h-36 rounded-4xl object-cover border-4 border-white shadow-2xl" alt="profile" />

                            <label className="absolute bottom-0 right-0 w-12 h-12 rounded-2xl bg-linear-to-r from-sky-500 to-emerald-500 text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition">
                                <Upload size={18} />
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        <h1 className="mt-6 text-3xl font-bold text-slate-800">Dr. {profile.fullName || "Doctor Name"}</h1>
                        <p className="text-slate-500 mt-2 text-sm">{profile.email || "doctor@email.com"}</p>

                        <div className="flex flex-wrap justify-center gap-2 mt-5">
                            <span className="px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                                {profile.specialization || "Specialization"}
                            </span>

                            <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                {profile.experienceYears || 0} Years Exp
                            </span>

                            <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                ₹ {profile.consultationFee || 0}
                            </span>
                        </div>

                        <button onClick={handleLogout} className="mt-8 w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-5 py-3 rounded-2xl transition font-medium">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="space-y-6">

                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">

                        <div className="bg-white/80 backdrop-blur-xl rounded-4xl border border-white/60 shadow-xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                                    <User size={24} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800">Personal Information</h2>
                                    <p className="text-sm text-slate-500">Update your personal details</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <Input label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    <div className="rounded-3xl p-4">
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">Age</label>

                                        <div className="relative">
                                            <input type="number" name="age" value={profile.age} onChange={handleChange} placeholder="Enter age" className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-14 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition" />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">Years</span>
                                        </div>
                                    </div>

                                    <div className="rounded-3xl p-4">
                                        <label className="text-sm font-medium text-gray-600 mb-3 block">Gender</label>

                                        <div className="grid grid-cols-3 gap-3">
                                            {[{ label: "Male" }, { label: "Female" }, { label: "Other" },].map((item) => (
                                                <label key={item.label} className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-3 cursor-pointer transition-all duration-200 ${profile.gender === item.label ? "bg-linear-to-br from-sky-500 to-blue-500 text-white border-transparent shadow-lg scale-[1.02]" : "bg-white border-gray-200 text-gray-600 hover:bg-sky-50 hover:border-sky-200"}`}>
                                                    <input type="radio" name="gender" value={item.label} checked={profile.gender === item.label} onChange={handleChange} className="hidden" />
                                                    <span className="text-sm font-medium">{item.label}</span>

                                                    {profile.gender === item.label && (
                                                        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-white"></div>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-600 mb-2 block">Bio</label>

                                    <div className="rounded-3xl border border-slate-200 bg-white hover:border-sky-300 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 transition-all duration-300">
                                        <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Write about your experience, achievements, certifications and expertise..." className="w-full min-h-45 resize-none rounded-3xl bg-transparent px-5 py-4 outline-none text-slate-800 placeholder:text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl rounded-4xl border border-white/60 shadow-xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Phone size={24} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800">Contact Details</h2>
                                    <p className="text-sm text-slate-500">Keep your contact information updated</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <Input label="Email Address" name="email" value={profile.email} readOnly icon={<Mail size={16} />} />
                                <Input label="Phone Number" name="phone" type="number" value={profile.phone} onChange={handleChange} icon={<Phone size={16} />} />
                                <Input label="Address" name="address" value={profile.address} onChange={handleChange} icon={<MapPin size={16} />} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-4xl border border-white/60 shadow-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                                <Stethoscope size={24} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Professional Information</h2>
                                <p className="text-sm text-slate-500"> Showcase your professional credentials</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                            <Input label="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} icon={<Award size={16} />} />
                            <Input label="Experience" type="number" name="experienceYears" value={profile.experienceYears} onChange={handleChange} icon={<Clock3 size={16} />} />
                            <Input label="License Number" name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} icon={<Stethoscope size={16} />} />
                            <Input label="Consultation Fee" type="number" name="consultationFee" value={profile.consultationFee} onChange={handleChange} icon={<span className="text-sm font-semibold">₹</span>} />
                        </div>
                    </div>

                    <div className="sticky bottom-4 z-20 flex flex-wrap justify-end gap-3">
                        <button onClick={handleClear} className="px-5 py-3 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur hover:bg-slate-50 transition font-medium text-slate-600">
                            Clear All
                        </button>

                        <button onClick={handleCancel} className="px-5 py-3 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur hover:bg-slate-50 transition font-medium text-slate-600">
                            Undo Changes
                        </button>

                        <button onClick={handleSave} className="px-7 py-3 rounded-2xl bg-linear-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Input({ label, icon, readOnly = false, ...props }) {
    return (
        <div className="group">
            <label className="text-sm font-medium text-slate-600 mb-2 block">{label}</label>

            <div className={`flex items-center gap-3 rounded-2xl border transition-all duration-300 px-4 ${readOnly ? "border-slate-200 bg-slate-100" : "border-slate-200 bg-white hover:border-sky-300 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100"}`}>
                {icon && (<div className="text-slate-400">{icon}</div>)}
                <input {...props} readOnly={readOnly} className={`w-full bg-transparent py-3.5 outline-none text-slate-800 placeholder:text-slate-400 ${readOnly ? "cursor-not-allowed text-slate-500" : ""}`} />
            </div>
        </div>
    );
}
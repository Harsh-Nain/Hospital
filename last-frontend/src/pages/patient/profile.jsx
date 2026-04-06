import { useState, useEffect, useContext } from "react";
import { User, Phone, Heart, Upload, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

export default function PatientProfile() {

    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const emptyProfile = { fullName: "", age: "", gender: "", bio: "", email: "", phone: "", address: "", bloodGroup: "", allergy: "", image: "" };

    const [loading, setLoading] = useState(false);
    const { setShowLogoutConfirm } = useOutletContext()
    const [profile, setProfile] = useState(emptyProfile);
    const [originalProfile, setOriginalProfile] = useState(emptyProfile);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${API_URL}/profile/own`, { withCredentials: true });

                if (res.data.success) {
                    setLoading(false)
                    setProfile(res.data.profile);
                    setOriginalProfile(res.data.profile);
                } else {
                    setLoading(false)
                    navigate("/patient/login");
                }

            } catch (error) {
                console.error(error);
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
            setLoading(true)
            const formData = new FormData();
            Object.keys(profile).forEach((key) => { formData.append(key, profile[key]); });
            if (imageFile) { formData.append("image", imageFile); }

            const res = await axios.put(`${API_URL}/profile/edit`, formData, { withCredentials: true, });

            setLoading(false)
            if (res.data.success) {
                toast.success(res.data.message || "Profile Updated Successfully...");
                setOriginalProfile(profile);
            }

        } catch (error) {
            setLoading(false)
            console.error(error);
            toast.error("Something Want Wrong...");
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 animate-pulse">

                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1 bg-white rounded-3xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-28 h-28 rounded-3xl bg-gray-200"></div>

                        <div className="flex-1 w-full">
                            <div className="h-8 w-48 bg-gray-200 rounded mb-3"></div>
                            <div className="h-4 w-64 bg-gray-200 rounded mb-4"></div>

                            <div className="flex flex-wrap gap-2">
                                <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                                <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
                                <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>

                        <div className="h-12 w-32 bg-gray-200 rounded-2xl"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    <div className="bg-white rounded-3xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-gray-200"></div>
                            <div>
                                <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-52 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div className="h-14 bg-gray-200 rounded-2xl"></div>
                            <div className="h-14 bg-gray-200 rounded-2xl"></div>
                        </div>

                        <div className="flex gap-3 mb-5">
                            <div className="h-10 w-20 bg-gray-200 rounded-2xl"></div>
                            <div className="h-10 w-20 bg-gray-200 rounded-2xl"></div>
                            <div className="h-10 w-20 bg-gray-200 rounded-2xl"></div>
                        </div>

                        <div className="h-32 bg-gray-200 rounded-2xl"></div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-md p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-11 h-11 rounded-2xl bg-gray-200"></div>
                                <div>
                                    <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 w-52 bg-gray-200 rounded"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-14 bg-gray-200 rounded-2xl"></div>
                                <div className="h-14 bg-gray-200 rounded-2xl"></div>
                                <div className="h-14 bg-gray-200 rounded-2xl"></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-md p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-11 h-11 rounded-2xl bg-gray-200"></div>
                                <div>
                                    <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 w-52 bg-gray-200 rounded"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-14 bg-gray-200 rounded-2xl"></div>
                                <div className="h-14 bg-gray-200 rounded-2xl"></div>
                                <div className="h-14 bg-gray-200 rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <div className="h-12 w-24 bg-gray-200 rounded-2xl"></div>
                    <div className="h-12 w-24 bg-gray-200 rounded-2xl"></div>
                    <div className="h-12 w-36 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-4">

            <div className="fixed top-0 left-0 w-72 h-72 bg-sky-200/30 blur-3xl rounded-full pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full pointer-events-none"></div>

            <div className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-5 sm:p-6 lg:p-8 mb-8">
                <div className="absolute top-0 right-0 w-60 h-60 bg-sky-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="relative shrink-0">
                            <img src={profile.image || "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg"} className="w-28 h-28 sm:w-30 sm:h-30 rounded-4xl object-cover border-4 border-white shadow-xl" alt="profile" />

                            <label className="absolute -bottom-2 -right-2 bg-linear-to-r from-sky-500 to-cyan-500 hover:scale-105 text-white rounded-2xl p-3 shadow-lg cursor-pointer transition">
                                <Upload size={16} />
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">{profile.fullName || "Your Name"}</h1>
                            <p className="text-slate-500 mt-2">{profile.email || "your@email.com"}</p>

                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="px-4 py-2 rounded-full bg-sky-100 text-sky-600 text-xs font-semibold">{profile.gender || "Gender"}</span>
                                <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold">{profile.bloodGroup || "Blood Group"}</span>
                                <span className="px-4 py-2 rounded-full bg-red-100 text-red-500 text-xs font-semibold">{profile.disease || "No Disease"}</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium shadow-sm">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">

                <div className="space-y-6">
                    <div className="rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-5 sm:p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center"><User size={22} /></div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                                <p className="text-sm text-slate-500">Update your basic profile information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input label="Full Name" name="fullName" placeholder="Enter full name" value={profile.fullName} onChange={handleChange} />

                            <Input label="Age" name="age" type="number" placeholder="Enter age" value={profile.age} onChange={handleChange} />
                        </div>

                        <div className="mt-6">
                            <label className="text-sm font-semibold text-slate-600 block mb-3">Gender</label>

                            <div className="flex flex-wrap gap-3">
                                {["Male", "Female", "Other"].map((item) => (
                                    <label key={item} className={`px-5 py-3 rounded-2xl border text-sm font-medium cursor-pointer transition-all ${profile.gender === item ? "bg-linear-to-r from-sky-500 to-cyan-500 text-white border-transparent shadow-lg" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-sky-50"}`} >
                                        <input type="radio" hidden name="gender" value={item} checked={profile.gender === item} onChange={handleChange} />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="text-sm font-semibold text-slate-600 block mb-2">Bio</label>
                            <textarea name="bio" placeholder="Write something about yourself..." value={profile.bio} onChange={handleChange} className="w-full min-h-35 rounded-3xl border border-slate-200 bg-slate-50/70 px-5 py-4 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition resize-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-5 sm:p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center"><Heart size={22} /></div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Medical Profile</h2>
                                <p className="text-sm text-slate-500"> Your health information</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <Input label="Blood Group" name="bloodGroup" placeholder="Example: O+" value={profile.bloodGroup} onChange={handleChange} />
                            <Input label="Allergy" name="allergy" placeholder="Any allergies?" value={profile.allergy} onChange={handleChange} />
                            <Input label="Disease" name="disease" placeholder="Disease" value={profile.disease} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-5 sm:p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Phone size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Contact Details</h2>
                                <p className="text-sm text-slate-500">Keep your contact information updated</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <Input label="Email" name="email" readOnly placeholder="Enter email" value={profile.email} onChange={handleChange} />
                            <Input label="Phone" name="phone" type="number" placeholder="Enter phone number" value={profile.phone} onChange={handleChange} />
                            <Input label="Address" name="address" placeholder="Enter address" value={profile.address} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={handleClear} className="px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition">
                    Clear
                </button>

                <button onClick={handleCancel} className="px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition">
                    Cancel
                </button>

                <button onClick={handleSave} className="px-7 py-3 rounded-2xl bg-linear-to-r from-sky-500 via-cyan-500 to-blue-500 text-white font-semibold shadow-[0_10px_30px_rgba(14,165,233,0.35)] hover:scale-[1.02] hover:shadow-[0_14px_40px_rgba(14,165,233,0.45)] transition-all duration-300">
                    Save Profile
                </button>
            </div>
        </div>
    );

    function Input({ label, ...props }) {
        return (
            <div>
                <label className="text-sm font-semibold text-slate-600 mb-2 block">{label}</label>
                <input {...props} className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 outline-none text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition" />
            </div>
        );
    }
}
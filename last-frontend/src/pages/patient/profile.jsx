import { useState, useEffect } from "react";
import { User, Phone, Heart, Upload, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

export default function PatientProfile() {
    const { setLoading } = useOutletContext();

    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const emptyProfile = { fullName: "", age: "", gender: "", bio: "", email: "", phone: "", address: "", bloodGroup: "", allergy: "", image: "" };

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

    const handleLogout = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_URL}/logout`, { withCredentials: true, });

            if (res.data.success) {
                setLoading(false)
                navigate("/patient/login");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Server error!");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-blue-50 p-4 sm:p-6 lg:p-10">

            <div className="flex flex-col lg:flex-row gap-6 mb-8">

                <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">

                    <div className="relative">
                        <img src={profile.image || "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg"} className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg" alt="profile" />

                        <label className="absolute -bottom-2 -right-2 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl p-3 shadow-lg cursor-pointer transition">
                            <Upload size={16} />
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-800">{profile.fullName || "Your Name"}</h1>
                        <p className="text-gray-500 mt-1">{profile.email || "your@email.com"}</p>

                        <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-600 text-xs font-medium">{profile.gender || "Gender"}</span>
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-medium">{profile.bloodGroup || "Blood Group"}</span>
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-500 text-xs font-medium">{profile.disease || "No Disease"}</span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-2xl transition font-medium">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <div className="bg-white/80 backdrop-blur-xl h-fit rounded-3xl border border-white/40 shadow-md p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                            <p className="text-sm text-gray-500">Update your personal details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Full Name" name="fullName" placeholder="Enter full name" value={profile.fullName} onChange={handleChange} />
                        <Input label="Age" name="age" placeholder="Enter age" type="number" value={profile.age} onChange={handleChange} />
                    </div>

                    <div className="mt-5">
                        <label className="text-sm font-medium text-gray-600 mb-3 block">Gender</label>

                        <div className="flex flex-wrap gap-3">
                            {["Male", "Female", "Other"].map((item) => (
                                <label key={item} className={`px-4 py-2 rounded-2xl border cursor-pointer transition text-sm ${profile.gender === item ? "bg-sky-500 text-white border-sky-500 shadow" : "bg-white hover:bg-sky-50"}`}>
                                    <input type="radio" name="gender" value={item} checked={profile.gender === item} onChange={handleChange} className="hidden" />
                                    {item}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Bio</label>
                        <textarea name="bio" placeholder="Write something about yourself..." value={profile.bio} onChange={handleChange} className="w-full min-h-30 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-md p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center text-red-500">
                                <Heart size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Medical Profile</h2>
                                <p className="text-sm text-gray-500">Your health-related details</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input label="Blood Group" name="bloodGroup" placeholder="Example: O+" value={profile.bloodGroup} onChange={handleChange} />
                            <Input label="Allergy" name="allergy" placeholder="Any allergies?" value={profile.allergy} onChange={handleChange} />
                            <Input label="Disease" name="disease" placeholder="Disease" value={profile.disease} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-md p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>
                                <p className="text-sm text-gray-500">Keep your contact info updated</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input label="Email" name="email" placeholder="Enter email" readOnly value={profile.email} onChange={handleChange} />
                            <Input label="Phone" name="phone" placeholder="Enter phone number" type="number" value={profile.phone} onChange={handleChange} />
                            <Input label="Address" name="address" placeholder="Enter address" value={profile.address} onChange={handleChange} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
                <button onClick={handleClear} className="px-5 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition font-medium">
                    Clear
                </button>

                <button onClick={handleCancel} className="px-5 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition font-medium">
                    Cancel
                </button>

                <button onClick={handleSave} className="px-6 py-3 rounded-2xl bg-linear-to-r from-sky-400 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition">
                    Save Profile
                </button>
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">{label}</label>
            <input {...props} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition" />
        </div>
    );
}
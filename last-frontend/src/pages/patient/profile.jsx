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
        <div className="sm:p-8 bg-gray-50 p-4 min-h-screen">

            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            <div className="bg-white p-6 rounded-xl shadow mb-6 relative">
                <h2 className="font-semibold mb-4">Profile Picture</h2>

                <div className="flex items-center gap-5">
                    <img src={profile.image || "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg"} className="w-20 h-20 rounded-full object-cover" alt="profile" />

                    <label className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                        <Upload size={16} /> Upload
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </label>

                    <button onClick={handleLogout} className="flex sm:hidden items-center gap-2 absolute right-3 top-3 text-red-500 p-3 rounded-xl text-sm hover:bg-red-50 transition font-medium">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white sm:p-6 p-2 rounded-xl shadow mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <User size={18} />
                    <h2 className="font-semibold">Personal Information</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" name="fullName" placeholder="Enter full name" value={profile.fullName} onChange={handleChange} />
                    <Input label="Age" name="age" placeholder="Enter age" type="number" value={profile.age} onChange={handleChange} />
                </div>

                <div className="mt-4">
                    <label className="text-sm text-gray-600 mb-2 block">Gender</label>
                    <div className="flex gap-6">
                        <Radio label="Male" value="Male" checked={profile.gender === "Male"} onChange={handleChange} />
                        <Radio label="Female" value="Female" checked={profile.gender === "Female"} onChange={handleChange} />
                        <Radio label="Other" value="Other" checked={profile.gender === "Other"} onChange={handleChange} />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="text-sm text-gray-600">Bio</label>
                    <textarea name="bio" placeholder="Write something about yourself..." value={profile.bio} onChange={handleChange} className="w-full border outline-sky-600 rounded-lg p-3 mt-1" />
                </div>
            </div>

            <div className="bg-white sm:p-6 p-2 rounded-xl shadow mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Phone size={18} />
                    <h2 className="font-semibold">Contact Details</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Email" name="email" placeholder="Enter email" readOnly value={profile.email} onChange={handleChange} />
                    <Input label="Phone" name="phone" placeholder="Enter phone number" type="number" value={profile.phone} onChange={handleChange} />
                </div>

                <div className="mt-4">
                    <Input label="Address" name="address" placeholder="Enter address" value={profile.address} onChange={handleChange} />
                </div>
            </div>

            <div className="bg-white sm:p-6  p-2 rounded-xl shadow mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Heart size={18} />
                    <h2 className="font-semibold">Medical Profile</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Blood Group" name="bloodGroup" placeholder="Example: O+" value={profile.bloodGroup} onChange={handleChange} />
                    <Input label="Allergy" name="allergy" placeholder="Any allergies?" value={profile.allergy} onChange={handleChange} />
                    <Input label="disease" name="disease" placeholder="Disease" value={profile.disease} onChange={handleChange} />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button onClick={handleClear} className="px-5 py-2 border cursor-pointer rounded-lg">Clear</button>
                <button onClick={handleCancel} className="px-5 py-2 border cursor-pointer rounded-lg">Cancel </button>
                <button onClick={handleSave} className="px-5 py-2 bg-sky-500 hover:bg-sky-600 cursor-pointer text-white rounded-lg">Save Profile</button>
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <input {...props} className="w-full border outline-sky-600 rounded-lg p-2 mt-1" />
        </div>
    );
}

function Radio({ label, value, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" className="accent-sky-600" value={value} checked={checked} onChange={onChange} />
            {label}
        </label>
    );
}
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Phone, Stethoscope, LogOut, Mail, MapPin, Award, Clock3, ShieldCheck, BadgeCheck, Camera, Trash2, RotateCcw, Save, CheckCircle2, Sparkles, UploadIcon, } from "lucide-react";
const makeEmptyProfile = () => ({ fullName: "", email: "", phone: "", age: "", gender: "", address: "", specialization: "", experienceYears: "", licenseNumber: "", consultationFee: "", bio: "", image: "", });
const PROFILE_KEYS = ["fullName", "email", "phone", "age", "gender", "address", "specialization", "experienceYears", "licenseNumber", "consultationFee", "bio", "image",];

const normalizeProfile = (profile = {}) => {
    const base = makeEmptyProfile();
    PROFILE_KEYS.forEach((key) => { base[key] = profile?.[key] ?? ""; });
    return base;
};

export default function DoctorProfile() {
    const { setLoading, setShowLogoutConfirm } = useOutletContext();
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const emptyProfile = useMemo(() => makeEmptyProfile(), []);
    const [profile, setProfile] = useState(emptyProfile);
    const [originalProfile, setOriginalProfile] = useState(emptyProfile);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        let active = true;

        const fetchProfile = async () => {
            try {
                setLoadingProfile(true);
                const res = await axios.get(`${API_URL}/profile/own`, { withCredentials: true, });
                if (!active) return;

                if (res.data?.success) {
                    const loaded = normalizeProfile(res.data.profile);
                    setProfile(loaded);
                    setOriginalProfile(loaded);
                    setImagePreview(loaded.image || "");
                } else {
                    navigate("/doctor/login");
                }
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.message || "Failed to load profile");
            } finally {
                if (active) { setLoadingProfile(false); }
            }
        };
        fetchProfile();

        return () => { active = false; };
    }, [API_URL, navigate, setLoading]);

    useEffect(() => {
        return () => { if (imagePreview?.startsWith("blob:")) { URL.revokeObjectURL(imagePreview); } };
    }, [imagePreview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value, }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (imagePreview?.startsWith("blob:")) { URL.revokeObjectURL(imagePreview); }
        const previewUrl = URL.createObjectURL(file);
        setImageFile(file);
        setImagePreview(previewUrl);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setLoading(true);

            const formData = new FormData();
            PROFILE_KEYS.forEach((key) => { if (key !== "image") { formData.append(key, profile[key] ?? ""); } });
            if (imageFile) { formData.append("image", imageFile); }
            const res = await axios.put(`${API_URL}/profile/edit`, formData, { withCredentials: true, });

            if (res.data?.success) {
                toast.success(res.data.message || "Profile updated successfully");
                const updatedProfile = normalizeProfile(res.data.profile || { ...profile, image: imageFile ? imagePreview : originalProfile.image, });

                setProfile(updatedProfile);
                setOriginalProfile(updatedProfile);
                setImageFile(null);
                setImagePreview(updatedProfile.image || "");
            } else {
                toast.error(res.data?.message || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setSaving(false);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (imagePreview?.startsWith("blob:")) { URL.revokeObjectURL(imagePreview); }
        setProfile(originalProfile);
        setImageFile(null);
        setImagePreview(originalProfile.image || "");
    };

    const handleClear = () => {
        if (imagePreview?.startsWith("blob:")) { URL.revokeObjectURL(imagePreview); }
        setProfile(emptyProfile);
        setImageFile(null);
        setImagePreview("");
    };

    const hasChanges = useMemo(() => {
        const current = JSON.stringify({ ...profile, image: "", });
        const original = JSON.stringify({ ...originalProfile, image: "", });

        return current !== original || Boolean(imageFile);
    }, [profile, originalProfile, imageFile]);

    const completion = useMemo(() => {
        const fields = [profile.fullName, profile.phone, profile.age, profile.gender, profile.address, profile.specialization, profile.experienceYears, profile.licenseNumber, profile.consultationFee, profile.bio, profile.image || imagePreview,];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    }, [profile, imagePreview]);

    const displayImage = imagePreview || profile.image;

    function SkeletonBox({ className = "" }) {
        return (<div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />);
    }

    if (loadingProfile) {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-7xl px-3">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">

                        <aside className="h-fit self-start xl:sticky top-0">
                            <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-6">
                                <div className="flex flex-col items-center">
                                    <SkeletonBox className="h-32 w-32 rounded-[30px]" />

                                    <div className="mt-5 flex w-full flex-wrap justify-center gap-2">
                                        <SkeletonBox className="h-8 w-28 rounded-full" />
                                    </div>

                                    <div className="mt-6 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <SkeletonBox className="h-10 w-10 rounded-2xl" />
                                            <div className="flex-1 space-y-2">
                                                <SkeletonBox className="h-3 w-24" />
                                                <SkeletonBox className="h-4 w-32" />
                                            </div>
                                        </div>

                                        <SkeletonBox className="mt-3 h-4 w-40" />
                                    </div>

                                    <div className="mt-4 grid w-full gap-3">
                                        <SkeletonBox className="h-16 w-full rounded-2xl" />
                                    </div>

                                    <SkeletonBox className="mt-6 h-12 w-full rounded-2xl" />
                                </div>
                            </div>
                        </aside>

                        <main className="min-w-0">
                            <div className="mx-auto w-full max-w-5xl space-y-6">
                                <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-6">
                                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="space-y-3">
                                            <SkeletonBox className="h-3 w-24" />
                                        </div>

                                        <div className="flex gap-2">
                                            <SkeletonBox className="h-11 w-28 rounded-2xl" />
                                            <SkeletonBox className="h-11 w-32 rounded-2xl" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                        <div className="xl:col-span-2 rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
                                            <SkeletonBox className="mb-6 h-6 w-52" />
                                            <div className="space-y-5">
                                                <SkeletonBox className="h-14 w-full" />
                                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                    <SkeletonBox className="h-14 w-full" />
                                                </div>
                                                <SkeletonBox className="h-40 w-full rounded-3xl" />
                                            </div>
                                        </div>

                                        <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
                                            <SkeletonBox className="mb-6 h-6 w-44" />
                                            <div className="space-y-5">
                                                <SkeletonBox className="h-14 w-full" />
                                            </div>
                                        </div>

                                        <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
                                            <SkeletonBox className="mb-6 h-6 w-52" />
                                            <div className="space-y-5">
                                                <SkeletonBox className="h-14 w-full" />
                                                <SkeletonBox className="h-14 w-full" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen my-5 sm:mx-2">
            <div className="mx-auto max-w-7xl px-3">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                    <aside className="h-fit self-start xl:sticky">

                        <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-6">
                            <div className="relative flex flex-col items-center text-center">
                                <div className="absolute -top-12 h-28 w-28 rounded-full bg-sky-200/50 blur-3xl" />
                                <div className="absolute -bottom-12 h-28 w-28 rounded-full bg-emerald-200/50 blur-3xl" />

                                <div className="relative">
                                    <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-sky-400/25 to-emerald-400/25 blur-2xl" />
                                    <img src={displayImage} className="relative h-32 w-32 rounded-[30px] border-4 border-white object-cover shadow-2xl sm:h-36 sm:w-36" alt="Doctor profile" />

                                    <label className="absolute bottom-0 right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-linear-to-r from-sky-500 to-emerald-500 text-white shadow-lg transition hover:scale-105">
                                        <UploadIcon size={18} />
                                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>

                                <h1 className="mt-5 text-2xl font-bold text-slate-800 sm:text-3xl">Dr. {profile.fullName || "Doctor Name"}</h1>
                                <p className="mt-2 max-w-full truncate text-sm text-slate-500">{profile.email || "doctor@email.com"}</p>

                                <div className="mt-5 flex flex-wrap justify-center gap-2">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700">
                                        <BadgeCheck size={14} />
                                        {profile.specialization || "Specialization"}
                                    </span>

                                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                        <ShieldCheck size={14} />
                                        {profile.experienceYears || 0} Years Exp
                                    </span>

                                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                        ₹ {profile.consultationFee || 0}
                                    </span>
                                </div>

                                <div className="mt-6 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm"><Sparkles size={18} /></div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Profile Completion</p>
                                            <p className="text-sm font-semibold text-slate-700">{completion}% complete</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                                        <div className="h-full rounded-full bg-linear-to-r from-sky-500 to-emerald-500 transition-all duration-500" style={{ width: `${completion}%` }} />
                                    </div>
                                    <p className="mt-3 text-sm text-slate-500">{hasChanges ? "You have unsaved changes" : "Your profile is synced"}</p>
                                </div>

                                <div className="mt-4 grid w-full grid-cols-1 gap-3">
                                    <StatPill label="Status" value={hasChanges ? "Unsaved edits" : "Live profile"} icon={<CheckCircle2 size={16} />} tone={hasChanges ? "amber" : "emerald"} />
                                    <StatPill label="Identity" value={profile.licenseNumber || "No license added"} icon={<ShieldCheck size={16} />} tone="sky" />
                                    <StatPill label="Fee" value={`₹ ${profile.consultationFee || 0}`} icon={<Award size={16} />} tone="violet" />
                                </div>

                                <button onClick={() => setShowLogoutConfirm(true)} className="mt-6 cursor-pointer flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-medium text-red-600 transition hover:bg-red-100" ><LogOut size={18} /><span>Logout</span> </button>
                            </div>
                        </div>
                    </aside>

                    <main className="min-w-0">
                        <div className="mx-auto w-full max-w-5xl space-y-6">
                            <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl p-5 sm-2">
                                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between sm:p-3">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Doctor Profile</p>
                                        <h2 className="mt-1 text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">Update your professional information</h2>
                                        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                                            Keep everything current to improve trust, bookings, and
                                            the overall premium look of your doctor profile.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 lg:justify-end">
                                        <button onClick={handleClear} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"> <Trash2 size={16} /> Clear All</button>
                                        <button onClick={handleCancel} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"> <RotateCcw size={16} /> Undo Changes</button>
                                        <button onClick={handleSave} disabled={!hasChanges || saving} className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"> <Save size={16} /> {saving ? "Saving..." : "Save Changes"}</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                                    <Card title="Personal Information" description="Update your personal details" icon={<User size={22} />} iconClassName="bg-sky-100 text-sky-600" className="xl:col-span-2">
                                        <div className="space-y-5">
                                            <Field label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} placeholder="Enter your full name" />

                                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                <div className="min-w-0">
                                                    <label className="mb-2 block text-sm font-medium text-slate-600">Age</label>
                                                    <div className="relative">
                                                        <input type="number" name="age" value={profile.age} onChange={handleChange} placeholder="Enter age" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-14 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">Years</span>
                                                    </div>
                                                </div>

                                                <div className="min-w-0">
                                                    <label className="mb-2 block text-sm font-medium text-slate-600">Gender</label>

                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                                        {["Male", "Female", "Other"].map((item) => (
                                                            <label key={item} className={`relative flex h-12 cursor-pointer items-center justify-center rounded-2xl border text-sm font-semibold transition-all duration-200 sm:h-14 ${profile.gender === item ? "border-transparent bg-linear-to-r from-sky-500 to-blue-500 text-white shadow-lg" : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"}`} >
                                                                <input type="radio" name="gender" value={item} checked={profile.gender === item} onChange={handleChange} className="hidden" />
                                                                <span>{item}</span>
                                                                {profile.gender === item && (<div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-white" />)}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-600">Bio</label>
                                                <div className="rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:border-sky-300 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
                                                    <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Write about your experience, achievements, certifications and expertise..." className="min-h-40 w-full resize-none rounded-3xl bg-transparent px-5 py-4 text-slate-800 outline-none placeholder:text-slate-400 sm:min-h-44" />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card title="Contact Details" description="Keep your contact information updated" icon={<Phone size={22} />} iconClassName="bg-emerald-100 text-emerald-600" >
                                        <div className="space-y-5">
                                            <Field label="Email Address" name="email" value={profile.email} readOnly icon={<Mail size={16} />} placeholder="Email" />
                                            <Field label="Phone Number" name="phone" type="text" inputMode="numeric" value={profile.phone} onChange={handleChange} icon={<Phone size={16} />} placeholder="Enter phone number" />
                                            <Field label="Address" name="address" value={profile.address} onChange={handleChange} icon={<MapPin size={16} />} placeholder="Enter address" />
                                        </div>
                                    </Card>

                                    <Card title="Professional Information" description="Showcase your professional credentials" icon={<Stethoscope size={22} />} iconClassName="bg-violet-100 text-violet-600">
                                        <div className="grid grid-cols-1 gap-5">
                                            <Field label="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} icon={<Award size={16} />} placeholder="Cardiologist, Dentist..." />
                                            <Field label="Experience" type="number" name="experienceYears" value={profile.experienceYears} onChange={handleChange} icon={<Clock3 size={16} />} placeholder="Years of experience" />
                                            <Field label="License Number" name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} icon={<ShieldCheck size={16} />} placeholder="License number" />
                                            <Field label="Consultation Fee" type="number" name="consultationFee" value={profile.consultationFee} onChange={handleChange} icon={<span className="text-sm font-semibold">₹</span>} placeholder="Fee" />
                                        </div>
                                    </Card>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function Card({ title, description, icon, iconClassName, className = "", children, }) {
    return (
        <section className={`rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 ${className}`}>
            <div className="mb-5 flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}>{icon}</div>
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-800 sm:text-xl">{title}</h3>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

function StatPill({ label, value, icon, tone = "slate" }) {
    const toneMap = { sky: "bg-sky-50 text-sky-700 border-sky-100", emerald: "bg-emerald-50 text-emerald-700 border-emerald-100", amber: "bg-amber-50 text-amber-700 border-amber-100", violet: "bg-violet-50 text-violet-700 border-violet-100", slate: "bg-slate-50 text-slate-700 border-slate-100", };

    return (
        <div className={`rounded-2xl border p-3 ${toneMap[tone]}`}>
            <div className="flex items-center gap-2">
                <div className="shrink-0">{icon}</div>
                <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] opacity-70">{label}</p>
                    <p className="truncate text-sm font-semibold">{value}</p>
                </div>
            </div>
        </div>
    );
}

function Field({ label, icon, readOnly = false, className = "", inputClassName = "", ...props }) {
    return (
        <div className="group min-w-0">
            <label className="mb-2 block text-sm font-medium text-slate-600">{label}</label>
            <div className={`flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border px-4 transition-all duration-300 ${readOnly ? "border-slate-200 bg-slate-100" : "border-slate-200 bg-white hover:border-sky-300 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100"} ${className}`}>
                {icon && <div className="shrink-0 text-slate-400">{icon}</div>}
                <input {...props} readOnly={readOnly} className={`w-full min-w-0 bg-transparent py-3.5 text-slate-800 outline-none placeholder:text-slate-400 ${readOnly ? "cursor-not-allowed text-slate-500" : ""} ${inputClassName}`} />
            </div>
        </div>
    );
}

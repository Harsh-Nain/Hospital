import db from "../db/index.js";
import { users, patients, doctors, doctorSlots, reviews, specializations, medicalReports } from "../db/schema.js";
import { eq, and, desc, avg, count } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const GetDoctorProfile = async (req, res) => {
    try {
        const { doctorId } = req.query;

        if (!doctorId) {
            return res.json({ success: false, message: "Doctor ID required", });
        }

        const [doctor] = await db
            .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, specialization: specializations.name, experience: doctors.experienceYears, fee: doctors.consultationFee, bio: doctors.bio, })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(eq(doctors.id, Number(doctorId)))
            .limit(1);

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found", });
        }

        const slots = await db.select().from(doctorSlots).where(and(eq(doctorSlots.doctorId, Number(doctorId)), eq(doctorSlots.isBooked, false)));

        const doctorReviews = await db
            .select({ id: reviews.id, rating: reviews.rating, reviewText: reviews.reviewText, createdAt: reviews.createdAt, patientName: users.fullName, image: users.image, })
            .from(reviews)
            .leftJoin(patients, eq(patients.id, reviews.patientId))
            .leftJoin(users, eq(users.id, patients.userId))
            .where(eq(reviews.doctorId, Number(doctorId)))
            .orderBy(desc(reviews.createdAt));

        const [ratingSummary] = await db.select({ avgRating: avg(reviews.rating), totalReviews: count(reviews.id), }).from(reviews).where(eq(reviews.doctorId, Number(doctorId)));

        res.json({ success: true, doctor, slots, reviews: doctorReviews, rating: ratingSummary, });

    } catch (error) {
        console.error("GetDoctorProfile Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const GetPatientProfile = async (req, res) => {
    try {
        let { patientId } = req.query;

        const [patient] = await db
            .select({ patientId: patients.id, fullName: users.fullName, email: users.email, image: users.image, age: patients.age, gender: patients.gender, disease: patients.disease, phone: patients.phone, })
            .from(patients)
            .leftJoin(users, eq(users.id, patients.userId))
            .where(eq(patients.id, patientId))
            .limit(1);

        const reports = await db
            .select({ reportId: medicalReports.id, diseaseName: medicalReports.diseaseName, fileUrl: medicalReports.fileUrl, uploadedAt: medicalReports.uploadedAt, })
            .from(medicalReports)
            .where(eq(medicalReports.patientId, patient.patientId));

        if (!patient) {
            return res.json({ success: false, message: "Patient not found" });
        }

        res.json({ success: true, patient, medicalReports: reports });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const GetOwnProfile = async (req, res) => {
    try {
        const { id, role } = req.user;

        if (role === "patient") {
            const [patient] = await db
                .select({ ...patients, id: users.id, fullName: users.fullName, email: users.email, image: users.image })
                .from(users)
                .leftJoin(patients, eq(patients.userId, users.id))
                .where(and(eq(users.id, id), eq(users.role, "patient")))
                .limit(1);

            return res.json({ success: true, profile: patient });
        }

        if (role === "doctor") {
            const [doctor] = await db
                .select({ id: users.id, fullName: users.fullName, email: users.email, image: users.image, specialization: specializations.name, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, licenseNumber: doctors.licenseNumber, phone: doctors.phone, age: doctors.age, gender: doctors.gender, address: doctors.address, })
                .from(users)
                .leftJoin(doctors, eq(doctors.userId, users.id))
                .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
                .where(and(eq(users.id, id), eq(users.role, "doctor")))
                .limit(1);

            return res.json({ success: true, profile: doctor });
        }

        res.json({ success: false, message: "Invalid role" });

    } catch (error) {
        console.error("GetOwnProfile Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const EditOwnProfile = async (req, res) => {
    try {
        const { id, role } = req.user;
        const data = req.body;

        const clean = (v) => v === "null" || v === "" || v === undefined ? null : v;

        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        }

        await db.update(users).set({ ...(data.fullName && { fullName: data.fullName }), ...(imageUrl && { image: imageUrl }), }).where(eq(users.id, id));

        if (role === "patient") {
            await db
                .update(patients)
                .set({ ...(data.age !== undefined && { age: clean(data.age) }), ...(data.gender !== undefined && { gender: clean(data.gender) }), ...(data.disease !== undefined && { disease: clean(data.disease) }), ...(data.phone !== undefined && { phone: clean(data.phone) }), ...(data.bio !== undefined && { bio: clean(data.bio) }), ...(data.address !== undefined && { address: clean(data.address) }), ...(data.bloodGroup !== undefined && { bloodGroup: clean(data.bloodGroup), }), ...(data.allergy !== undefined && { allergy: clean(data.allergy) }), })
                .where(eq(patients.userId, id));
        }

        if (role === "doctor") {
            await db.update(doctors)
                .set({ ...(data.age !== undefined && { age: clean(data.age) }), ...(data.gender !== undefined && { gender: clean(data.gender) }), ...(data.experienceYears !== undefined && { experienceYears: clean(data.experienceYears), }), ...(data.consultationFee !== undefined && { consultationFee: clean(data.consultationFee), ...(data.phone !== undefined && { phone: clean(data.phone) }), ...(data.bio !== undefined && { bio: clean(data.bio) }), ...(data.address !== undefined && { address: clean(data.address) }), }), ...(data.bio !== undefined && { bio: clean(data.bio) }), })
                .where(eq(doctors.userId, id));
        }

        res.json({ success: true, message: "Profile updated successfully", });

    } catch (error) {
        console.error("EditOwnProfile Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { email, role, password } = req.body;
        console.log(email, role, password);


        const hashedPassword = await bcrypt.hash(password, 10);

        await db
            .update(users)
            .set({ password: hashedPassword })
            .where(and(eq(users.email, email), eq(users.role, role)));

        res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("UpdatePassword Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
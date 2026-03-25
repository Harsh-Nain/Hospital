import db from "../db/index.js";
import { users, patients, doctors, doctorSlots, reviews, specializations, medicalReports, appointments } from "../db/schema.js";
import { eq, sql, or, and, gt, desc, } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const GetDoctorProfile = async (req, res) => {
    try {
        const { doctorId } = req.query;

        if (!doctorId) {
            return res.json({
                success: false,
                message: "Doctor ID required",
            });
        }

        const [doctor] = await db
            .select({ doctorId: doctors.id, userId: users.id, email: users.email, fullName: users.fullName, image: users.image, status: doctors.status, specialization: specializations.name, experience: doctors.experienceYears, fee: doctors.consultationFee, bio: doctors.bio, })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(eq(doctors.id, Number(doctorId)))
            .limit(1);

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found", });
        }

        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().slice(0, 5);

        const slotsRaw = await db
            .select({ id: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, capacity: doctorSlots.capacity, bookedCount: sql`COUNT(${appointments.id})`, patientIds: sql`GROUP_CONCAT(${appointments.patientId})`, })
            .from(doctorSlots)
            .leftJoin(appointments, eq(appointments.slotId, doctorSlots.id))
            .where(and(eq(doctorSlots.doctorId, Number(doctorId)), eq(doctorSlots.isCancelled, false), or(gt(doctorSlots.date, today), and(eq(doctorSlots.date, today), gt(doctorSlots.startTime, currentTime)))))
            .groupBy(doctorSlots.id)
            .orderBy(doctorSlots.date, doctorSlots.startTime);

        const formatTime = (time) => {
            if (!time) return "";
            const [h, m] = time.split(":");
            return `${h.padStart(2, "0")}:${m}`;
        };

        const grouped = {};
        const slots = [];

        slotsRaw.forEach((slot) => {
            const booked = Number(slot.bookedCount || 0);
            const remaining = Math.max(0, slot.capacity - booked);

            const patientIds = slot.patientIds ? slot.patientIds.split(",").map((id) => Number(id)) : [];
            const slotObj = { id: slot.id, date: slot.date, startTime: formatTime(slot.startTime), endTime: formatTime(slot.endTime), capacity: slot.capacity, patientIds, booked, remaining, isFull: remaining <= 0, };

            if (!grouped[slot.date]) grouped[slot.date] = [];
            grouped[slot.date].push(slotObj);
            slots.push(slotObj);
        });


        const doctorReviews = await db
            .select({ id: reviews.id, rating: reviews.rating, reviewText: reviews.reviewText, createdAt: reviews.createdAt, patientName: users.fullName, patientImage: users.image, })
            .from(reviews)
            .leftJoin(patients, eq(patients.id, reviews.patientId))
            .leftJoin(users, eq(users.id, patients.userId))
            .where(eq(reviews.doctorId, Number(doctorId)))
            .orderBy(desc(reviews.createdAt));

        const [ratingSummary] = await db
            .select({ avgRating: sql`AVG(${reviews.rating})`, totalReviews: sql`COUNT(${reviews.id})`, })
            .from(reviews)
            .where(eq(reviews.doctorId, Number(doctorId)));

        res.json({ success: true, doctor, slots, reviews: doctorReviews, rating: { avgRating: Number(ratingSummary?.avgRating || 0).toFixed(1), totalReviews: Number(ratingSummary?.totalReviews || 0), }, });
    } catch (error) {
        console.error("GetDoctorProfile Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const GetPatientProfile = async (req, res) => {
    try {
        let { patientId } = req.query;

        if (!patientId) {
            return res.json({ success: false, message: "Patient ID required", });
        }

        patientId = Number(patientId);

        const [patient] = await db
            .select({ patientId: patients.id, fullName: users.fullName, userid: users.id, email: users.email, image: users.image, age: patients.age, gender: patients.gender, disease: patients.disease, phone: patients.phone, address: patients.address, bloodGroup: patients.bloodGroup, })
            .from(patients)
            .leftJoin(users, eq(users.id, patients.userId))
            .where(eq(patients.id, patientId))
            .limit(1);

        if (!patient) {
            return res.json({ success: false, message: "Patient not found", });
        }

        const reports = await db
            .select({ reportId: medicalReports.id, diseaseName: medicalReports.diseaseName, fileUrl: medicalReports.fileUrl, uploadedAt: medicalReports.uploadedAt, })
            .from(medicalReports)
            .where(eq(medicalReports.patientId, patientId))
            .orderBy(desc(medicalReports.uploadedAt));

        const appointmentsData = await db
            .select({ appointmentId: appointments.id, status: appointments.status, meetingLink: appointments.meetingLink, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, doctorId: doctors.id, doctorName: users.fullName, doctorImage: users.image, specialization: specializations.name, })
            .from(appointments)
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId))
            .where(eq(appointments.patientId, patientId))
            .orderBy(desc(doctorSlots.date), desc(doctorSlots.startTime));

        const now = new Date();

        const formatTime = (time) => {
            if (!time) return "";
            const [h, m] = time.split(":");
            return `${h.padStart(2, "0")}:${m}`;
        };

        const appointmentsFormatted = appointmentsData.map((a) => {
            const slotDateTime = new Date(`${a.date}T${a.startTime}`);
            return { appointmentId: a.appointmentId, status: a.status, meetingLink: a.meetingLink, date: a.date, startTime: formatTime(a.startTime), endTime: formatTime(a.endTime), type: slotDateTime > now ? "upcoming" : "past", doctor: { doctorId: a.doctorId, name: a.doctorName, image: a.doctorImage, specialization: a.specialization, }, };
        });

        const totalAppointments = appointmentsFormatted.length;
        const lastVisit = appointmentsFormatted.find((a) => a.type === "past")?.date || null;

        res.json({ success: true, patient, medicalReports: reports, appointments: appointmentsFormatted, summary: { totalAppointments, lastVisit, }, });

    } catch (error) {
        console.error("GetPatientProfile Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
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

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update(users).set({ password: hashedPassword }).where(and(eq(users.email, email), eq(users.role, role)));

        res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("UpdatePassword Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getDoctorsBySymptom = async (req, res) => {
    try {
        const { symptom } = req.query;

        if (!symptom) {
            return res.status(400).json({ success: false, message: "Symptom is required", });
        }

        const result = await db
            .select({ fullName: users.fullName, image: users.image, specialization: specializations.name, doctorId: doctors.id, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee })
            .from(users)
            .leftJoin(doctors, eq(doctors.userId, users.id))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(and(sql`JSON_SEARCH(${specializations.symptoms}, 'one', CONCAT('%', ${symptom}, '%')) IS NOT NULL`, eq(doctors.isApproved, true)));

        res.json({ success: true, doctors: result, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};
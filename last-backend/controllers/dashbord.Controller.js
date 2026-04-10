import db from "../db/index.js";
import { users, patients, appointments, doctors, specializations, doctorSlots, payments, } from "../db/schema.js";
import { eq, and, sql, desc, or, gt, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

const doctorUser = alias(users, "doctor_user");
const patientUser = alias(users, "patient_user");

const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    return `${h.padStart(2, "0")}:${m}`;
};

export const PatientInfo = async (req, res) => {
    try {
        const { id } = req.user;

        const [patient] = await db
            .select({ id: users.id, fullName: users.fullName, email: users.email, image: users.image, role: users.role, disease: patients.disease, patientId: patients.id })
            .from(users)
            .leftJoin(patients, eq(patients.userId, users.id))
            .where(and(eq(users.id, id), eq(users.role, "patient")))
            .limit(1);

        if (!patient) {
            return res.status(404).json({ success: false, redirect: "/auth/loginpatient", });
        }

        res.json({ success: true, patient });

    } catch (error) {
        console.error("PatientDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const DoctorInfo = async (req, res) => {
    try {
        const { id } = req.user;

        const [doctor] = await db
            .select({ id: users.id, fullName: users.fullName, email: users.email, isApproved: doctors.isApproved, image: users.image, role: users.role, doctorId: doctors.id, specialization: specializations.name, experience: doctors.experienceYears, })
            .from(users)
            .leftJoin(doctors, eq(doctors.userId, users.id))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(and(eq(users.id, id), eq(users.role, "doctor")))
            .limit(1);

        if (!doctor) {
            return res.status(404).json({ success: false, redirect: "/auth/logindoctor" });
        }
        res.json({ success: true, doctor });

    } catch (error) {
        console.error("DoctorDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const PatientDashboard = async (req, res) => {
    try {
        const { id } = req.user;

        const [patient] = await db
            .select({ id: users.id, fullName: users.fullName, email: users.email, image: users.image, role: users.role, disease: patients.disease, patientId: patients.id, })
            .from(users)
            .leftJoin(patients, eq(patients.userId, users.id))
            .where(and(eq(users.id, id), eq(users.role, "patient")))
            .limit(1);

        if (!patient) {
            return res.json({ success: false, message: "Patient not found" });
        }

        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().slice(0, 5);

        let doctorsList = await db
            .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, specialization: specializations.name, slotId: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, capacity: doctorSlots.capacity, bookedCount: sql`COUNT(${appointments.id})`, })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
            .leftJoin(appointments, eq(appointments.slotId, doctorSlots.id))
            .where(
                and(
                    or(sql`JSON_CONTAINS(${specializations.symptoms}, JSON_ARRAY(${patient.disease}))`, sql`LOWER(${specializations.name}) LIKE LOWER(${`%${patient.disease}%`})`),
                    eq(doctors.isApproved, true), eq(doctors.status, "approved"), eq(doctorSlots.isCancelled, false),
                    or(gt(doctorSlots.date, today), and(eq(doctorSlots.date, today), gt(doctorSlots.startTime, currentTime)))
                )
            ).groupBy(doctors.id, doctorSlots.id).orderBy(doctorSlots.date, doctorSlots.startTime).limit(6);

        if (doctorsList.length === 0) {
            doctorsList = await db
                .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, specialization: specializations.name, slotId: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, capacity: doctorSlots.capacity, bookedCount: sql`COUNT(${appointments.id})`, })
                .from(doctors)
                .leftJoin(users, eq(users.id, doctors.userId))
                .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
                .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
                .leftJoin(appointments, eq(appointments.slotId, doctorSlots.id))
                .where(and(sql`JSON_SEARCH(${specializations.symptoms}, 'one', 'fever')`, eq(doctors.isApproved, true), eq(doctors.status, "success"), eq(doctorSlots.isCancelled, false)))
                .groupBy(doctorSlots.id)
                .limit(6);
        }

        const formattedDoctors = doctorsList.map((d) => {
            const booked = Number(d.bookedCount || 0);
            const remaining = d.capacity - booked;
            return { doctorId: d.doctorId, fullName: d.fullName, image: d.image, experienceYears: d.experienceYears, consultationFee: d.consultationFee, specialization: d.specialization, slot: { slotId: d.slotId, date: d.date, startTime: formatTime(d.startTime), endTime: formatTime(d.endTime), capacity: d.capacity, booked, remaining, isFull: remaining <= 0, }, };
        });

        const appointmentList = await db
            .select({ amount: payments.amount, transactionId: payments.transactionId, cancelReason: appointments.cancelReason, paymentStatus: payments.paymentStatus, isCancelled: doctorSlots.isCancelled, appoitmentCreatedAt: appointments.createdAt, appointmentId: appointments.id, appointmentStatus: appointments.status, meetingLink: appointments.meetingLink, doctorName: users.fullName, doctorImage: users.image, doctorId: doctors.id, consultationFee: doctors.consultationFee, specialization: specializations.name, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, })
            .from(appointments)
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId))
            .leftJoin(payments, eq(payments.appointmentId, appointments.id))
            .where(and(eq(appointments.patientId, patient.patientId), and(ne(appointments.status, "Cancelled"), ne(appointments.cancelReason, ""),), or(gt(doctorSlots.date, today), and(eq(doctorSlots.date, today), gt(doctorSlots.startTime, new Date(Date.now() + 15 * 60 * 1000).toTimeString().slice(0, 8))))))
            .orderBy(desc(doctorSlots.date), desc(doctorSlots.startTime));

        const formattedAppointments = appointmentList.map((a) => {
            const slotDateTime = new Date(`${a.date}T${a.startTime}`);
            const formatDateTime = (date) => { return new Date(date).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true, }); }
            return { appointmentId: a.appointmentId, status: a.appointmentStatus, cancelReason: a.cancelReason, appoitmentCreatedAt: formatDateTime(a.appoitmentCreatedAt), paymentStatus: a.paymentStatus, amount: a.amount, meetingLink: a.meetingLink, type: slotDateTime > now ? "upcoming" : "past", doctor: { doctorId: a.doctorId, name: a.doctorName, image: a.doctorImage, specialization: a.specialization }, slot: { date: a.date, startTime: formatTime(a.startTime), endTime: formatTime(a.endTime), isCancelled: a.isCancelled, }, };
        });
        res.json({ success: true, patient, doctorsList: formattedDoctors, appointments: formattedAppointments, });

    } catch (error) {
        console.error("PatientDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const DoctorDashboard = async (req, res) => {
    try {
        const { id } = req.user;

        const [doctor] = await db
            .select({ doctorId: doctors.id, fullName: doctorUser.fullName, email: doctorUser.email, image: doctorUser.image, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, specialization: specializations.name, status: doctors.status, isApproved: doctors.isApproved, })
            .from(doctors)
            .leftJoin(doctorUser, eq(doctorUser.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(eq(doctors.userId, id))
            .limit(1);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found", });
        }

        const now = new Date();
        const today = now.toISOString().split("T")[0];

        const appointmentsData = await db
            .select({ appointmentId: appointments.id, slotId: appointments.slotId, status: appointments.status, meetingLink: appointments.meetingLink, cancelReason: appointments.cancelReason, createdAt: appointments.createdAt, slotDate: doctorSlots.date, slotStartTime: doctorSlots.startTime, slotEndTime: doctorSlots.endTime, slotCapacity: doctorSlots.capacity, slotCancelled: doctorSlots.isCancelled, patientId: patients.id, patientDisease: patients.disease, patientAge: patients.age, patientGender: patients.gender, patientPhone: patients.phone, patientBloodGroup: patients.bloodGroup, patientAddress: patients.address, patientName: patientUser.fullName, patientImage: patientUser.image, patientEmail: patientUser.email, paymentId: payments.id, paymentAmount: payments.amount, paymentStatus: payments.paymentStatus, paymentMethod: payments.paymentMethod, transactionId: payments.transactionId, paidAt: payments.paidAt, })
            .from(appointments)
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId),)
            .leftJoin(patients, eq(patients.id, appointments.patientId))
            .leftJoin(patientUser, eq(patientUser.id, patients.userId))
            .leftJoin(payments, eq(payments.appointmentId, appointments.id))
            .where(eq(appointments.doctorId, doctor.doctorId))
            .orderBy(desc(doctorSlots.date), desc(doctorSlots.startTime));

        const slotCounts = await db
            .select({ slotId: appointments.slotId, booked: sql`COUNT(${appointments.id})`, })
            .from(appointments)
            .where(eq(appointments.doctorId, doctor.doctorId))
            .groupBy(appointments.slotId);

        const slotCountMap = {};

        slotCounts.forEach((slot) => {
            slotCountMap[slot.slotId] = Number(slot.booked);
        });

        const formattedAppointments = appointmentsData.map((appointment) => {
            const booked = slotCountMap[appointment.slotId] || 0;
            const capacity = Number(appointment.slotCapacity || 0);
            const remaining = capacity - booked;
            const slotDateTime = appointment.slotDate && appointment.slotStartTime ? new Date(`${appointment.slotDate}T${appointment.slotStartTime}`) : null;

            return {
                appointmentId: appointment.appointmentId,
                slotId: appointment.slotId,
                status: appointment.status,
                meetingLink: appointment.meetingLink,
                cancelReason: appointment.cancelReason,
                createdAt: appointment.createdAt,
                type: slotDateTime && slotDateTime > now ? "upcoming" : "past",
                patient: { id: appointment.patientId, name: appointment.patientName, image: appointment.patientImage, email: appointment.patientEmail, disease: appointment.patientDisease, age: appointment.patientAge, gender: appointment.patientGender, phone: appointment.patientPhone, bloodGroup: appointment.patientBloodGroup, address: appointment.patientAddress, },
                slot: { id: appointment.slotId, date: appointment.slotDate, startTime: appointment.slotStartTime ? formatTime(appointment.slotStartTime) : null, endTime: appointment.slotEndTime ? formatTime(appointment.slotEndTime) : null, capacity, booked, available: remaining > 0 ? remaining : 0, remaining, isFull: remaining <= 0, isCancelled: appointment.slotCancelled, },
                payment: { id: appointment.paymentId, amount: appointment.paymentAmount || 0, status: appointment.paymentStatus || "pending", method: appointment.paymentMethod, transactionId: appointment.transactionId, paidAt: appointment.paidAt, },
            };
        });

        const totalAppointments = formattedAppointments.length;
        const confirmed = formattedAppointments.filter((appointment) => appointment.status?.toLowerCase() === "confirmed").length;
        const pending = formattedAppointments.filter((appointment) => appointment.status?.toLowerCase() === "wait for approval").length;
        const cancelled = formattedAppointments.filter((appointment) => appointment.status?.toLowerCase() === "cancelled").length;
        const todayAppointments = formattedAppointments.filter((appointment) => appointment.slot.date === today).length;
        const upcomingAppointments = formattedAppointments.filter((appointment) => appointment.type === "upcoming").length;
        const pastAppointments = formattedAppointments.filter((appointment) => appointment.type === "past").length;
        const totalRevenue = formattedAppointments.reduce((sum, appointment) => { if (appointment.payment.status?.toLowerCase() === "paid") { return sum + Number(appointment.payment.amount || 0); } return sum; }, 0);
        const fullSlots = formattedAppointments.filter((appointment) => appointment.slot.isFull).length;

        return res.status(200).json({
            success: true,
            doctor,
            stats: { totalAppointments, confirmed, pending, cancelled, todayAppointments, upcomingAppointments, pastAppointments, totalRevenue, fullSlots, },
            formattedAppointments,
        });
    } catch (error) {
        console.error("DoctorDashboard Error:", error);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);

        return res.status(500).json({ success: false, message: error.message || "Internal server error", });
    }
};

export const PatientGetDoctor = async (req, res) => {
    try {
        const categories = [
            { label: "Heart", match: ["Cardiologist"] }, { label: "Brain", match: ["Neurologist"] },
            { label: "Bones & Joints", match: ["Orthopedic"] }, { label: "Lungs", match: ["Pulmonologist"] },
            { label: "Stomach & Liver", match: ["Gastroenterologist"] }, { label: "Skin", match: ["Dermatologist"] },
            { label: "General Health", match: ["General Physician"] }, { label: "Child Care", match: ["Pediatrician"] },
        ];

        const result = [];

        for (const cat of categories) {

            const doctorsData = await db
                .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, specialization: specializations.name, slots: sql`COALESCE(JSON_ARRAYAGG( JSON_OBJECT( 'slotId', ${doctorSlots.id}, 'date', ${doctorSlots.date}, 'startTime', ${doctorSlots.startTime}, 'endTime', ${doctorSlots.endTime}, 'capacity', ${doctorSlots.capacity}, 'bookedCount', ( SELECT COUNT(*) FROM ${appointments} WHERE ${appointments.slotId} = ${doctorSlots.id}))),JSON_ARRAY()) ` })
                .from(doctors)
                .leftJoin(users, eq(users.id, doctors.userId))
                .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
                .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
                .where(
                    and(
                        eq(doctors.isApproved, true),
                        eq(doctors.status, "approved"),
                        eq(doctorSlots.isCancelled, false),
                        sql`STR_TO_DATE(CONCAT(${doctorSlots.date}, ' ', ${doctorSlots.startTime}), '%Y-%m-%d %h:%i %p' ) > NOW()`,
                        or(...cat.match.map((m) => sql`LOWER(${specializations.name}) LIKE LOWER(${`%${m}%`})`))
                    )
                )
                .groupBy(doctors.id, users.fullName, users.image, doctors.experienceYears, specializations.name)
                .limit(10);

            result.push({ category: cat.label, doctors: doctorsData });
        }

        return res.json({ success: true, doctors: result });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Error patient get doctors" });
    }
};
import { medicalReports, doctorSlots, appointments, patients, doctors } from "../db/schema.js";
import { eq, and, sql, ne } from "drizzle-orm";
import db from "../db/index.js";
import { CreateNotification } from "./response.Controller.js";

export const UploadMedicalReport = async (req, res) => {
  try {
    const { diseaseName } = req.body;
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access", });
    }

    if (!diseaseName || diseaseName.trim() === "") {
      return res.status(400).json({ success: false, message: "Disease name is required", });
    }

    if (!file) {
      return res.status(400).json({ success: false, message: "Medical report file is required", });
    }
    const patient = await db.select().from(patients).where(eq(patients.userId, userId)).limit(1);

    if (!patient.length) {
      return res.status(404).json({ success: false, message: "Patient profile not found", });
    }

    const patientId = patient[0].id;
    const result = await db.insert(medicalReports).values({ patientId, diseaseName: diseaseName.trim(), fileUrl: file.path, uploadedAt: new Date(), });

    const insertedId = result[0]?.insertId || result.insertId;
    const newReport = await db.select().from(medicalReports).where(eq(medicalReports.id, insertedId)).limit(1);

    return res.json({ success: true, message: "Medical report uploaded successfully", data: newReport[0], });

  } catch (error) {
    console.error("UploadMedicalReport Error:", error);
    return res.status(500).json({ success: false, message: "Server error", });
  }
};

export const GetMedicalReports = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized", });
    }

    const patient = await db.select().from(patients).where(eq(patients.userId, userId)).limit(1);

    if (!patient.length) {
      return res.json({ success: true, reports: [], });
    }

    const patientId = patient[0].id;
    const reports = await db.select().from(medicalReports).where(eq(medicalReports.patientId, patientId));
    return res.json({ success: true, reports, });

  } catch (error) {
    console.error("GetMedicalReports Error:", error);
    return res.status(500).json({ success: false, message: "Server error", });
  }
};

export const DeleteMedicalReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ success: false, message: "Report ID required", });
    }

    await db.delete(medicalReports).where(eq(medicalReports.id, reportId));
    return res.json({ success: true, message: "Report deleted successfully", });

  } catch (error) {
    console.error("DeleteMedicalReport Error:", error);
    return res.status(500).json({ success: false, message: "Server error", });
  }
};

export const CreateDoctorSlot = async (req, res) => {
  try {
    const userId = req.user.id
    const { date, startTime, endTime, capacity } = req.body;

    const doctorData = await db.select().from(doctors).where(eq(doctors.userId, userId)).limit(1);

    const doctor = doctorData[0];
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found", });
    }

    await db.insert(doctorSlots).values({ doctorId: doctor.id, date, startTime, endTime, capacity: capacity });
    res.json({ success: true, message: "Slot created" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const GetDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required", });
    }

    const slots = await db
      .select({ slotId: doctorSlots.id, optionalFor: doctorSlots.optionalFor, doctorId: doctorSlots.doctorId, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, capacity: doctorSlots.capacity, isCancelled: doctorSlots.isCancelled, booked: sql`COUNT(${appointments.id})`, })
      .from(doctorSlots)
      .leftJoin(appointments, and(eq(appointments.slotId, doctorSlots.id), ne(appointments.status, "Cancelled")))
      .where(and(eq(doctorSlots.doctorId, Number(doctorId)), ne(doctorSlots.optionalFor, "ended")))
      .groupBy(doctorSlots.id, doctorSlots.doctorId, doctorSlots.date, doctorSlots.startTime, doctorSlots.endTime, doctorSlots.capacity, doctorSlots.isCancelled).orderBy(doctorSlots.date, doctorSlots.startTime);

    const formattedSlots = slots.map((slot) => {
      const booked = Number(slot.booked || 0);
      const capacity = Number(slot.capacity || 0);
      const available = capacity - booked;

      return { slotId: slot.slotId, doctorId: slot.doctorId, optionalFor: slot.optionalFor, date: slot.date, startTime: slot.startTime, endTime: slot.endTime, capacity, booked, available: available > 0 ? available : 0, isFull: booked >= capacity, isCancelled: slot.isCancelled, };
    });

    return res.status(200).json({ success: true, totalSlots: formattedSlots.length, slots: formattedSlots, });
  } catch (error) {
    console.error("GetDoctorSlots Error:", error);
    console.error("Message:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error", });
  }
};

export const UpdateDoctorSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slotId, action, reason, change } = req.body;

    if (!slotId || !action) {
      return res.status(400).json({ success: false, message: "slotId and action are required", });
    }

    const slotData = await db.select({ slotId: doctorSlots.id }).from(doctorSlots).innerJoin(doctors, eq(doctorSlots.doctorId, doctors.id)).where(and(eq(doctorSlots.id, slotId), eq(doctors.userId, userId))).limit(1);

    if (slotData.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found or unauthorized", });
    }

    if (action === "remove") {
      await db.update(doctorSlots).set({ slotstage: "Removed" }).where(eq(doctorSlots.id, slotId));
      return res.json({ success: true, message: "Slot removed successfully", });
    }

    if (action === "changeactive") {
      await db.update(doctorSlots).set({ isCancelled: change == "activate" ? false : true }).where(eq(doctorSlots.id, slotId));

      if (change != "activate") {
        await db.update(appointments).set({ status: "Cancelled", createdAt: new Date(), cancelReason: reason, }).where(and(eq(appointments.slotId, slotId), ne(appointments.status, "Cancelled")));

        const affectedAppointments = await db.select({ appointmentId: appointments.id, patientId: appointments.patientId, }).from(appointments).where(and(eq(appointments.slotId, slotId), ne(appointments.status, "Cancelled")));
        await Promise.all(affectedAppointments.map((appointment) => CreateNotification({ patientId: appointment.patientId, message: `Your appointment has been cancelled. Please book again if needed.`, })));
      }
      return res.json({ success: true, message: change != "activate" ? "Slot unactivated successfully" : "Slot activated successfully", });
    }
    return res.status(400).json({ success: false, message: "Invalid action type", });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", });
  }
};

export const CreateAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, patientId } = req.body;

    if (!doctorId || !slotId || !patientId) {
      return res.json({ success: false, message: "DoctorId, SlotId and PatientId are required", });
    }

    const slot = await db.select().from(doctorSlots).where(eq(doctorSlots.id, slotId));
    const existingAppointments = await db.select().from(appointments).where(eq(appointments.slotId, slotId));

    if (existingAppointments.length >= slot[0].capacity) {
      return res.status(400).json({ message: "Slot is full", });
    }
    await db.insert(appointments).values({ doctorId, patientId, slotId, status: "wait for approval", });

    await CreateNotification({ doctorId, message: `📢 You have received a new appointment request. Please review and choose to Accept or Reject the request.`, })
    res.json({ success: true, message: "Appointment booked successfully", });

  } catch (error) {
    console.error("CreateAppointment Error:", error);
    res.status(500).json({ success: false, message: "Server error", });
  }
};

export const ConfirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID required", });
    }

    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, appointmentId),);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found", });
    }

    await db.update(appointments).set({ status: "confirmed", updatedAt: new Date(), }).where(eq(appointments.id, appointmentId));
    await CreateNotification({ patientId: appointment.patientId, message: `Your appointment request was confirmed.`, });

    return res.json({ success: true, message: "Appointment confirmed successfully", });

  } catch (error) {
    console.error("ConfirmAppointment Error:", error);
    return res.status(500).json({ success: false, message: "Server error", });
  }
};

export const CancelAppointment = async (req, res) => {
  try {
    const { appointmentId, reason } = req.body

    if (!appointmentId || !reason) {
      return res.status(400).json({ success: false, message: "SlotId and reason are required", });
    }

    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, appointmentId),);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found", });
    }

    await db.update(appointments).set({ status: "Cancelled", createdAt: new Date(), cancelReason: reason, }).where(eq(appointments.id, appointmentId));
    await CreateNotification({ patientId: appointment.patientId, message: `Your appointment has been cancelled. Please book again if needed.`, });

    res.json({ success: true, message: "Appointment cancelled" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const ReuseSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slotId, optionalFor, date, startTime, endTime, capacity, } = req.body;

    if (!slotId) {
      return res.status(400).json({ success: false, message: "slotId is required", });
    }

    const slotData = await db.select().from(doctorSlots).innerJoin(doctors, eq(doctorSlots.doctorId, doctors.id)).where(and(eq(doctorSlots.id, slotId), eq(doctors.userId, userId))).limit(1);

    if (slotData.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found or unauthorized", });
    }

    const currentSlot = slotData[0].doctor_slots;

    let newDate;
    if (date) {
      newDate = date;
    } else {
      const nextDate = new Date(currentSlot.date);
      nextDate.setDate(nextDate.getDate() + 1);
      newDate = nextDate.toISOString().split("T")[0];
    }

    const insertedSlot = await db.insert(doctorSlots).values({ doctorId: currentSlot.doctorId, date: newDate, startTime: startTime || currentSlot.startTime, endTime: endTime || currentSlot.endTime, capacity: capacity || currentSlot.capacity, optionalFor: optionalFor || "once", }).$returningId();
    await db.update(doctorSlots).set({ optionalFor: "ended", }).where(eq(doctorSlots.id, slotId));
    await CreateNotification({ userId, message: "Your slot has been updated successfully", });

    const newSlot = insertedSlot[0].id;
    const [slot] = await db.select().from(doctorSlots).innerJoin(doctors, eq(doctorSlots.doctorId, doctors.id)).where(and(eq(doctorSlots.id, newSlot), eq(doctors.userId, userId))).limit(1);

    return res.json({ success: true, message: "Slot updated successfully", slot: slot.doctor_slots });
  } catch (error) {
    console.error("ReuseSlot Error:", error);

    return res.status(500).json({ success: false, message: "Server error", });
  }
};

export const UpdateSlotDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ success: false, message: "slotId is required", });
    }

    const slotData = await db.select().from(doctorSlots).innerJoin(doctors, eq(doctorSlots.doctorId, doctors.id)).where(and(eq(doctorSlots.id, slotId), eq(doctors.userId, userId))).limit(1);

    if (slotData.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found or unauthorized", });
    }

    const currentSlot = slotData[0].doctor_slots;

    const nextDate = new Date(currentSlot.date);
    nextDate.setDate(nextDate.getDate() + 1);

    const formattedNextDate = nextDate.toISOString().split("T")[0];

    const insertedSlot = await db.insert(doctorSlots).values({ doctorId: currentSlot.doctorId, date: formattedNextDate, startTime: currentSlot.startTime, endTime: currentSlot.endTime, capacity: currentSlot.capacity, optionalFor: "daily", }).returningId();
    await db.update(doctorSlots).set({ optionalFor: "ended", }).where(eq(doctorSlots.id, slotId));
    const newSlot = insertedSlot[0];

    const slotPayload = { id: newSlot.id, date: newSlot.date, startTime: newSlot.startTime, endTime: newSlot.endTime, capacity: Number(newSlot.capacity), available: Number(newSlot.capacity), booked: 0, status: "available", };
    return res.json({ success: true, message: "Next day slot created successfully", slot: slotPayload, });

  } catch (error) {
    console.error("UpdateSlotDate Error:", error);
    return res.status(500).json({ success: false, message: "Server error", });
  }
};

export const UpdateSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slotId, optionalFor, date, startTime, endTime, capacity, } = req.body;

    if (!slotId) {
      return res.status(400).json({ success: false, message: "slotId is required", });
    }

    const slotData = await db.select().from(doctorSlots).innerJoin(doctors, eq(doctorSlots.doctorId, doctors.id)).where(and(eq(doctorSlots.id, slotId), eq(doctors.userId, userId))).limit(1);

    if (slotData.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found or unauthorized", });
    }

    const currentSlot = slotData[0].doctor_slots;

    let newDate;
    const insertedSlot = await db.insert(doctorSlots).values({ doctorId: currentSlot.doctorId, date: newDate, startTime: startTime || currentSlot.startTime, endTime: endTime || currentSlot.endTime, capacity: capacity || currentSlot.capacity, optionalFor: optionalFor || "once", }).$returningId();
    await db.update(doctorSlots).set({ optionalFor: "ended", }).where(eq(doctorSlots.id, slotId));
    await CreateNotification({ userId, message: "Your slot has been updated successfully", });

    const newSlot = insertedSlot[0].id;
    const [slot] = await db.select().from(doctorSlots).innerJoin(doctors, eq(doctorSlots.doctorId, doctors.id)).where(and(eq(doctorSlots.id, newSlot), eq(doctors.userId, userId))).limit(1);

    return res.json({ success: true, message: "Slot updated successfully", slot: slot.doctor_slots });
  } catch (error) {
    console.error("ReuseSlot Error:", error);

    return res.status(500).json({ success: false, message: "Server error", });
  }
};
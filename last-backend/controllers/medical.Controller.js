import { medicalReports, doctorSlots, appointments, patients, doctors } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import db from "../db/index.js";

export const UploadMedicalReport = async (req, res) => {

  try {
    const { diseaseName } = req.body;
    const userId = req.user?.id;
    const file = req.files; // single file

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!diseaseName || diseaseName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Disease name is required",
      });
    }


    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Medical report file is required",
      });
    }

    // Find patient
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, userId))
      .limit(1);

    if (!patient.length) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const patientId = patient[0].id;

    // Insert report
    const result = await db
      .insert(medicalReports)
      .values({
        patientId,
        diseaseName: diseaseName.trim(),
        fileUrl: file[0].path,
        uploadedAt: new Date(),
      })
      ;

    const insertedId = result[0]?.insertId || result.insertId;

    const newReport = await db
      .select()
      .from(medicalReports)
      .where(eq(medicalReports.id, insertedId))
      .limit(1);


    return res.json({
      success: true,
      message: "Medical report uploaded successfully",
      data: newReport[0],
    });

  } catch (error) {
    console.error("UploadMedicalReport Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const GetMedicalReports = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, userId))
      .limit(1);

    if (!patient.length) {
      return res.json({
        success: true,
        reports: [],
      });
    }

    const patientId = patient[0].id;

    const reports = await db
      .select()
      .from(medicalReports)
      .where(eq(medicalReports.patientId, patientId));

    return res.json({
      success: true,
      reports,
    });

  } catch (error) {
    console.error("GetMedicalReports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const DeleteMedicalReport = async (req, res) => {
  try {

    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: "Report ID required",
      });
    }

    await db
      .delete(medicalReports)
      .where(eq(medicalReports.id, reportId));

    return res.json({
      success: true,
      message: "Report deleted successfully",
    });

  } catch (error) {
    console.error("DeleteMedicalReport Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const CreateDoctorSlot = async (req, res) => {
  try {
    const userId = req.user.id

    const { date, startTime, endTime } = req.body;
    const doctorData = await db.select().from(doctors).where(eq(doctors.userId, userId)).limit(1);
    const doctor = doctorData[0];
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found", });
    }

    await db.insert(doctorSlots).values({ doctorId: doctor.id, date, startTime, endTime });
    res.json({ success: true, message: "Slot created" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const GetDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.query;

    const slots = await db.select().from(doctorSlots).where(eq(doctorSlots.doctorId, doctorId));
    res.json({ success: true, slots });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "doctor slot get err" });
  }
};

export const DeleteDoctorSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slotId } = req.query;

    const slotData = await db
      .select({ slotId: doctorSlots.id, })
      .from(doctorSlots)
      .innerJoin(doctors, eq(doctorSlots.doctorId, doctors.id))
      .where(and(eq(doctorSlots.id, slotId), eq(doctors.userId, userId)))
      .limit(1);

    if (slotData.length === 0) {
      return res.status(404).json({ success: false, message: "Slot not found or unauthorized", });
    }

    await db.delete(doctorSlots).where(eq(doctorSlots.id, slotId));
    return res.json({ success: true, message: "Slot deleted successfully", });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "slote delete err" });
  }
};

export const CreateAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, patientId } = req.body;

    if (!doctorId || !slotId) {
      return res.json({ success: false, message: "DoctorId and SlotId required", });
    }

    const [slot] = await db.select().from(doctorSlots).where(eq(doctorSlots.id, Number(slotId)));

    if (!slot) {
      return res.json({ success: false, message: "Slot not found", });
    }

    if (slot.isBooked) {
      return res.json({ success: false, message: "Slot already booked", });
    }

    const existing = await db.select().from(appointments).where(eq(appointments.slotId, Number(slotId)));

    if (existing.length > 0) {
      return res.json({ success: false, message: "Slot already taken", });
    }

    await db.insert(appointments).values({ doctorId, patientId, slotId, status: "wait for approval", });
    await db.update(doctorSlots).set({ isBooked: true }).where(eq(doctorSlots.id, Number(slotId)));

    res.json({ success: true, message: "Appointment booked successfully", });

  } catch (error) {
    console.error("CreateAppointment Error:", error);
    res.status(500).json({ success: false, message: "Server error", });
  }
};

export const ConfirmAppointment = async (req, res) => {
  try {
    const { appointmentId, slotId } = req.body;

    await db.update(appointments).set({ status: "confirmed" }).where(eq(appointments.id, appointmentId));
    await db.update(doctorSlots).set({ isBooked: true }).where(eq(doctorSlots.id, slotId));

    res.json({ success: true, message: "Appointment confirmed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const CancelAppointment = async (req, res) => {
  try {
    const { appointmentId, slotId } = req.body;

    await db.update(appointments)
      .set({ status: "cancelled" })
      .where(eq(appointments.id, appointmentId));

    await db.update(doctorSlots)
      .set({ isBooked: false })
      .where(eq(doctorSlots.id, slotId));

    res.json({ success: true, message: "Appointment cancelled" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
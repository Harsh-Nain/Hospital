import bcrypt from "bcrypt";
import db from "../db/index.js";
import jwt from "jsonwebtoken"
import { users, patients, doctors, specializations } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { sendOtpMail } from "../utils/mailer.js";
const otpStore = {};
const verifiedOtpStore = {};

export const sendOtp = async (req, res) => {
    try {
        const { fullName, email, password, role, specialization, experienceYears, licenseNumber, consultationFee, disease } = req.body;

        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        if (role === "doctor") {
            if (!specialization || !experienceYears || !licenseNumber || !consultationFee) {
                return res.status(400).json({ success: false, message: "Required fields missing" });
            }
        }

        if (role === "patient") {
            if (!disease) {
                return res.status(400).json({ success: false, message: "Disease field missing" });
            }
        }

        const existingUser = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, role)));

        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

        await sendOtpMail(email, otp);
        res.json({ success: true, message: "OTP sent to email" });

    } catch (err) {
        console.log("OTP ERROR:", err)
        res.status(500).json({ success: false, message: "OTP send failed", });
    }

};

export const verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];

    if (!record) {
        return res.status(400).json({ success: false, message: "OTP not found" });
    }

    if (record.otp != otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (record.expires < Date.now()) {
        return res.status(400).json({ success: false, message: "OTP expired" });
    }
    verifiedOtpStore[email] = true;

    delete otpStore[email];
    res.json({ success: true, message: "OTP verified" });
};

export const forgetpassword = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const existingUser = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, role)));

        if (existingUser.length == 0) {
            return res.status(400).json({ success: false, message: "Email not exists" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);

        otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

        await sendOtpMail(email, otp);

        res.json({ success: true, message: "OTP sent to email" });

    } catch (err) {
        console.log("FORGET OTP ERROR:", err);
        res.status(500).json({ success: false, message: "OTP send failed" });
    }
};

export const SavePatient = async (req, res) => {
    try {
        const { fullName, password, email, disease } = req.body.formdata;

        const securePassword = await bcrypt.hash(password, 10);
        const newUser = await db.insert(users).values({ fullName, role: "patient", email, password: securePassword, image: "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg", }).$returningId();

        const userId = newUser[0].id;
        await db.insert(patients).values({ userId, disease, });

        const accessToken = jwt.sign({ id: userId, email, role: "patient" }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d", });

        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, });

        res.json({ success: true, redirect: "/dashboard-patient", });

    } catch (error) {
        console.error("SavePatient Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const SaveDoctor = async (req, res) => {
    try {
        const { fullName, password, symptoms, email, specialization, experienceYears, licenseNumber, consultationFee, } = req.body.formdata;
        console.log(fullName, password, symptoms, email, specialization, experienceYears, licenseNumber, consultationFee,);

        const securePassword = await bcrypt.hash(password, 10);
        const newUser = await db.insert(users).values({ fullName, role: "doctor", email, password: securePassword, image: "https://res.cloudinary.com/ddiyrbync/image/upload/v1772771650/istockphoto-2077095666-612x612_j1wo4i.jpg", }).$returningId();

        const userId = newUser[0].id;
        let specializationRow = await db.select().from(specializations).where(eq(specializations.name, specialization));

        let specializationId;

        if (specializationRow.length === 0) {
            const newSpec = await db.insert(specializations).values({ name: specialization, symptoms }).$returningId();
            specializationId = newSpec[0].id;
        } else {
            specializationId = specializationRow[0].id;
        }

        await db.insert(doctors).values({ userId, specializationId, experienceYears, licenseNumber, consultationFee, });

        const accessToken = jwt.sign({ id: userId, email, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d", });

        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, });
        await CreateNotification({ doctorId: -1, message: "📢 You have received a new approval request. A new doctor has submitted registration details. Please review the doctor's information.", });

        res.json({ success: true, redirect: "/checking", });

    } catch (error) {
        console.error("SaveDoctor Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export async function LoginUser(req, res, role) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const [user] = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, role))).limit(1);

        if (!user) return (res.status(404).json({
            success: false,
            message: "User does not exist"
        }))

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }
        const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

        if (role === "doctor") {
            const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, user.id)).limit(1);

            if (doctor.status == "rejected") {
                return res.status(403).json({ success: false, message: "Doctor account is not approved" });
            }

            if (!doctor || !doctor.isApproved) {
                return res.status(403).json({ success: false, redirect: "/checking", message: "Doctor account is not approved yet" });
            }
        }

        return res.json({ success: true, redirect: role === "patient" ? "/dashboard-patient" : "/dashboard-doctor" });

    } catch (error) {
        console.error("LoginUser Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const logout = (req, res) => {
    console.log('Logout');
    res.cookie('accessToken', '');
    res.cookie('refreshToken', '');
    res.json({ success: true });
};
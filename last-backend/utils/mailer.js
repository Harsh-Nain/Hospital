import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
console.log(otp);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Healthcare Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "OTP Verification",
        html: `
            <h2>Email Verification</h2>
            <p>Your OTP for registration is:</p>
            <h1 style="letter-spacing:5px">${otp}</h1>
            <p>This OTP will expire in 5 minutes.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};
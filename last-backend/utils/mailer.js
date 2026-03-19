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
    subject: "🔐 Verify Your Email - OTP",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f8fb; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg,#0ea5e9,#10b981); padding:20px; text-align:center; color:white;">
            <h2 style="margin:0;">Healthcare Portal</h2>
            <p style="margin:0; font-size:12px;">Secure Verification</p>
          </div>

          <!-- Body -->
          <div style="padding:25px; text-align:center;">
            <h3 style="color:#333;">Verify Your Email</h3>
            <p style="color:#555;">Use the OTP below to complete your registration</p>

            <div style="margin:20px 0; font-size:28px; font-weight:bold; letter-spacing:8px; color:#0ea5e9;">
              ${otp}
            </div>

            <p style="color:#888; font-size:12px;">This OTP will expire in 5 minutes</p>
          </div>

          <!-- Footer -->
          <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
            © 2026 Healthcare System
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendRejectionMail = async (email, name, reason) => {

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
    subject: "❌ Profile Rejected",
    html: `
      <div style="font-family: Arial; background:#f4f8fb; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; border-radius:12px; overflow:hidden;">
          
          <div style="background:linear-gradient(90deg,#ef4444,#dc2626); padding:20px; text-align:center; color:white;">
            <h2>Application Rejected</h2>
          </div>

          <div style="padding:25px;">
            <h3>Hello Dr. ${name},</h3>
            <p>Your application was <b style="color:#ef4444;">rejected</b>.</p>
            
            <p><b>Reason:</b></p>
            <div style="background:#fef2f2; padding:10px; border-radius:8px; color:#b91c1c;">
              ${reason}
            </div>

            <p style="margin-top:15px;">Please correct the details and apply again.</p>
          </div>

          <div style="text-align:center; padding:15px; font-size:12px; color:#888;">
            Healthcare System Support
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendApprovalMail = async (email, name) => {
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
    subject: "✅ Profile Approved",
    html: `
      <div style="font-family: Arial; background:#f4f8fb; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; border-radius:12px; overflow:hidden;">
          
          <div style="background:linear-gradient(90deg,#10b981,#22c55e); padding:20px; text-align:center; color:white;">
            <h2>Approved 🎉</h2>
          </div>

          <div style="padding:25px;">
            <h3>Hello Dr. ${name},</h3>
            <p>Your profile has been <b style="color:#10b981;">approved</b>.</p>
            <p>You can now start using the platform.</p>
          </div>

          <div style="text-align:center; padding:15px; font-size:12px; color:#888;">
            Welcome to Healthcare System
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
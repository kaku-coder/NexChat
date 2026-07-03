import nodemailer from "nodemailer";

// ─── Transporter (Gmail) ──────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Gmail App Password (not real password)
    },
});

// ─── Welcome Email (Google OAuth new user) ────────────────────────────────────
export const sendWelcomeEmail = async ({ to, userName, avatar }) => {
    const avatarHTML = avatar
        ? `<img src="${avatar}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #6c63ff;margin-bottom:16px;" />`
        : `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#3ecfcf);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 16px auto;">👤</div>`;

    const mailOptions = {
        from: `"NexChat" <${process.env.MAIL_USER}>`,
        to,
        subject: "🎉 Welcome to NexChat!",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to NexChat</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1a1a2e,#16213e);border-radius:20px;overflow:hidden;border:1px solid rgba(108,99,255,0.3);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6c63ff,#3ecfcf);padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0;font-size:32px;color:#fff;letter-spacing:2px;font-weight:800;">⚡ NexChat</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;letter-spacing:1px;">Real-Time Messaging Platform</p>
            </td>
          </tr>

          <!-- Avatar + Name -->
          <tr>
            <td style="padding:36px 40px 0;text-align:center;">
              ${avatarHTML}
              <h2 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Hey, ${userName}! 👋</h2>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.6);font-size:15px;">Welcome aboard! We're thrilled to have you.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 40px;">
              <p style="color:rgba(255,255,255,0.75);font-size:15px;line-height:1.7;margin:0 0 20px;">
                You've successfully joined <strong style="color:#6c63ff;">NexChat</strong> using your Google account. 
                Your account is ready — start chatting in real-time with friends and colleagues!
              </p>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px;background:rgba(108,99,255,0.1);border-radius:12px;border-left:3px solid #6c63ff;margin-bottom:10px;">
                    <p style="margin:0;color:#fff;font-size:14px;">💬 <strong>Real-Time Chat</strong> — Instant messaging with Socket.IO</p>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:rgba(62,207,207,0.1);border-radius:12px;border-left:3px solid #3ecfcf;">
                    <p style="margin:0;color:#fff;font-size:14px;">🔐 <strong>Secure Auth</strong> — JWT + Google OAuth protection</p>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:rgba(108,99,255,0.1);border-radius:12px;border-left:3px solid #6c63ff;">
                    <p style="margin:0;color:#fff;font-size:14px;">⚡ <strong>Lightning Fast</strong> — Redis-powered performance</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0 10px;">
                <a href="http://localhost:5173" 
                   style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#6c63ff,#3ecfcf);color:#fff;text-decoration:none;border-radius:50px;font-size:16px;font-weight:700;letter-spacing:0.5px;box-shadow:0 4px 20px rgba(108,99,255,0.4);">
                  🚀 Open NexChat
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.35);font-size:12px;line-height:1.6;">
                This email was sent because you signed up for NexChat.<br/>
                If you didn't create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${to}`);
};


// ─── Login Notification Email ─────────────────────────────────────────────────
export const sendLoginNotificationEmail = async ({ to, userName }) => {
    const loginTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
    });

    const mailOptions = {
        from: `"NexChat Security" <${process.env.MAIL_USER}>`,
        to,
        subject: "🔔 New Login to Your NexChat Account",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Login Notification</title>
</head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1a1a2e,#16213e);border-radius:20px;overflow:hidden;border:1px solid rgba(108,99,255,0.3);">

          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:30px 40px;text-align:center;border-bottom:1px solid rgba(108,99,255,0.2);">
              <h1 style="margin:0;font-size:28px;color:#fff;font-weight:800;">⚡ NexChat</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 40px;">
              <div style="text-align:center;margin-bottom:24px;">
                <div style="font-size:52px;">🔐</div>
              </div>
              <h2 style="margin:0 0 12px;color:#fff;font-size:22px;text-align:center;">New Google Login Detected</h2>
              <p style="color:rgba(255,255,255,0.65);font-size:15px;text-align:center;margin:0 0 28px;">
                Hi <strong style="color:#6c63ff;">${userName}</strong>, a new login to your account was detected via Google.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(108,99,255,0.08);border-radius:12px;border:1px solid rgba(108,99,255,0.2);padding:0;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Login Details</p>
                    <p style="margin:0;color:#fff;font-size:14px;">📅 <strong>${loginTime} IST</strong></p>
                    <p style="margin:8px 0 0;color:#fff;font-size:14px;">🔑 <strong>Method:</strong> Google OAuth 2.0</p>
                  </td>
                </tr>
              </table>

              <p style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center;margin:24px 0 0;line-height:1.6;">
                If this was you, no action needed. 
                If not, please secure your account immediately.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 40px 28px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;">© 2025 NexChat · Built with ❤️</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Login notification email sent to ${to}`);
};

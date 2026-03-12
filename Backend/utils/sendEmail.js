const nodemailer = require("nodemailer");
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"HireHelper" <${process.env.SENDER_EMAIL}>`, // Use verified sender
      to,
      subject,
      text
    });

    console.log("Email sent successfully: ", info.messageId);
  } catch (error) {
    console.error("Nodemailer Error:", error.message);
    throw new Error("Email could not be sent"); // This passes the error to authRoutes
  }
};

module.exports = sendEmail;
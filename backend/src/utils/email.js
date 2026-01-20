const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Config Mailtrap diambil dari .env
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAIL_USER, // 👇 Aman
      pass: process.env.MAIL_PASS  // 👇 Aman
    }
  });

  const mailOptions = {
    from: '"Dompetku Security" <security@dompetku.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
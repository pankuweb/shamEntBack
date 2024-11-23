const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pankajrajsain@gmail.com",
      pass: "PHP$work!@#",
    },
  });

  // 2) Define the email options
  let mailOptions = {
    from: "dhakadcinema@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await mailTransporter.sendMail(mailOptions);
};

module.exports = sendEmail;

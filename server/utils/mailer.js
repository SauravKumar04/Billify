const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL;
  const pass = process.env.APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("EMAIL or APP_PASSWORD is not set");
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
};

module.exports = { getTransporter };

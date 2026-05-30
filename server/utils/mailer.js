const nodemailer = require("nodemailer");
const dns = require("dns");

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

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
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
    requireTLS: true,
    tls: {
      servername: "smtp.gmail.com",
      minVersion: "TLSv1.2",
    },
  });

  return transporter;
};

module.exports = { getTransporter };

const nodemailer = require("nodemailer");
const config = require("../config/config");
const eConfig = config.EMAIL;
const sendEmail = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: eConfig.host,
    //   service: process.env.SERVICE,
    //   port: 587,
      port: 2525,
    //   secure: true,
      auth: {
        user: eConfig.user,
        pass: eConfig.pass,
      },
    });

    await transporter.sendMail({
      from: eConfig.from,
      to: email,
      subject: subject,
      // text: text,
      html: html
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
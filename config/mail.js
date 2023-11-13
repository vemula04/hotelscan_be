const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4fc722bab93a19",
      pass: "fddfa7bc5b41e6"
    }
  });

  module.exports = transport

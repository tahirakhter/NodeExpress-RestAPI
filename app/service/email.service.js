'use strict';
const nodemailer = require('nodemailer');
const fs = require('fs').promises;

// configure email to send
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }, tls: {
    rejectUnauthorized: false
  }
});

module.exports.sendEmail = async(data) => {
  if (data) {
    // load template
    let fsReadFileHtml = await fs.readFile('././app/emailTemplates/resetPassword.html', 'utf8');
    fsReadFileHtml = fsReadFileHtml.replace('passwordResetOTP', data.otp);

    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: process.env.EMAIL_USER, // sender email
        to: data.to, // receiver email
        subject: data.subject,
        html: fsReadFileHtml
      };

      // sending email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(new Error('failed to send email!'));
        }
        else {
          resolve({ message: 'email has been sent successfully!' });
        }
      });
    });
  }
};

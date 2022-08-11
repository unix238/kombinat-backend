const nodemailer = require('nodemailer');

class EmailSender {
  static async sendEmail(to, subject, text) {
    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testsendingactivationcode@gmail.com',
        pass: 'endybqxlamybvqih',
      },
    });

    let mailDetails = {
      from: 'testsendingactivationcode@gmail.com',
      to: to,
      subject: subject,
      text: text,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log('Error Occurs');
      } else {
        console.log('Email sent successfully');
      }
    });
  }
}

module.exports = EmailSender;

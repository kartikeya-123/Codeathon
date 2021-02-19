const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, token) {
    (this.to = user.email),
      (this.name = user.name),
      (this.token = token),
      (this.from = 'Postbox <raj.karthikeya2002@gmail.com>');
  }

  //creating a transporter//
  newTransport() {
    //using sedngrid
    // console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'development') {
      console.log('in production mode');
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  //sending email//
  async send(subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  // different uses//
  async sendWelcome() {
    await this.send(
      'Welcome ',
      `Glad to see you at POSTBOX , your welcome token is ${this.token}`
    );
  }
  async sendResetToken() {
    await this.send(
      'Welcome ',
      `Glad to see you at POSTBOX , your password token is ${this.token}`
    );
  }
};

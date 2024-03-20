import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { Email } from './email';

// const transporter = nodemailer.createTransport({
//     host: 'smtp.forwardemail.net',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'my_user',
//         pass: 'my_password',
//     },
// });

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

const emailHtml = render(<Email url="https://example.com" />);

const options = {
    from: 'you@example.com',
    to: 'user@gmail.com',
    subject: 'hello world',
    html: emailHtml,
};

await transporter.sendMail(options);

import nodemailer from 'nodemailer';

export default async (options = {}) => {
  if (!(options.emails || []).length) {
    return;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secureConnection: 'false',
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    auth: {
      user,
      pass: password,
    },
  });

  const getOption = email => ({
    ...options,
    from,
    to: email,
  });

  await Promise.all(
    options.emails.map(email => transporter.sendMail(getOption(email)).catch(e => e)),
  );
};
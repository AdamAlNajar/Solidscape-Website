require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname)));

// Configure nodemailer transporter
// Uses SMTP settings from .env: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
let transporter;
try {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user;

  if (!host || !user || !pass) {
    console.warn('Email configuration incomplete. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env');
  } else {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    // Verify connection successfully
    transporter.verify((error) => {
      if (error) {
        console.warn('SMTP connection warning:', error.message);
      } else {
        console.log('SMTP server ready to send mail');
      }
    });
  }
} catch (err) {
  console.error('Failed to configure nodemailer:', err.message);
}

/**
 * POST /api/contact
 * Receives form data and sends it via email using nodemailer.
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, phone = '', subject, message } = req.body || {};

  // Validate required fields
  if (![name, email, subject, message].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }

  // Validate field lengths
  if (name.length > 120 || email.length > 254 || phone.length > 40 || subject.length > 120 || message.length > 4000) {
    return res.status(400).json({ error: 'One or more fields are too long.' });
  }

  // Check that email transport is configured
  if (!transporter) {
    console.error('Email transporter is not configured.');
    return res.status(503).json({ error: 'Contact form is not configured yet.' });
  }

  // Sanitize inputs to prevent header injection
  const safe = value => String(value).replace(/[@]/g, '@u200b');

  const mailOptions = {
    from: `"Solidscape enquiry" <${process.env.EMAIL_FROM || email}>`,
    to: process.env.EMAIL_TO || 'info@solidscape.com',
    replyTo: email,
    subject: `[Solidscape] ${safe(subject.trim())}`,
    text: `
New Solidscape website enquiry

Name: ${safe(name.trim())}
Email: ${safe(email.trim())}
Phone: ${safe(phone.trim() || 'Not provided')}
Project type: ${safe(subject.trim())}
Message: ${safe(message.trim())}
`,
    // Simple plain-text only - no HTML to keep it safe and readable
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return res.json({ ok: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email delivery failed:', error.message);
    return res.status(502).json({ error: 'Unable to deliver your enquiry.' });
  }
});

app.listen(PORT, () => console.log(`Solidscape website running at http://localhost:${PORT}`));
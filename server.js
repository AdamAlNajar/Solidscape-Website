/*
  Solidscape Contracting LTD - Express server.
  Serves the static site and handles the contact form at POST /api/contact.
  Run with: npm start  (settings are read from .env - see .env.example)
*/
require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '20kb' }));
// Serve only the public site files - never .env, server.js, package.json etc.
const PUBLIC_FILES = ['index.html', 'about.html', 'showcase.html', 'contactus.html', 'styles.css', 'script.js'];
PUBLIC_FILES.forEach(file => app.get(file === 'index.html' ? ['/', '/index.html'] : `/${file}`,
  (req, res) => res.sendFile(path.join(__dirname, file))));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Configure nodemailer transporter
// Uses SMTP settings from .env: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS (optional: EMAIL_FROM, EMAIL_TO)
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
 * Receives the contact form as JSON, validates it again on the server
 * (never trust the browser alone), then emails it to the company.
 */
app.post('/api/contact', async (req, res) => {
  const {
    name, email, phone = '', subject, message,
    contactMethod = 'Email', startDate = ''
  } = req.body || {};

  // Presence check: required fields must be non-empty strings
  if (![name, email, subject, message].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }

  // Length checks - same limits as script.js
  if (name.length > 120 || email.length > 254 || String(phone).length > 40 ||
      subject.length > 120 || message.length > 4000) {
    return res.status(400).json({ error: 'One or more fields are too long.' });
  }
  if (message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters.' });
  }

  // Format check for the email address
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Only accept the three reply options offered on the form
  if (!['Email', 'Phone call', 'WhatsApp'].includes(contactMethod)) {
    return res.status(400).json({ error: 'Invalid contact method.' });
  }

  // Check that email transport is configured
  if (!transporter) {
    console.error('Email transporter is not configured.');
    return res.status(503).json({ error: 'Contact form is not configured yet.' });
  }

  // Strip line breaks so a visitor cannot inject extra email headers via the subject line
  const oneLine = value => String(value).replace(/[\r\n]+/g, ' ').trim();

  const mailOptions = {
    // Send from our own account (sending "from" the visitor's address is rejected by most mail servers)
    from: `"Solidscape website" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || 'contact@solidscape-uae.com',
    replyTo: oneLine(email),
    subject: `[Solidscape] ${oneLine(subject)} - ${oneLine(name)}`,
    // Plain text only - no HTML, so nothing the visitor typed can be rendered as markup
    text: `New Solidscape website enquiry

Name: ${oneLine(name)}
Email: ${oneLine(email)}
Phone: ${oneLine(phone) || 'Not provided'}
Preferred reply: ${oneLine(contactMethod)}
Preferred start date: ${oneLine(startDate) || 'Not specified'}
Project type: ${oneLine(subject)}

Message:
${message.trim()}
`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Email delivery failed:', error.message);
    return res.status(502).json({ error: 'Unable to deliver your enquiry.' });
  }
});

app.listen(PORT, () => console.log(`Solidscape website running at http://localhost:${PORT}`));
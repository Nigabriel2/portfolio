// POST /api/contact — sends the contact-form message to Gabriel's inbox.
// Works both as a Vercel serverless function and as an Express handler (see server.js).
const nodemailer = require('nodemailer');

const MAX_LEN = { name: 120, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  // Vercel and Express (with express.json()) both pre-parse JSON bodies.
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise(function (resolve) {
    var raw = '';
    req.on('data', function (chunk) { raw += chunk; if (raw.length > 1e6) req.destroy(); });
    req.on('end', function () {
      try { resolve(JSON.parse(raw || '{}')); } catch (e) { resolve({}); }
    });
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed.' });
  }

  const body = await readBody(req);
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const honeypot = String(body.company || '').trim();

  // Bots fill the hidden "company" field — accept silently and drop.
  if (honeypot) return send(res, 200, { ok: true });

  if (!name || !email || !message) {
    return send(res, 400, { error: 'Please fill in all fields.' });
  }
  if (!EMAIL_RE.test(email)) {
    return send(res, 400, { error: 'Please enter a valid email address.' });
  }
  if (name.length > MAX_LEN.name || email.length > MAX_LEN.email || message.length > MAX_LEN.message) {
    return send(res, 400, { error: 'Message is too long.' });
  }

  // Trim stray whitespace and strip the spaces Google displays inside app
  // passwords ("abcd efgh ijkl mnop") — pasting them as-is breaks SMTP auth.
  const smtpUser = (process.env.GMAIL_USER || '').trim();
  const smtpPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  if (!smtpUser || !smtpPass) {
    console.error('contact: GMAIL_USER / GMAIL_APP_PASSWORD env vars are not set');
    return send(res, 500, { error: 'The contact service is not configured yet. Please try again later.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpUser, pass: smtpPass }
  });

  try {
    await transporter.sendMail({
      from: '"Portfolio contact" <' + smtpUser + '>',
      to: process.env.CONTACT_EMAIL || 'niyomugabogabriel0@gmail.com',
      replyTo: name + ' <' + email + '>',
      subject: 'Portfolio contact from ' + name,
      text: message + '\n\n— ' + name + ' (' + email + ')'
    });
    return send(res, 200, { ok: true });
  } catch (err) {
    // Full detail lands in the Vercel function logs for the site owner.
    console.error('contact: failed to send email:', {
      code: err && err.code,
      responseCode: err && err.responseCode,
      message: err && err.message,
      response: err && err.response
    });
    if (err && err.code === 'EAUTH') {
      console.error('contact: EAUTH means Gmail rejected the login — verify that '
        + 'GMAIL_APP_PASSWORD is an App Password (not the normal account password), '
        + 'that 2-Step Verification is enabled, and that GMAIL_USER matches the '
        + 'account the app password was created for.');
    }
    return send(res, 502, { error: 'Could not send your message right now. Please try again later.' });
  }
};

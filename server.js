// Local development server. In production (Vercel), static files in public/
// are served by the CDN and api/contact.js runs as a serverless function —
// this Express app mirrors that setup for local work.
const path = require('path');
const express = require('express');
const contact = require('./api/contact.js');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.post('/api/contact', contact);
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Portfolio running at http://localhost:' + port);
});

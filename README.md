# Niyomugabo Gabriel — Portfolio

Node.js portfolio site. Static pages live in `public/`; the contact form posts to
`api/contact.js`, which emails the message directly — visitors never leave the site.

## Run locally

```bash
npm install
npm start          # http://localhost:3000
```

## Email configuration (required for the contact form)

The contact API sends mail through Gmail SMTP. Set these environment variables —
locally in your shell, and on Vercel under **Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `GMAIL_USER` | The Gmail address that sends the mail (e.g. `niyomugabogabriel0@gmail.com`) |
| `GMAIL_APP_PASSWORD` | A Gmail **App Password** — create one at Google Account → Security → 2-Step Verification → App passwords |
| `CONTACT_EMAIL` | (optional) Where messages are delivered; defaults to `niyomugabogabriel0@gmail.com` |

After adding the variables on Vercel, redeploy for them to take effect.
Until they are set, the form shows "The contact service is not configured yet."

## Deployment

Hosted on Vercel. Every push to `main` deploys automatically:
`public/` is served as static files and `api/contact.js` becomes a serverless function.

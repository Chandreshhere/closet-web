import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, subject, message } = req.body

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,   // your Gmail address
      pass: process.env.EMAIL_PASS,   // Gmail App Password (not your regular password)
    },
  })

  try {
    await transporter.sendMail({
      from: `"ClosetX Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: subject ? `[ClosetX] ${subject}` : `[ClosetX] New message from ${name}`,
      html: `
        <div style="font-family:helvetica,arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;border-radius:8px;">
          <h1 style="font-size:2rem;font-weight:900;letter-spacing:-0.04em;margin:0 0 8px;">
            NEW MESSAGE<br><span style="color:#2400ff;">RECEIVED.</span>
          </h1>
          <p style="color:rgba(255,255,255,0.45);font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 32px;">
            Via ClosetX Contact Form
          </p>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);width:120px;color:rgba(255,255,255,0.45);font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;vertical-align:top;">NAME</td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.45);font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;vertical-align:top;">EMAIL</td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);"><a href="mailto:${email}" style="color:#2400ff;">${email}</a></td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.45);font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;vertical-align:top;">SUBJECT</td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);">${subject}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:16px 0;color:rgba(255,255,255,0.45);font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;vertical-align:top;">MESSAGE</td>
              <td style="padding:16px 0;line-height:1.7;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>

          <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);font-size:0.7rem;color:rgba(255,255,255,0.3);letter-spacing:0.1em;">
            CLOSETX · INDORE · WORLDWIDE
          </div>
        </div>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Mail error:', err)
    return res.status(500).json({ error: 'Failed to send message. Please try again.' })
  }
}

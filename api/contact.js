const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    // Only POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://alai.no');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Parse body — handle both pre-parsed and raw
    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
    }
    const { name, email, message, _honey } = body || {};

    // Honeypot — bots fill hidden fields
    if (_honey) {
        // Silently accept but don't process
        return res.status(200).json({ ok: true });
    }

    // Validate
    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Basic length limits
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
        return res.status(400).json({ error: 'Input too long' });
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Sanitize for HTML
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const htmlBody = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#09090b;color:#fafafa;padding:24px 32px;border-radius:12px 12px 0 0;">
                <h2 style="margin:0;color:#00E5A0;font-size:20px;">New Contact Form Submission</h2>
                <p style="margin:8px 0 0;color:#888;font-size:14px;">alai.no — ${new Date().toISOString().split('T')[0]}</p>
            </div>
            <div style="background:#f8f9fa;padding:24px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
                <table style="width:100%;border-collapse:collapse;">
                    <tr><td style="padding:8px 0;color:#666;font-weight:600;width:80px;vertical-align:top;">Name</td><td style="padding:8px 0;">${esc(name.trim())}</td></tr>
                    <tr><td style="padding:8px 0;color:#666;font-weight:600;vertical-align:top;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(email.trim())}" style="color:#0ea5e9;">${esc(email.trim())}</a></td></tr>
                    <tr><td style="padding:8px 0;color:#666;font-weight:600;vertical-align:top;">Message</td><td style="padding:8px 0;white-space:pre-wrap;">${esc(message.trim())}</td></tr>
                </table>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;">
                <p style="color:#999;font-size:12px;margin:0;">Reply directly to this email to respond to ${esc(name.trim())}.</p>
            </div>
        </div>
    `;

    try {
        // Verify connection first
        await transporter.verify();

        await transporter.sendMail({
            from: `"ALAI Website" <${process.env.SMTP_USER}>`,
            to: 'info@alai.no',
            replyTo: email.trim(),
            subject: `[alai.no] Contact: ${name.trim().substring(0, 50)}`,
            text: `New contact form submission from alai.no\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nMessage:\n${message.trim()}`,
            html: htmlBody
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('SMTP error:', err.code, err.message);
        return res.status(500).json({ error: 'Failed to send message. Please email info@alai.no directly.' });
    }
};

// Cloudflare Pages Function — POST /api/contact
// Sends email via SMTP (one.com) to info@alai.no

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS
    const headers = {
        'Access-Control-Allow-Origin': 'https://alai.no',
        'Content-Type': 'application/json',
    };

    let body;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers });
    }

    const { name, email, message, _honey } = body || {};

    // Honeypot — bots fill hidden fields
    if (_honey) {
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    // Validate
    if (!name || !name.trim()) {
        return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400, headers });
    }
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(JSON.stringify({ error: 'Valid email is required' }), { status: 400, headers });
    }
    if (!message || !message.trim()) {
        return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400, headers });
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
        return new Response(JSON.stringify({ error: 'Input too long' }), { status: 400, headers });
    }

    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const today = new Date().toISOString().split('T')[0];

    const htmlBody = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#09090b;color:#fafafa;padding:24px 32px;border-radius:12px 12px 0 0;">
                <h2 style="margin:0;color:#00E5A0;font-size:20px;">New Contact Form Submission</h2>
                <p style="margin:8px 0 0;color:#888;font-size:14px;">alai.no — ${today}</p>
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

    // Send via SMTP using MailChannels (Cloudflare Pages native) or direct SMTP via fetch
    // Using MailChannels — zero configuration needed on CF Pages (free, reliable)
    const mailPayload = {
        personalizations: [{
            to: [{ email: 'info@alai.no', name: 'ALAI' }],
            reply_to: { email: email.trim(), name: name.trim() },
        }],
        from: { email: 'noreply@alai.no', name: 'ALAI Website' },
        subject: `[alai.no] Contact: ${name.trim().substring(0, 50)}`,
        content: [
            {
                type: 'text/plain',
                value: `New contact form submission from alai.no\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nMessage:\n${message.trim()}`,
            },
            {
                type: 'text/html',
                value: htmlBody,
            },
        ],
    };

    try {
        const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mailPayload),
        });

        if (!resp.ok) {
            const errText = await resp.text();
            console.error('MailChannels error:', resp.status, errText);
            return new Response(
                JSON.stringify({ error: 'Failed to send. Please email info@alai.no directly.' }),
                { status: 500, headers }
            );
        }

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (err) {
        console.error('Send error:', err.message);
        return new Response(
            JSON.stringify({ error: 'Failed to send. Please email info@alai.no directly.' }),
            { status: 500, headers }
        );
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'https://alai.no',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

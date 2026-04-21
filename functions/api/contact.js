// Cloudflare Pages Function — POST /api/contact
// Uses MailChannels API (free via Cloudflare Pages, no API key required)
// MC #8587 incident fix — 2026-04-21

export async function onRequestPost(context) {
    const { request, env } = context;

    // Allow both production domain and Pages preview subdomain
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = ['https://alai.no', 'https://alai-web.pages.dev'];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://alai.no';

    const headers = {
        'Access-Control-Allow-Origin': corsOrigin,
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

    // Server-side validation
    if (!name || !String(name).trim()) {
        return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400, headers });
    }
    if (!email || !String(email).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(JSON.stringify({ error: 'Valid email is required' }), { status: 400, headers });
    }
    if (!message || !String(message).trim()) {
        return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400, headers });
    }

    // Length limits
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
        return new Response(JSON.stringify({ error: 'Input too long' }), { status: 400, headers });
    }

    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const nameT = String(name).trim();
    const emailT = String(email).trim();
    const messageT = String(message).trim();
    const dateStr = new Date().toISOString().split('T')[0];

    const htmlBody = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#09090b;color:#fafafa;padding:24px 32px;border-radius:12px 12px 0 0;">
                <h2 style="margin:0;color:#00E5A0;font-size:20px;">New Contact Form Submission</h2>
                <p style="margin:8px 0 0;color:#888;font-size:14px;">alai.no — ${dateStr}</p>
            </div>
            <div style="background:#f8f9fa;padding:24px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
                <table style="width:100%;border-collapse:collapse;">
                    <tr><td style="padding:8px 0;color:#666;font-weight:600;width:80px;vertical-align:top;">Name</td><td style="padding:8px 0;">${esc(nameT)}</td></tr>
                    <tr><td style="padding:8px 0;color:#666;font-weight:600;vertical-align:top;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(emailT)}" style="color:#0ea5e9;">${esc(emailT)}</a></td></tr>
                    <tr><td style="padding:8px 0;color:#666;font-weight:600;vertical-align:top;">Message</td><td style="padding:8px 0;white-space:pre-wrap;">${esc(messageT)}</td></tr>
                </table>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;">
                <p style="color:#999;font-size:12px;margin:0;">Reply directly to this email to respond to ${esc(nameT)}.</p>
            </div>
        </div>
    `;

    const textBody = `New contact form submission from alai.no\n\nName: ${nameT}\nEmail: ${emailT}\nMessage:\n${messageT}`;

    // Send via MailChannels (free on Cloudflare Pages/Workers — no API key needed)
    const mailPayload = {
        personalizations: [
            {
                to: [{ email: 'info@alai.no', name: 'ALAI' }],
                reply_to: { email: emailT, name: nameT },
            },
        ],
        from: { email: 'noreply@alai.no', name: 'ALAI Website' },
        subject: `[alai.no] Contact: ${nameT.substring(0, 50)}`,
        content: [
            { type: 'text/plain', value: textBody },
            { type: 'text/html', value: htmlBody },
        ],
    };

    try {
        const mcResp = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mailPayload),
        });

        // MailChannels returns 202 on success, no body
        if (mcResp.status === 202 || mcResp.ok) {
            return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
        }

        // Log failure details
        const errText = await mcResp.text().catch(() => '');
        console.error('MailChannels error:', mcResp.status, errText);

        return new Response(
            JSON.stringify({ error: 'Failed to send. Please email info@alai.no directly.', _status: mcResp.status }),
            { status: 500, headers }
        );
    } catch (err) {
        console.error('Contact function fetch error:', err.message);
        return new Response(
            JSON.stringify({ error: 'Failed to send. Please email info@alai.no directly.' }),
            { status: 500, headers }
        );
    }
}

export async function onRequestOptions(context) {
    const origin = context.request.headers.get('Origin') || '';
    const allowedOrigins = ['https://alai.no', 'https://alai-web.pages.dev'];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://alai.no';
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

// Cloudflare Pages Function — POST /api/contact
// Proxies to backend contact handler (Node.js + nodemailer + one.com SMTP)
// MC #8587 incident fix — 2026-04-21
// Change: index.html now calls /api/contact (relative), function proxies to backend

const BACKEND_URL = 'https://api.basicconsulting.no/contact';

export async function onRequestPost(context) {
    const { request } = context;

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

    const { name, email, message } = body || {};

    // Basic server-side validation before proxying
    if (!name || !String(name).trim()) {
        return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400, headers });
    }
    if (!email || !String(email).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(JSON.stringify({ error: 'Valid email is required' }), { status: 400, headers });
    }
    if (!message || !String(message).trim()) {
        return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400, headers });
    }

    try {
        const resp = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await resp.json();

        return new Response(JSON.stringify(data), {
            status: resp.ok ? 200 : resp.status,
            headers,
        });
    } catch (err) {
        console.error('Contact proxy error:', err.message);
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

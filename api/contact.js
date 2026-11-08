module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message, website } = req.body || {};

    // Honeypot: real users never fill this hidden field
    if (website) return res.status(200).json({ ok: true });

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    if (message.length > 5000) {
        return res.status(400).json({ error: 'Message too long' });
    }

    const esc = (s) =>
        String(s).replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));

    try {
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Portfolio <onboarding@resend.dev>',
                to: [process.env.CONTACT_TO_EMAIL],
                reply_to: email,
                subject: `New portfolio message from ${name}`,
                html: `<p><b>Name:</b> ${esc(name)}</p>
               <p><b>Email:</b> ${esc(email)}</p>
               <p><b>Message:</b><br>${esc(message).replace(/\n/g, '<br>')}</p>`
            })
        });

        if (!r.ok) return res.status(502).json({ error: 'Failed to send email' });
        return res.status(200).json({ ok: true });
    } catch (e) {
        return res.status(500).json({ error: 'Server error' });
    }
};
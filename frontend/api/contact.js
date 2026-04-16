const RESEND_API_URL = 'https://api.resend.com/emails'

function json(res, status, payload) {
    res.status(status).setHeader('Content-Type', 'application/json')
    return res.send(JSON.stringify(payload))
}

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Allow', 'POST, OPTIONS')
        return res.status(204).send('')
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS')
        return json(res, 405, { error: 'Method not allowed' })
    }

    const { name, org, usecase, message, email } = req.body ?? {}

    if (!name || !message) {
        return json(res, 400, { error: 'name and message are required' })
    }

    if (!process.env.RESEND_API_KEY) {
        console.log('[contact] No RESEND_API_KEY - logging submission:', { name, org, usecase, message, email })
        return json(res, 200, { ok: true, note: 'logged (no API key)' })
    }

    try {
        const response = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: process.env.CONTACT_FROM_EMAIL || 'SolarNexa Contact <onboarding@resend.dev>',
                to: [process.env.CONTACT_TO_EMAIL || 'contact@solarnexa.in'],
                reply_to: email || undefined,
                subject: `New inquiry from ${name}${org ? ` - ${org}` : ''}`,
                html: `
          <div style="font-family:sans-serif;max-width:560px">
            <h2 style="color:#D93B2B;margin-bottom:4px">SolarNexa - New Inquiry</h2>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
            <p><strong>Name:</strong> ${name}</p>
            ${org ? `<p><strong>Organisation:</strong> ${org}</p>` : ''}
            ${usecase ? `<p><strong>Use case:</strong> ${usecase}</p>` : ''}
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
            <p style="white-space:pre-wrap">${message}</p>
          </div>
        `,
            }),
        })

        if (!response.ok) {
            const errBody = await response.text()
            console.error('[contact] Resend API error:', response.status, errBody)
            return json(res, 500, { error: 'Failed to send - please email us directly at contact@solarnexa.in' })
        }

        return json(res, 200, { ok: true })
    } catch (err) {
        console.error('[contact] Unexpected error:', err)
        return json(res, 500, { error: 'Failed to send - please email us directly at contact@solarnexa.in' })
    }
}

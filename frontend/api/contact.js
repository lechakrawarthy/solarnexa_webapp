const RESEND_API_URL = 'https://api.resend.com/emails'
const DEFAULT_FROM = 'SolarNexa Contact <onboarding@resend.dev>'
const DEFAULT_TEST_TO = 'chakravarthi1597@gmail.com'

function json(res, status, payload) {
    res.status(status).setHeader('Content-Type', 'application/json')
    return res.send(JSON.stringify(payload))
}

function getProviderErrorDetail(raw) {
    if (!raw) return 'Unknown provider error'
    try {
        const parsed = JSON.parse(raw)
        return parsed?.message || parsed?.error || raw
    } catch {
        return raw
    }
}

function isResendTestingRecipientError(detail) {
    return String(detail || '').toLowerCase().includes('you can only send testing emails to your own email address')
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

    const configuredFrom = (process.env.CONTACT_FROM_EMAIL || '').trim()
    const normalizedFrom = configuredFrom.toLowerCase()
    const from = !configuredFrom || normalizedFrom.includes('@gmail.com')
        ? DEFAULT_FROM
        : configuredFrom

    try {
        const primaryTo = (process.env.CONTACT_TO_EMAIL || '').trim() || DEFAULT_TEST_TO
        const testTo = (process.env.RESEND_TEST_TO_EMAIL || '').trim() || DEFAULT_TEST_TO

        const basePayload = {
            to: [primaryTo],
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
        }

        const sendWithFrom = (sender, toAddress = primaryTo) => fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...basePayload, from: sender, to: [toAddress] }),
        })

        let response = await sendWithFrom(from)

        if (!response.ok && from !== DEFAULT_FROM) {
            const firstError = await response.text()
            console.error('[contact] Primary sender failed, retrying with default sender:', response.status, firstError)
            response = await sendWithFrom(DEFAULT_FROM)
        }

        if (!response.ok) {
            const firstRecipientError = await response.text()
            const detail = getProviderErrorDetail(firstRecipientError)
            if (isResendTestingRecipientError(detail) && primaryTo.toLowerCase() !== testTo.toLowerCase()) {
                console.error('[contact] Recipient blocked in testing mode, retrying with test recipient:', testTo)
                response = await sendWithFrom(DEFAULT_FROM, testTo)
            } else {
                console.error('[contact] Resend API error:', response.status, detail)
                return json(res, 500, { error: `Failed to send - ${detail}` })
            }
        }

        if (!response.ok) {
            const errBody = await response.text()
            const detail = getProviderErrorDetail(errBody)
            console.error('[contact] Resend API error:', response.status, detail)
            return json(res, 500, { error: `Failed to send - ${detail}` })
        }

        return json(res, 200, { ok: true })
    } catch (err) {
        console.error('[contact] Unexpected error:', err)
        return json(res, 500, { error: `Failed to send - ${err?.message || 'Unexpected server error'}` })
    }
}

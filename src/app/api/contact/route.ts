import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      )
    }

    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      return Response.json(
        { error: 'Contact email not configured' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Apex Physics <onboarding@resend.dev>',
      to: contactEmail,
      subject: `[Apex Physics Contact] Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

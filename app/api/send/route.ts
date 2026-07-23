import prisma from '@/prisma/script'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, Email and Message are required' },
        { status: 400 },
      )
    }

    const form = await prisma.form.create({
      data: {
        name,
        email,
        message,
      },
    })

    return NextResponse.json(
      {
        message: 'Form submitted successfully',
        form,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Form submission error:', error)

    return NextResponse.json(
      { error: 'An error occurred while processing the form submission' },
      { status: 500 },
    )
  }
}


export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ forms }, { status: 200 })
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching the forms' },
      { status: 500 },
    )
  }
}

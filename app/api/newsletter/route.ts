import { NextResponse } from 'next/server'
import prisma from '@/prisma/script'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'
export const maxDuration = 120

function escapeHtml(value: string | null | undefined): string {
  if (!value) return ''

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: Request) {
  try {
    // ---------------------------------------------------------
    // 1. Validate request
    // ---------------------------------------------------------

    const body = await req.json()

    const articleIds: string[] = Array.isArray(body.articleIds)
      ? body.articleIds.filter(
          (id: unknown): id is string =>
            typeof id === 'string' && id.trim().length > 0,
        )
      : []

    const uniqueArticleIds: string[] = [...new Set(articleIds)]

    if (uniqueArticleIds.length === 0) {
      return NextResponse.json(
        {
          error: 'At least one article must be selected.',
        },
        {
          status: 400,
        },
      )
    }

    // ---------------------------------------------------------
    // 2. Get selected published articles
    // ---------------------------------------------------------

    const articles = await prisma.article.findMany({
      where: {
        id: {
          in: uniqueArticleIds,
        },
        published: true,
      },
    })

    if (articles.length === 0) {
      return NextResponse.json(
        {
          error: 'No published articles were found.',
        },
        {
          status: 404,
        },
      )
    }

    // Preserve the exact order selected in the admin panel
    const orderedArticles = uniqueArticleIds
      .map((id) => articles.find((article) => article.id === id))
      .filter((article): article is (typeof articles)[number] =>
        Boolean(article),
      )

    if (orderedArticles.length === 0) {
      return NextResponse.json(
        {
          error: 'No valid published articles were found.',
        },
        {
          status: 404,
        },
      )
    }

    // ---------------------------------------------------------
    // 3. Get active subscribers
    // ---------------------------------------------------------

    const activeSubscribers = await prisma.subscription.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        email: true,
      },
    })

    if (activeSubscribers.length === 0) {
      return NextResponse.json(
        {
          error: 'No active subscribers found in queue.',
        },
        {
          status: 400,
        },
      )
    }

    // ---------------------------------------------------------
    // 4. Check Gmail configuration
    // ---------------------------------------------------------

    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpUser || !smtpPass) {
      console.error('SMTP_USER or SMTP_PASS is missing.')

      return NextResponse.json(
        {
          error:
            'Email system is not configured. SMTP_USER or SMTP_PASS is missing.',
        },
        {
          status: 500,
        },
      )
    }

    // ---------------------------------------------------------
    // 5. Create Gmail transporter
    // ---------------------------------------------------------

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'educationwithhamza@gmail.com',
        pass: 'spjndqrqexsjouhe',
      },
    })

    // ---------------------------------------------------------
    // 6. Verify Gmail connection
    // ---------------------------------------------------------

    try {
      await transporter.verify()

      console.log('Gmail SMTP connection verified successfully.')
    } catch (smtpError) {
      console.error('Gmail SMTP verification failed:', smtpError)

      return NextResponse.json(
        {
          error:
            'Could not connect to Gmail. Please check SMTP_USER and SMTP_PASS.',
        },
        {
          status: 500,
        },
      )
    }

    // ---------------------------------------------------------
    // 7. Build article sections
    // ---------------------------------------------------------

    const articleSections = orderedArticles
      .map((article, index) => {
        const title = escapeHtml(article.title)

        const shortDesc = escapeHtml(article.short_desc)

        const image = article.image ? escapeHtml(article.image) : null

        const articleUrl = `https://www.blog.ewhamza.com/articles/${encodeURIComponent(
          article.slug,
        )}`

        return `
          <tr>
            <td style="padding: 0 32px;">
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="
                  width: 100%;
                  border-bottom: 1px solid #F0ECE1;
                "
              >
                <tbody>

                  ${
                    image
                      ? `
                    <tr>
                      <td style="padding: 24px 0 0 0;">
                        <img
                          src="${image}"
                          alt="${title}"
                          width="100%"
                          style="
                            width: 100%;
                            height: auto;
                            max-height: 260px;
                            object-fit: cover;
                            border-radius: 8px;
                            display: block;
                          "
                        />
                      </td>
                    </tr>
                  `
                      : ''
                  }

                  <tr>
                    <td style="padding: 24px 0 32px 0;">

                      <div
                        style="
                          font-size: 11px;
                          color: #8C887B;
                          font-family: Arial, sans-serif;
                          margin-bottom: 8px;
                          text-transform: uppercase;
                          letter-spacing: 0.5px;
                        "
                      >
                        Article ${index + 1}
                      </div>

                      <h2
                        style="
                          font-size: 21px;
                          line-height: 1.35;
                          font-weight: bold;
                          margin: 0 0 12px 0;
                          color: #1A1A18;
                          font-family: Georgia, serif;
                        "
                      >
                        ${title}
                      </h2>

                      ${
                        shortDesc
                          ? `
                        <p
                          style="
                            font-size: 14px;
                            line-height: 1.6;
                            color: #4A4843;
                            font-family: Arial, sans-serif;
                            margin: 0 0 20px 0;
                          "
                        >
                          ${shortDesc}
                        </p>
                      `
                          : ''
                      }

                      <table
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              style="
                                background-color: #1A1A18;
                                border-radius: 6px;
                              "
                            >
                              <a
                                href="${articleUrl}"
                                target="_blank"
                                style="
                                  display: inline-block;
                                  padding: 11px 22px;
                                  font-size: 13px;
                                  color: #ffffff;
                                  text-decoration: none;
                                  font-weight: bold;
                                  font-family: Arial, sans-serif;
                                "
                              >
                                Read Full Article →
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                    </td>
                  </tr>

                </tbody>
              </table>
            </td>
          </tr>
        `
      })
      .join('')

    // ---------------------------------------------------------
    // 8. Newsletter subject
    // ---------------------------------------------------------

    const subject =
      orderedArticles.length === 1
        ? orderedArticles[0].title
        : `Education With Hamza — ${orderedArticles.length} New Articles`

    // ---------------------------------------------------------
    // 9. Complete newsletter HTML
    // ---------------------------------------------------------

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>${escapeHtml(subject)}</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 24px 12px;
            background-color: #F5F2ED;
            font-family: Georgia, serif;
          "
        >

          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="width: 100%;"
          >
            <tbody>

              <tr>
                <td align="center">

                  <table
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="
                      max-width: 560px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      border-radius: 12px;
                      border: 1px solid #E0DCD5;
                      font-family: Georgia, serif;
                      color: #1A1A18;
                      overflow: hidden;
                    "
                  >

                    <tbody>

                      <!-- HEADER -->

                      <tr>
                        <td
                          style="
                            padding: 32px 32px 18px 32px;
                            border-bottom: 1px solid #F0ECE1;
                          "
                        >

                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                          >
                            <tbody>

                              <tr>

                                <td
                                  style="
                                    font-size: 20px;
                                    font-weight: bold;
                                    color: #1A1A18;
                                  "
                                >
                                  Education With Hamza
                                </td>

                                <td
                                  align="right"
                                  style="
                                    font-size: 11px;
                                    color: #8C887B;
                                    font-family: Arial, sans-serif;
                                    letter-spacing: 0.5px;
                                  "
                                >
                                  NEWSLETTER
                                </td>

                              </tr>

                            </tbody>
                          </table>

                        </td>
                      </tr>


                      <!-- INTRO -->

                      <tr>
                        <td
                          style="
                            padding: 26px 32px 8px 32px;
                          "
                        >

                          <h1
                            style="
                              font-size: 24px;
                              line-height: 1.3;
                              margin: 0 0 8px 0;
                              color: #1A1A18;
                              font-weight: bold;
                            "
                          >
                            Latest from Education With Hamza
                          </h1>

                          <p
                            style="
                              margin: 0;
                              font-size: 14px;
                              line-height: 1.6;
                              color: #6B675F;
                              font-family: Arial, sans-serif;
                            "
                          >
                            Here are the latest articles and educational
                            resources from Education With Hamza.
                          </p>

                        </td>
                      </tr>


                      <!-- SELECTED ARTICLES -->

                      ${articleSections}


                      <!-- FOOTER -->

                      <tr>
                        <td
                          style="
                            background-color: #FAF8F5;
                            padding: 24px 32px;
                            border-top: 1px solid #F0ECE1;
                            text-align: center;
                            font-size: 11px;
                            line-height: 1.6;
                            color: #8C887B;
                            font-family: Arial, sans-serif;
                          "
                        >
                          You received this email because you are subscribed
                          to Education With Hamza.
                        </td>
                      </tr>

                    </tbody>
                  </table>

                </td>
              </tr>

            </tbody>
          </table>

        </body>
      </html>
    `

    // ---------------------------------------------------------
    // 10. Send emails one by one
    // ---------------------------------------------------------

    let sentCount = 0
    const failedEmails: string[] = []
    const successfulSubscriberIds: string[] = []

    for (const subscriber of activeSubscribers) {
      try {
        await transporter.sendMail({
          from: `"Education With Hamza" <${smtpUser}>`,
          to: subscriber.email,
          subject,
          html: emailHtml,
        })

        sentCount++

        successfulSubscriberIds.push(subscriber.id)

        console.log(`Newsletter sent successfully to ${subscriber.email}`)
      } catch (emailError) {
        console.error(`Newsletter failed for ${subscriber.email}:`, emailError)

        failedEmails.push(subscriber.email)
      }
    }

    // ---------------------------------------------------------
    // 11. Mark only successfully emailed subscribers as inactive
    // ---------------------------------------------------------

    if (successfulSubscriberIds.length > 0) {
      await prisma.subscription.updateMany({
        where: {
          id: {
            in: successfulSubscriberIds,
          },
        },
        data: {
          status: false,
        },
      })
    }

    // ---------------------------------------------------------
    // 12. Return result
    // ---------------------------------------------------------

    return NextResponse.json({
      success: sentCount > 0,

      sentCount,

      failedCount: failedEmails.length,

      articleCount: orderedArticles.length,

      articles: orderedArticles.map((article) => ({
        id: article.id,
        title: article.title,
      })),

      failedEmails,
    })
  } catch (error) {
    console.error('Newsletter sending error:', error)

    return NextResponse.json(
      {
        error: 'Internal system error while broadcasting emails.',
      },
      {
        status: 500,
      },
    )
  }
}

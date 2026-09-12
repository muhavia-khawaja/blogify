const fs = require('fs')
const { PrismaClient } = require('@prisma/client')

const env = fs
  .readFileSync('.env', 'utf8')
  .split(/\r?\n/)
  .reduce((values, line) => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      values[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
    return values
  }, {})

const prisma = new PrismaClient({ datasourceUrl: env.DATABASE_URL })

async function seedSubscriptions() {
  console.log('--- Syncing User Emails to Subscriptions ---')

  const users = await prisma.user.findMany({
    select: { email: true },
    where: {
      email: {
        not: '',
      },
    },
  })

  console.log(`Found ${users.length} users to process.`)

  for (const user of users) {
    if (!user.email) continue

    const subscription = await prisma.subscription.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        status: true,
      },
    })
    console.log(`Subscription created/verified for: ${subscription.email}`)
  }
}

seedSubscriptions()
  .catch((error) => {
    console.error('Error seeding subscriptions:', error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

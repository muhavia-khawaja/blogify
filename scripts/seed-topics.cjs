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
const names = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'Study Skills',
  'General Science',
  'Pakistan Studies',
  'Exam Preparation',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function seedTopics() {
  for (const name of names) {
    const slug = slugify(name)
    const topic = await prisma.topic.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    })
    console.log(`${topic.name} (${topic.slug})`)
  }
}

seedTopics()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

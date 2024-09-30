// prisma/seed.ts
import { promiseHash } from 'remix-utils/promise'
import { prisma } from '#app/utils/db.server.ts'
import { MOCK_CODE_GITHUB, MOCK_CODE_GOOGLE } from '#app/utils/providers/constants'
import {
  cleanupDb,
  createPassword,
  img,
} from '#tests/db-utils.ts'
import { insertGitHubUser } from '#tests/mocks/github.ts'
import { insertGoogleUser } from '#tests/mocks/google.ts'

async function seed() {
  console.log('🌱 Seeding...')
  console.time(`🌱 Database has been seeded`)

  console.time('🧹 Cleaned up the database...')
  await cleanupDb(prisma)
  console.timeEnd('🧹 Cleaned up the database...')

  console.time('🔑 Created permissions...')
  const entities = ['user', 'content']
  const actions = ['create', 'read', 'update', 'delete']
  const accesses = ['own', 'any'] as const

  let permissionsToCreate = []
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        permissionsToCreate.push({ entity, action, access })
      }
    }
  }
  await prisma.permission.createMany({ data: permissionsToCreate })
  console.timeEnd('🔑 Created permissions...')

  console.time('👑 Created roles...')
  await prisma.role.create({
    data: {
      name: 'admin',
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: 'any' },
        }),
      },
    },
  })
  await prisma.role.create({
    data: {
      name: 'user',
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: 'own' },
        }),
      },
    },
  })
  console.timeEnd('👑 Created roles...')

  console.time(`👤 Created regular user "ellemmentuser"`)
  const userImage = await img({ filepath: './tests/fixtures/images/user/elementuser.png' })
  
  await prisma.user.create({
    select: { id: true },
    data: {
      email: 'ellemmentuser@ellemment.com',
      username: 'ellemmentuser',
      name: 'Ellemment User',
      image: { create: userImage },
      password: { create: createPassword('ellemment') },
      roles: { connect: { name: 'user' } },
    },
  })
  console.timeEnd(`👤 Created regular user "ellemmentuser"`)

  console.time(`🧑‍💻 Created admin user "ellemmentdev"`)
  const ellemmentImages = await promiseHash({
    ellemmentdevUser: img({ filepath: './tests/fixtures/images/user/elementadmin.png' }),
    ellemmentLogo: img({
      altText: 'ellemments logo',
      filepath: './tests/fixtures/images/admin-content/elementlogo.png',
    }),
  })

  const githubUser = await insertGitHubUser(MOCK_CODE_GITHUB)
  const googleUser = await insertGoogleUser(MOCK_CODE_GOOGLE)

  await prisma.user.create({
    select: { id: true },
    data: {
      email: 'admin@ellemment.com',
      username: 'ellemmentadmin',
      name: 'ellemment',
      image: { create: ellemmentImages.ellemmentdevUser },
      password: { create: createPassword('ellemmentadmin') },
      connections: {
        create: [
          { providerName: 'github', providerId: githubUser.profile.id },
          { providerName: 'google', providerId: googleUser.profile.sub },
        ],
      },
      roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
      content: {
        create: [
          {
            id: 'd27a197e',
            title: 'Introduction to System Dynamics',
            content:
              'System dynamics is an approach to understanding the nonlinear behavior of complex systems over time using stocks, flows, internal feedback loops, and time delays.',
            images: { create: [ellemmentImages.ellemmentLogo] },
          },
        ],
      },
    },
  })
  console.timeEnd(`🧑‍💻 Created admin user "ellemmentdev"`)

  console.timeEnd(`🌱 Database has been seeded`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// we're ok to import from the test directory in this file
/*
eslint
  no-restricted-imports: "off",
*/
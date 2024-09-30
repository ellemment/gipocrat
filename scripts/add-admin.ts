// scripts/add-admin.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addAdminRole(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        roles: {
          connect: { name: 'admin' }
        }
      },
      include: { roles: true }
    })

    console.log(`Admin role added to user ${email}. Roles: ${user.roles.map(r => r.name).join(', ')}`)
  } catch (error) {
    console.error('Error adding admin role:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]
if (!email) {
  console.error('Please provide an email address.')
  process.exit(1)
}

void addAdminRole(email)
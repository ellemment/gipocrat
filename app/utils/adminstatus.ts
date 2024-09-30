// app/utils/adminstatus.ts

import { redirect } from '@remix-run/node'
import { getUserId, requireUserId } from './auth.server.ts'
import { prisma } from './db.server.ts'
import { requireUserWithRole } from './permissions.server.ts'

export async function checkAdminStatus(request: Request) {
  const userId = await getUserId(request)
  if (!userId) {
    throw redirect('/login?redirectTo=/admin')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true }
  })

  if (!user) {
    throw redirect('/')
  }

  let isAdmin = false
  try {
    await requireUserWithRole(request, 'admin')
    isAdmin = true
  } catch {
    // User is not an admin
  }

  return { userId, user, isAdmin }
}

export async function checkOwnerStatus(request: Request, ownerId: string) {
  const userId = await requireUserId(request)
  const isOwner = userId === ownerId

  let isAdmin = false
  try {
    await requireUserWithRole(request, 'admin')
    isAdmin = true
  } catch {
    // User is not an admin
  }

  return { isOwner, isAdmin }
}

export async function requireAdminAccess(request: Request, ownerId?: string) {
  const { isAdmin, isOwner } = await checkOwnerStatus(request, ownerId ?? '')
  
  if (!isAdmin && !(isOwner && isAdmin)) {
    throw redirect('/')
  }
}
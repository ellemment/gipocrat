// app/routes/account+/$username+/_content+/content.tsx

import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { checkAdminStatus, checkOwnerStatus } from '#app/utils/adminstatus.ts'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params, request }: LoaderFunctionArgs) {
  await checkAdminStatus(request)
  const owner = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      username: true,
    },
    where: { username: params.username },
  })
  invariantResponse(owner, 'Owner not found', { status: 404 })
  const { isAdmin, isOwner } = await checkOwnerStatus(request, owner.id)
  return json({ owner, isAdmin, isOwner })
}

export default function ContentRoute() {

  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  )
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => (
          <p>No user with the username "{params.username}" exists</p>
        ),
      }}
    />
  )
}
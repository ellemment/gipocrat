// app/routes/account+/index.tsx

import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { checkAdminStatus } from '#app/utils/adminstatus.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { getUserImgSrc } from '#app/utils/misc.tsx'


export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request, {
    redirectTo: '/login',
  })
  const { isAdmin } = await checkAdminStatus(request)

  const user = await prisma.user.findUniqueOrThrow({
    select: {
      id: true,
      name: true,
      username: true,
      createdAt: true,
      image: { select: { id: true } },
    },
    where: { id: userId },
  })

  return json({
    user,
    userJoinedDisplay: user.createdAt.toLocaleDateString(),
    isAdmin,
    isLoggedInUser: true,
    isAdminAndOwner: isAdmin,
  })
}

export default function ProfileRoute() {
  const data = useLoaderData<typeof loader>()
  const { user, isLoggedInUser } = data
  const userDisplayName = user.name ?? user.username

  return (
    <div className="container mb-48 mt-36 flex flex-col items-center justify-center">
      <Spacer size="4xs" />
      <div className="container flex flex-col items-center rounded-3xl bg-muted p-12">
        <div className="relative w-52">
          <div className="absolute -top-40">
            <div className="relative">
              <img
                src={getUserImgSrc(user.image?.id)}
                alt={userDisplayName}
                className="h-52 w-52 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
        <Spacer size="sm" />
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <h1 className="text-center text-h2">{userDisplayName}</h1>
          </div>
          <p className="mt-2 text-center text-muted-foreground">
            Joined {data.userJoinedDisplay}
          </p> 
          </div>
        </div>
      </div>
  )
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const displayName = data?.user.name ?? data?.user.username
  return [
    { title: `${displayName} | ellemment` },
    {
      name: 'description',
      content: `Profile of ${displayName} on ellemment`,
    },
  ]
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => <p>User not found</p>,
      }}
    />
  )
}
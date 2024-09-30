// app/routes/account+/$username.tsx

import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { checkAdminStatus } from '#app/utils/adminstatus.ts'
import { prisma } from '#app/utils/db.server.ts'
import { getUserImgSrc } from '#app/utils/misc.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
    const { isAdmin, user: loggedInUser } = await checkAdminStatus(request)

    const user = await prisma.user.findFirst({
        select: {
            id: true,
            name: true,
            username: true,
            createdAt: true,
            image: { select: { id: true } },
        },
        where: {
            username: params.username,
        },
    })

    invariantResponse(user, 'User not found', { status: 404 })

    const isOwner = loggedInUser?.id === user.id

    return json({
        user,
        userJoinedDisplay: user.createdAt.toLocaleDateString(),
        isAdmin,
        isLoggedInUser: isOwner,
        isAdminAndOwner: isAdmin && isOwner,
    })
}

export default function ProfileRoute() {
    const data = useLoaderData<typeof loader>()
    const { user, isLoggedInUser, isAdminAndOwner } = data
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
                    {isLoggedInUser ? (
                        <Form action="/logout" method="POST" className="mt-3">
                            <Button type="submit" variant="link" size="pill">
                                <Icon name="exit" className="scale-125 max-md:scale-150">
                                    Logout
                                </Icon>
                            </Button>
                        </Form>
                    ) : null}
                    <div className="mt-10 flex gap-4">
                        {isLoggedInUser ? (
                            <Button asChild>
                                <Link to={`/account/settings`} prefetch="intent">
                                    Settings
                                </Link>
                            </Button>
                        ) : null}
                        {isAdminAndOwner ? (
                            <Button asChild>
                                <Link to="/admin" prefetch="intent">
                                    Dashboard
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
    const displayName = data?.user.name ?? params.username
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
                404: ({ params }) => (
                    <p>No user with the username "{params.username}" exists</p>
                ),
            }}
        />
    )
}
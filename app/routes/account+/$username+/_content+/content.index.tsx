// app/routes/account+/$username+/_content+/content.index.tsx

import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { checkAdminStatus, requireAdminAccess } from '#app/utils/adminstatus.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type loader as contentLoader } from './content.tsx'

type Owner = {
  id: string
  name: string | null
  username: string
  content: Array<{ id: string }>
}


export async function loader({ params, request }: LoaderFunctionArgs) {
  const { userId, isAdmin } = await checkAdminStatus(request)
  const owner = await prisma.user.findUnique({
    where: { username: params.username },
    select: { id: true, name: true, username: true, content: { select: { id: true } } },
  })

  if (!owner) {
    throw new Response('Not found', { status: 404 })
  }

  await requireAdminAccess(request, owner.id)
  const isOwner = userId === owner.id

  return json({ isAdmin, isOwner, owner })
}

export default function ContentIndexRoute() {
  const data = useLoaderData<typeof loader>()
  const contentCount = (data.owner as Owner).content?.length ?? 0

  return (
    <div className="container pt-12">
      <p className="text-body-md">
        {contentCount === 0
          ? "No content available. Create new content using the 'New Content' button."
          : `Select a content item from the list (${contentCount} item${
              contentCount === 1 ? '' : 's'
            } available).`}
      </p>
    </div>
  )
}

export const meta: MetaFunction<
  typeof loader,
  { 'routes/account+/$username+/_content+/content': typeof contentLoader }
> = ({ data, params, matches }) => {
  const contentMatch = matches.find(
    (m) => m.id === 'routes/account+/$username+/_content+/content'
  )
  const owner = data?.owner as Owner | undefined
  const contentMatchOwner = contentMatch?.data?.owner as Owner | undefined
  const displayName = owner?.name ?? contentMatchOwner?.name ?? params.username
  const contentCount = owner?.content?.length ?? contentMatchOwner?.content?.length ?? 0
  const contentText = contentCount === 1 ? 'content' : 'contents'

  return [
    { title: `${displayName}'s Content | ellemment` },
    {
      name: 'description',
      content: `Manage ${displayName}'s ${contentCount} ${contentText} on ellemment`,
    },
  ]
}
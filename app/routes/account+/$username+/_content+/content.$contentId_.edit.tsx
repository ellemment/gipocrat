// app/routes/admin+/content+/$username_+/content.$contentId_.edit.tsx

import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { checkAdminStatus, requireAdminAccess } from '#app/utils/adminstatus.ts'
import { prisma } from '#app/utils/db.server.ts'
import { ContentEditor } from './__content-editor.tsx'

export { action } from './__content-editor.server.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { userId, isAdmin } = await checkAdminStatus(request)

  const content = await prisma.content.findUnique({
    select: {
      id: true,
      title: true,
      content: true,
      ownerId: true,
      images: {
        select: {
          id: true,
          altText: true,
        },
      },
    },
    where: {
      id: params.contentId,
    },
  })

  invariantResponse(content, 'Not found', { status: 404 })

  const isOwner = content.ownerId === userId

  // This will throw a redirect if the user doesn't have access
  await requireAdminAccess(request, content.ownerId)

  return json({ content, isOwner, isAdmin })
}

export default function ContentEdit() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <ContentEditor
        content={data.content}
        isAdmin={data.isAdmin}
        isOwner={data.isOwner}
      />
    </div>
  )
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        403: () => <p>You are not allowed to edit this content</p>,
        404: ({ params }) => (
          <p>No content with the id "{params.contentId}" exists</p>
        ),
      }}
    />
  )
}
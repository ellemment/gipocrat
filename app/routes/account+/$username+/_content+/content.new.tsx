// app/routes/admin+/content+/$username_+/content.new.tsx

import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { checkAdminStatus, requireAdminAccess } from '#app/utils/adminstatus.ts'
import { prisma } from '#app/utils/db.server.ts'
import { ContentEditor } from './__content-editor.tsx'

export { action } from './__content-editor.server.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { userId } = await checkAdminStatus(request)

  const owner = await prisma.user.findUnique({
    where: { username: params.username },
    select: { id: true },
  })

  if (!owner) {
    throw new Response('Not found', { status: 404 })
  }

  const isOwner = userId === owner.id

  try {
    await requireAdminAccess(request, owner.id)
  } catch {
    // If requireAdminAccess throws, redirect to the user's content page
    return redirect(`/account/${params.username}`)
  }

  const { isAdmin } = await checkAdminStatus(request)

  return json({ isAdmin, isOwner })
}

export default function NewContent() {
  const data = useLoaderData<typeof loader>()
  return <ContentEditor isAdmin={data.isAdmin} isOwner={data.isOwner} />
}
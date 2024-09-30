// app/routes/account+/$username+/_content+/content.$contentId.tsx

import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { checkAdminStatus, requireAdminAccess, checkOwnerStatus } from '#app/utils/adminstatus.ts'
import { prisma } from '#app/utils/db.server.ts'
import { getContentImgSrc, useIsPending } from '#app/utils/misc.tsx'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { type loader as contentLoader } from './content.tsx'
import { sanitizeHtml } from './utils/sanitizer.server.ts'



export async function loader({ params, request }: LoaderFunctionArgs) {
  const { isAdmin } = await checkAdminStatus(request)

  const content = await prisma.content.findUnique({
    where: { id: params.contentId },
    select: {
      id: true,
      title: true,
      content: true,
      ownerId: true,
      updatedAt: true,
      images: {
        select: {
          id: true,
          altText: true,
        },
      },
    },
  })

  invariantResponse(content, 'Not found', { status: 404 })

  const date = new Date(content.updatedAt)
  const timeAgo = formatDistanceToNow(date)

  const { isOwner } = await checkOwnerStatus(request, content.ownerId)
  const owner = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      username: true,
    },
    where: { username: params.username },
  })

  // This will throw a redirect if the user doesn't have access
  await requireAdminAccess(request, content.ownerId)

  // Sanitize the HTML content on the server
  const sanitizedContent = await sanitizeHtml(content.content)

  return json({
    owner,
    content: { ...content, content: sanitizedContent },
    timeAgo,
    isOwner,
    isAdmin,
  })
}

const DeleteFormSchema = z.object({
  intent: z.literal('delete-content'),
  contentId: z.string(),
})

export async function action({ request }: ActionFunctionArgs) {
  await checkAdminStatus(request)
  const formData = await request.formData()
  const submission = parseWithZod(formData, {
    schema: DeleteFormSchema,
  })
  if (submission.status !== 'success') {
    return json(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 },
    )
  }

  const { contentId } = submission.value

  const content = await prisma.content.findFirst({
    select: { id: true, ownerId: true, owner: { select: { username: true } } },
    where: { id: contentId },
  })
  invariantResponse(content, 'Not found', { status: 404 })

  // This will throw a redirect if the user doesn't have access
  await requireAdminAccess(request, content.ownerId)

  await prisma.content.delete({ where: { id: content.id } })

  return redirectWithToast(`/account/${content.owner.username}/content`, {
    type: 'success',
    title: 'Success',
    description: 'Your content has been deleted.',
  })
}

export default function ContentRoute() {
  const data = useLoaderData<typeof loader>()

  if (!data || !data.content) {
    return <div>Error loading content. Please try again.</div>
  }

  const { content, timeAgo, isOwner, isAdmin } = data
  const canEdit = isAdmin || (isOwner && isAdmin)
  const canDelete = isAdmin || (isOwner && isAdmin)

  return (
    <div className="flex flex-col px-10">
      <h2 className="mb-2 text-h2 lg:mb-6">{content.title}</h2>
      <div className={`${canEdit || canDelete ? 'pb-24' : 'pb-12'} overflow-y-auto`}>
        <ul className="flex flex-wrap gap-5 py-5">
          {content.images.map((image) => (
            <li key={image.id}>
              <a href={getContentImgSrc(image.id)}>
                <img
                  src={getContentImgSrc(image.id)}
                  alt={image.altText ?? ''}
                  className="h-32 w-32 rounded-lg object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
        <div 
          className="whitespace-break-spaces text-sm md:text-lg"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </div>
      {(canEdit || canDelete) && (
        <>
          <span className="text-sm text-foreground/90 max-[524px]:hidden">
            <Icon name="clock" className="scale-125">
              {timeAgo} ago by {data.owner?.name ?? 'Unknown'}
            </Icon>
          </span>
          <div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
            {canDelete && <DeleteContent id={content.id} />}
            {canEdit && (
              <Button
                asChild
                className="min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0"
              >
                <Link to="edit">
                  <Icon name="pencil-1" className="scale-125 max-md:scale-150">
                    <span className="max-md:hidden">Edit</span>
                  </Icon>
                </Link>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export function DeleteContent({ id }: { id: string }) {
  const actionData = useActionData<typeof action>()
  const isPending = useIsPending()
  const [form] = useForm({
    id: 'delete-content',
    lastResult: actionData?.result,
  })

  return (
    <Form method="POST" {...getFormProps(form)}>
      <input type="hidden" name="contentId" value={id} />
      <StatusButton
        type="submit"
        name="intent"
        value="delete-content"
        variant="destructive"
        status={isPending ? 'pending' : form.status ?? 'idle'}
        disabled={isPending}
        className="w-full max-md:aspect-square max-md:px-0"
      >
        <Icon name="trash" className="scale-125 max-md:scale-150">
          <span className="max-md:hidden">Delete</span>
        </Icon>
      </StatusButton>
      <ErrorList errors={form.errors} id={form.errorId} />
    </Form>
  )
}

export const meta: MetaFunction<
  typeof loader,
  { 'routes/account+/$username+/_content+/content': typeof contentLoader }
> = ({ data, params, matches }) => {
  const contentMatch = matches.find(
    (m) => m.id === 'routes/account+/$username+/_content+/content',
  )
  const displayName = contentMatch?.data?.owner.name ?? params.username
  const contentTitle = data?.content.title ?? 'Content'
  const contentContentSummary =
    data && data.content.content.length > 100
      ? data.content.content.slice(0, 97) + '...'
      : 'No content'
  return [
    { title: `${contentTitle} | ${displayName}'s Content | ellemment` },
    {
      name: 'description',
      content: contentContentSummary,
    },
  ]
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        403: () => <p>You are not allowed to do that</p>,
        404: ({ params }) => (
          <p>No content with the id "{params.contentId}" exists</p>
        ),
      }}
    />
  )
}
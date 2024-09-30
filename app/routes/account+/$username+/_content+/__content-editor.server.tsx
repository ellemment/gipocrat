// app/routes/account+/$username+/_content+/__content-editor.server.tsx

import { parseWithZod } from '@conform-to/zod'
import { createId as cuid } from '@paralleldrive/cuid2'
import {
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
  redirect,
  type ActionFunctionArgs,
} from '@remix-run/node'
import { checkAdminStatus, checkOwnerStatus } from '#app/utils/adminstatus.ts'
import { prisma } from '#app/utils/db.server.ts'
import {
  MAX_UPLOAD_SIZE,
  ContentEditorSchema,
  type ImageFieldset,
} from './utils/contentEditorSchema'

function imageHasFile(
  image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
  return Boolean(image.file?.size && image.file?.size > 0)
}

function imageHasId(
  image: ImageFieldset,
): image is ImageFieldset & { id: NonNullable<ImageFieldset['id']> } {
  return image.id != null
}

export async function action({ request }: ActionFunctionArgs) {
  const { userId, isAdmin } = await checkAdminStatus(request)

  const formData = await parseMultipartFormData(
    request,
    createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
  )

  const action = formData.get('_action')

  const submission = await parseWithZod(formData, {
    schema: ContentEditorSchema.superRefine(async (data, ctx) => {
      if (!data.id) return // This is a new content creation
      const content = await prisma.content.findUnique({
        select: { id: true, ownerId: true },
        where: { id: data.id },
      })
      if (!content) {
        ctx.addIssue({
          code: 'custom',
          message: 'Content not found',
        })
      } else {
        const { isOwner } = await checkOwnerStatus(request, content.ownerId)
        if (!isAdmin && !isOwner) {
          ctx.addIssue({
            code: 'custom',
            message: 'You do not have permission to edit this content',
          })
        }
      }
    }).transform(async ({ images = [], ...data }) => {
      return {
        ...data,
        imageUpdates: await Promise.all(
          images.filter(imageHasId).map(async (i) => {
            if (imageHasFile(i)) {
              return {
                id: i.id,
                altText: i.altText,
                contentType: i.file.type,
                blob: Buffer.from(await i.file.arrayBuffer()),
              }
            } else {
              return {
                id: i.id,
                altText: i.altText,
              }
            }
          }),
        ),
        newImages: await Promise.all(
          images
            .filter(imageHasFile)
            .filter((i) => !i.id)
            .map(async (image) => {
              return {
                altText: image.altText,
                contentType: image.file.type,
                blob: Buffer.from(await image.file.arrayBuffer()),
              }
            }),
        ),
      }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return json(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 },
    )
  }

  const {
    id: contentId,
    title,
    content,
    imageUpdates = [],
    newImages = [],
  } = submission.value

  // Check if the user is allowed to create/edit content
  if (contentId) {
    const contentOwnerId = await getContentOwnerId(contentId)
    if (contentOwnerId) {
      const { isOwner } = await checkOwnerStatus(request, contentOwnerId)
      if (!isAdmin && !isOwner) {
        return json(
          { error: 'You do not have permission to edit this content' },
          { status: 403 },
        )
      }
    }
  }

  const isPublished = action === 'publish'

  const updatedContent = await prisma.content.upsert({
    select: { id: true, ownerId: true },
    where: { id: contentId ?? '__new_content__' },
    create: {
      ownerId: userId,
      title,
      content, // Save HTML content as-is
      images: { create: newImages },
      status: isPublished ? 'published' : 'draft',
    },
    update: {
      title,
      content, // Save HTML content as-is
      status: isPublished ? 'published' : 'draft',
      images: {
        deleteMany: { id: { notIn: imageUpdates.map((i) => i.id) } },
        updateMany: imageUpdates.map((updates) => ({
          where: { id: updates.id },
          data: { ...updates, id: updates.blob ? cuid() : updates.id },
        })),
        create: newImages,
      },
    },
  })

  if (action === 'saveDraft') {
    return json({ draftSaved: true, contentId: updatedContent.id })
  }

  const owner = await prisma.user.findUnique({
    where: { id: updatedContent.ownerId },
    select: { username: true },
  })

  if (!owner) {
    throw new Error('Owner not found')
  }

  return redirect(
    `/account/${owner.username}/content/${updatedContent.id}`,
  )
}


async function getContentOwnerId(contentId: string): Promise<string | null> {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { ownerId: true },
  })
  return content?.ownerId ?? null
}
// app/routes/account+/$username+/_content+/utils/useContentEditorForm.ts

import { useForm, useInputControl ,type  SubmissionResult } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import  { type Content, type ContentImage } from '@prisma/client'
import  { type SerializeFrom } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { ContentEditorSchema } from './contentEditorSchema'

export function useContentEditorForm(
  content?: SerializeFrom<
    Pick<Content, 'id' | 'title' | 'content'> & {
      images: Array<Pick<ContentImage, 'id' | 'altText'>>
    }
  >
) {
  const actionData = useActionData<{ result: SubmissionResult }>()

  const [form, fields] = useForm({
    id: 'content-editor',
    constraint: getZodConstraint(ContentEditorSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ContentEditorSchema })
    },
    defaultValue: {
      ...content,
      images: content?.images ?? [{}],
    },
    shouldRevalidate: 'onBlur',
  })

  const titleControl = useInputControl(fields.title)
  const contentControl = useInputControl(fields.content)

  return { form, fields, titleControl, contentControl }
}
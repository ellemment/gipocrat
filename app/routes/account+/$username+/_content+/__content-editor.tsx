// app/routes/account+/$username+/_content+/__content-editor.tsx

import { FormProvider, getFormProps } from '@conform-to/react'
import { type Content, type ContentImage } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form, useSubmit } from '@remix-run/react'
import { useState, useCallback } from 'react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList } from '#app/components/forms'
import TiptapEditor from '#app/components/TiptapEditor'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { useIsPending } from '#app/utils/misc.tsx'
import { ImageChooser } from './utils/ImageChooser'
import { useAutoSave } from './utils/useAutoSave'
import { useContentEditorForm } from './utils/useContentEditorForm'

export function ContentEditor({
  content,
  isAdmin,
  isOwner,
}: {
  content?: SerializeFrom<
    Pick<Content, 'id' | 'title' | 'content'> & {
      images: Array<Pick<ContentImage, 'id' | 'altText'>>
    }
  >
  isAdmin: boolean
  isOwner: boolean
}) {
  const isPending = useIsPending()
  const submit = useSubmit()
  const { form, fields, titleControl, contentControl } = useContentEditorForm(content)
  const { isAutoSaving, debouncedAutoSave, autoSaveResult } = useAutoSave()
  const imageList = fields.images.getFieldList()
  const [uploadedImages, setUploadedImages] = useState<File[]>([])

  const handleImageUpload = useCallback((file: File) => {
    setUploadedImages(prev => [...prev, file])
  }, [])

  const canEdit = isAdmin || (isOwner && isAdmin)

  if (!canEdit) {
    return (
      <div className="p-4">
        <p>You do not have permission to edit this content.</p>
      </div>
    )
  }

  return (
    <FormProvider context={form.context}>
      <Form
        method="POST"
        className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
        {...getFormProps(form)}
        onChange={(e) => {
          const formData = new FormData(e.currentTarget)
          debouncedAutoSave(formData)
        }}
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          formData.append('_action', 'publish')
          uploadedImages.forEach((file, index) => {
            formData.append(`image-${index}`, file)
          })
          submit(formData, { method: 'POST', encType: 'multipart/form-data' })
        }}
        encType="multipart/form-data"
      >
        {/* ... (rest of the form) ... */}
        
        <TiptapEditor
          title={titleControl.value ?? ''}
          content={contentControl.value ?? ''}
          onTitleChange={titleControl.change}
          onContentChange={contentControl.change}
          onImageUpload={handleImageUpload}
        />
        <ErrorList id={fields.title.errorId} errors={fields.title.errors} />
        <ErrorList id={fields.content.errorId} errors={fields.content.errors} />
        
        <div>
          <Label>Images</Label>
          <ul className="flex flex-col gap-4">
            {imageList.map((image, index) => (
              <li
                key={image.key}
                className="relative border-b-2 border-muted-foreground"
              >
                <button
                  className="absolute right-0 top-0 text-foreground-destructive"
                  {...form.remove.getButtonProps({
                    name: fields.images.name,
                    index,
                  })}
                >
                  <span aria-hidden>
                    <Icon name="cross-1" />
                  </span>{' '}
                  <span className="sr-only">
                    Remove image {index + 1}
                  </span>
                </button>
                <ImageChooser meta={image} />
              </li>
            ))}
          </ul>
        </div>
        <Button
          className="mt-3"
          {...form.insert.getButtonProps({ name: fields.images.name })}
        >
          <span aria-hidden>
            <Icon name="plus">Image</Icon>
          </span>{' '}
          <span className="sr-only">Add image</span>
        </Button>

        <div className="flex justify-between items-center gap-4 mt-6">
          <div>
            {isAutoSaving ? (
              <span className="text-sm text-muted-foreground">Saving draft...</span>
            ) : autoSaveResult && 'draftSaved' in autoSaveResult ? (
              <span className="text-sm text-muted-foreground">Draft saved</span>
            ) : (
              <span className="text-sm text-muted-foreground">Draft not saved</span>
            )}
          </div>
          <div className="flex gap-4">
            <Button variant="destructive" {...form.reset.getButtonProps()}>
              Reset
            </Button>
            <StatusButton
              form={form.id}
              type="submit"
              disabled={isPending}
              status={isPending ? 'pending' : 'idle'}
            >
              Publish
            </StatusButton>
          </div>
        </div>
      </Form>
    </FormProvider>
  )
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => (
          <p>No content with the id "{params.contentId}" exists</p>
        ),
      }}
    />
  )
}
// app/routes/account+/$username+/_content+/utils/ImageChooser.tsx

import { getFieldsetProps, getInputProps , type FieldMetadata } from '@conform-to/react'
import React, { useState } from 'react'
import { ErrorList } from '#app/components/forms'
import { Icon } from '#app/components/ui/icon'
import { cn, getContentImgSrc } from '#app/utils/misc'
import  { type ImageFieldset } from './contentEditorSchema'

export function ImageChooser({ meta }: { meta: FieldMetadata<ImageFieldset> }) {
  const fields = meta.getFieldset()
  const existingImage = Boolean(fields.id.initialValue)
  const [previewImage, setPreviewImage] = useState<string | null>(
    fields.id.initialValue ? getContentImgSrc(fields.id.initialValue) : null,
  )
  const [altText, setAltText] = useState(fields.altText.initialValue ?? '')

  return (
    <fieldset {...getFieldsetProps(meta)}>
      <div className="flex gap-3">
        <div className="w-32">
          <div className="relative h-32 w-32">
            <label
              htmlFor={fields.file.id}
              className={cn('group absolute h-32 w-32 rounded-lg', {
                'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
                  !previewImage,
                'cursor-pointer focus-within:ring-2': !existingImage,
              })}
            >
              {previewImage ? (
                <div className="relative">
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Alt text"
                    className="w-full p-1 text-sm"
                  />
                  <img
                    src={previewImage}
                    alt={altText ?? ''}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  {existingImage ? null : (
                    <div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
                      new
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
                  <Icon name="plus" />
                </div>
              )}
              {existingImage ? (
                <input {...getInputProps(fields.id, { type: 'hidden' })} />
              ) : null}
              <input
                aria-label="Image"
                className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
                onChange={(event) => {
                  const file = event.target.files?.[0]

                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setPreviewImage(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  } else {
                    setPreviewImage(null)
                  }
                }}
                accept="image/*"
                {...getInputProps(fields.file, { type: 'file' })}
              />
            </label>
          </div>
          <div className="min-h-[32px] px-4 pb-3 pt-1">
            <ErrorList id={fields.file.errorId} errors={fields.file.errors} />
          </div>
        </div>
      </div>
      <div className="min-h-[32px] px-4 pb-3 pt-1">
        <ErrorList id={meta.errorId} errors={meta.errors} />
      </div>
    </fieldset>
  )
}
// app/components/types/content/ContentErrorBoundary.tsx
import { GeneralErrorBoundary } from '#app/components/error-boundary'

export function ContentErrorBoundary() {
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
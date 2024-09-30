// app/routes/account+/$username+/_content+/utils/useAutoSave.ts

import { useFetcher } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from '#app/utils/misc'

type AutoSaveResult = {
  draftSaved: boolean
  contentId?: string
}

export function useAutoSave(delay = 1000) {
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const autoSaveFetcher = useFetcher<AutoSaveResult>()

  const handleAutoSave = useCallback((formData: FormData) => {
    setIsAutoSaving(true)
    formData.set('_action', 'saveDraft')
    autoSaveFetcher.submit(formData, { method: 'POST', encType: 'multipart/form-data' })
  }, [autoSaveFetcher])

  const debouncedAutoSave = useDebounce(handleAutoSave, delay)

  useEffect(() => {
    if (autoSaveFetcher.state === 'idle' && isAutoSaving) {
      setIsAutoSaving(false)
    }
  }, [autoSaveFetcher.state, isAutoSaving])

  return { isAutoSaving, debouncedAutoSave, autoSaveResult: autoSaveFetcher.data }
}
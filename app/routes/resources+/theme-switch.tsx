// app/routes/resources+/theme-switch.tsx

import { useForm, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { redirect, useFetcher, useFetchers } from '@remix-run/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ServerOnly } from 'remix-utils/server-only'
import { z } from 'zod'
import { Icon } from '#app/components/ui/icon.tsx'
import { useHints } from '#app/utils/client-hints.tsx'
import { useRequestInfo } from '#app/utils/request-info.ts'
import { type Theme, setTheme } from '#app/utils/theme.server.ts'

const ThemeFormSchema = z.object({
  theme: z.enum(['light', 'dark']),
  redirectTo: z.string().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, {
    schema: ThemeFormSchema,
  })
  invariantResponse(submission.status === 'success', 'Invalid theme received')
  const { theme, redirectTo } = submission.value
  const responseInit = {
    headers: { 'set-cookie': setTheme(theme) },
  }
  if (redirectTo) {
    return redirect(redirectTo, responseInit)
  } else {
    return json({ result: submission.reply() }, responseInit)
  }
}

export function ThemeSwitch({
	userPreference,
  }: {
	userPreference?: Theme | null
  }) {
	const fetcher = useFetcher<typeof action>()
	const requestInfo = useRequestInfo()
	const [form] = useForm({
	  id: 'theme-switch',
	  lastResult: fetcher.data?.result,
	})
	const optimisticMode = useOptimisticThemeMode()
	const mode = optimisticMode ?? userPreference ?? 'dark'
	const nextMode = mode === 'light' ? 'dark' : 'light'
	const [isAnimating, setIsAnimating] = useState(false)
  
	const handleClick = () => {
	  setIsAnimating(true)
	  setTimeout(() => setIsAnimating(false), 600)
	}
  
	const iconVariants = {
	  initial: { rotate: 0, scale: 1 },
	  animate: { rotate: 360, scale: [1, 1.1, 1] },
	}
  
	return (
	  <fetcher.Form
		method="POST"
		{...getFormProps(form)}
		action="/resources/theme-switch"
	  >
		<ServerOnly>
		  {() => (
			<input type="hidden" name="redirectTo" value={requestInfo.path} />
		  )}
		</ServerOnly>
		<input type="hidden" name="theme" value={nextMode} />
		<div className="flex gap-2 p-3">
		  <AnimatePresence mode="wait">
			<motion.button
			  key={mode}
			  type="submit"
			  className="flex h-4 w-4 cursor-pointer items-center justify-center"
			  onClick={handleClick}
			  initial="initial"
			  animate={isAnimating ? "animate" : "initial"}
			  variants={iconVariants}
			  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
			>
			  <Icon
				name="half-2"
				className="h-4 w-4 fill-neutral-950 dark:fill-neutral-200 transition-colors duration-300"
			  />
			</motion.button>
		  </AnimatePresence>
		</div>
	  </fetcher.Form>
	)
  }
  


export function useOptimisticThemeMode() {
  const fetchers = useFetchers()
  const themeFetcher = fetchers.find(
    (f) => f.formAction === '/resources/theme-switch',
  )
  if (themeFetcher && themeFetcher.formData) {
    const submission = parseWithZod(themeFetcher.formData, {
      schema: ThemeFormSchema,
    })
    if (submission.status === 'success') {
      return submission.value.theme
    }
  }
}

export function useTheme() {
  const hints = useHints()
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()
  if (optimisticMode) {
    return optimisticMode
  }
  return requestInfo.userPrefs.theme ?? 'dark'
}
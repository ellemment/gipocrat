// app/routes/account+/_settings+/settings.username.tsx

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import {
	json,
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
} from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { UsernameSchema } from '#app/utils/user-validation.ts'
import { type BreadcrumbHandle } from './settings.tsx'

export const handle: BreadcrumbHandle & SEOHandle = {
	breadcrumb: <Icon name="avatar">Username</Icon>,
	getSitemapEntries: () => null,
}

const UsernameFormSchema = z.object({
	username: UsernameSchema,
})

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: { username: true },
	})
	return json({ user })
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const submission = await parseWithZod(formData, {
		schema: UsernameFormSchema.superRefine(async ({ username }, ctx) => {
			const existingUsername = await prisma.user.findUnique({
				where: { username },
				select: { id: true },
			})
			if (existingUsername && existingUsername.id !== userId) {
				ctx.addIssue({
					path: ['username'],
					code: z.ZodIssueCode.custom,
					message: 'A user already exists with this username',
				})
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { username } = submission.value

	await prisma.user.update({
		where: { id: userId },
		data: { username },
	})

	return redirectWithToast('/account/settings', {
		title: 'Username Updated',
		description: `Your username has been changed to ${username}`,
		type: 'success',
	})
}

export default function UsernameRoute() {
	const data = useLoaderData<typeof loader>()
	const fetcher = useFetcher<typeof action>()

	const [form, fields] = useForm({
		id: 'username-form',
		constraint: getZodConstraint(UsernameFormSchema),
		lastResult: fetcher.data?.submission as any, // Type assertion to resolve the type mismatch
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: UsernameFormSchema })
		},
		defaultValue: { username: data.user.username },
	})

	return (
		<fetcher.Form method="POST" {...getFormProps(form)}>
			<Field
				labelProps={{ children: 'Username' }}
				inputProps={{
					...getInputProps(fields.username, { type: 'text' }),
				}}
				errors={fields.username.errors}
			/>
			<ErrorList errors={form.errors} id={form.errorId} />
			<StatusButton
				type="submit"
				status={fetcher.state === 'submitting' ? 'pending' : 'idle'}
			>
				Save Username
			</StatusButton>
		</fetcher.Form>
	)
}
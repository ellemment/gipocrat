// app/routes/account+/_settings+/settings.download-data.tsx

import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from './settings.tsx'

export const handle: BreadcrumbHandle & SEOHandle = {
	breadcrumb: <Icon name="download">Download Data</Icon>,
	getSitemapEntries: () => null,
}

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export default function DownloadDataRoute() {
	return (
		<div className="mx-auto max-w-md">
			<h1 className="text-h1">Download Your Data</h1>
			<p className="mt-4">
				You can download all of your data as a JSON file. This file will contain
				all the information associated with your account.
			</p>
			<div className="mt-6">
				<Button asChild>
					<Link
						reloadDocument
						download="my-epic-content-data.json"
						to="/resources/download-user-data"
					>
						<Icon name="download">Download Your Data</Icon>
					</Link>
				</Button>
			</div>
		</div>
	)
}
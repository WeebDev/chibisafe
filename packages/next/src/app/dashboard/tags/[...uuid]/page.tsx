import type { Metadata } from 'next';
import type { PageQuery } from '@/types';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Tags'
};

export default async function TagPage({
	searchParams,
	params
}: {
	readonly params: { uuid: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const { data: meta, response } = await openAPIClient.GET('/api/v1/tags/{uuid}', {
		params: {
			path: {
				uuid: params.uuid
			}
		}
	});

	if (response.status === 401) {
		redirect('/login');
	}

	const { data, error } = await openAPIClient.GET('/api/v1/tags/{uuid}/files', {
		params: {
			path: {
				uuid: params.uuid
			},
			query: {
				offset: currentPage - 1,
				limit: perPage,
				search
			}
		}
	});

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<>
			<DashboardHeader
				title={meta?.name ?? ''}
				breadcrumbs={[
					{ name: 'Tags', url: '/dashboard/tags' },
					{ name: meta?.name ?? '', url: `/dashboard/tags/${params.uuid}` }
				]}
			>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Upload file
				</Button>
			</DashboardHeader>
			<div className="px-2 w-full">
				<div className="grid gap-4">
					<Suspense>
						<Pagination itemsTotal={data.count} type="tag" />
						<FilesWrapper files={data.results} total={data.count} type="tag" />
						<Pagination itemsTotal={data.count} type="tag" />
					</Suspense>
					<FileDialog />
				</div>
			</div>
		</>
	);
}
